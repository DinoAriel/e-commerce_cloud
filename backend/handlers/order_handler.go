package handlers

import (
	"backend/middleware"
	"backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
)

type OrderHandler struct {
	DB *pgxpool.Pool
}

func NewOrderHandler(db *pgxpool.Pool) *OrderHandler {
	return &OrderHandler{DB: db}
}

func (h *OrderHandler) CreateOrder(c *fiber.Ctx) error {
	var input models.CreateOrderInput
	if err := c.BodyParser(&input); err != nil {
		return models.Error(c, "Request body tidak valid", 400)
	}

	if err := middleware.ValidateRequired(map[string]string{
		"user_id": input.UserID, "shipping_address": input.ShippingAddress,
	}); err != nil {
		return models.Error(c, err.Error(), 400)
	}
	if err := middleware.ValidateUUID("user_id", input.UserID); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	tx, err := h.DB.Begin(c.Context())
	if err != nil {
		return models.Error(c, "Gagal memulai transaksi", 500)
	}
	defer tx.Rollback(c.Context())

	rows, err := tx.Query(c.Context(), `
		SELECT ci.id, ci.product_id, ci.quantity, p.price, p.stock, p.is_active
		FROM cart_items ci
		JOIN products p ON ci.product_id = p.id
		WHERE ci.user_id = $1::uuid`, input.UserID)
	if err != nil {
		return models.Error(c, "Gagal mengambil cart", 500)
	}

	type cartRow struct {
		ID        string
		ProductID string
		Quantity  int
		Price     int
		Stock     int
		IsActive  bool
	}
	var cartItems []cartRow
	for rows.Next() {
		var ci cartRow
		if err := rows.Scan(&ci.ID, &ci.ProductID, &ci.Quantity, &ci.Price, &ci.Stock, &ci.IsActive); err != nil {
			rows.Close()
			return models.Error(c, "Gagal scan cart", 500)
		}
		cartItems = append(cartItems, ci)
	}
	rows.Close()

	if len(cartItems) == 0 {
		return models.Error(c, "Cart kosong, tidak bisa membuat order", 400)
	}

	totalAmount := 0
	for _, ci := range cartItems {
		if !ci.IsActive {
			return models.Error(c, "Produk tidak aktif", 400)
		}
		if ci.Stock < ci.Quantity {
			return models.Error(c, "Stok produk tidak cukup", 400)
		}
		totalAmount += ci.Price * ci.Quantity
	}

	var order models.Order
	err = tx.QueryRow(c.Context(), `
		INSERT INTO orders (user_id, total_amount, status, shipping_address)
		VALUES ($1::uuid, $2, 'pending', $3)
		RETURNING id, user_id, total_amount, status, shipping_address, created_at`,
		input.UserID, totalAmount, input.ShippingAddress,
	).Scan(&order.ID, &order.UserID, &order.TotalAmount, &order.Status, &order.ShippingAddress, &order.CreatedAt)
	if err != nil {
		return models.Error(c, "Gagal membuat order", 500)
	}

	var orderItems []models.OrderItemWithProduct
	for _, ci := range cartItems {
		var oi models.OrderItemWithProduct
		err := tx.QueryRow(c.Context(), `
			INSERT INTO order_items (order_id, product_id, quantity, price)
			VALUES ($1::uuid, $2::uuid, $3, $4)
			RETURNING id, order_id, product_id, quantity, price`,
			order.ID, ci.ProductID, ci.Quantity, ci.Price,
		).Scan(&oi.ID, &oi.OrderID, &oi.ProductID, &oi.Quantity, &oi.Price)
		if err != nil {
			return models.Error(c, "Gagal membuat order item", 500)
		}

		err = tx.QueryRow(c.Context(), `
			SELECT id, name, species, price, description, image_url, badge, category_id, stock, is_active, created_at
			FROM products WHERE id = $1`, ci.ProductID,
		).Scan(&oi.Product.ID, &oi.Product.Name, &oi.Product.Species, &oi.Product.Price,
			&oi.Product.Description, &oi.Product.ImageURL, &oi.Product.Badge, &oi.Product.CategoryID,
			&oi.Product.Stock, &oi.Product.IsActive, &oi.Product.CreatedAt)
		if err == nil {
			orderItems = append(orderItems, oi)
		}

		tx.Exec(c.Context(), `UPDATE products SET stock = stock - $1 WHERE id = $2::uuid`, ci.Quantity, ci.ProductID)
	}

	tx.Exec(c.Context(), `DELETE FROM cart_items WHERE user_id = $1::uuid`, input.UserID)

	if err := tx.Commit(c.Context()); err != nil {
		return models.Error(c, "Gagal commit order", 500)
	}

	return models.SuccessStatus(c, models.OrderWithItems{Order: order, Items: orderItems}, 201)
}

func (h *OrderHandler) GetUserOrders(c *fiber.Ctx) error {
	userID := c.Params("userId")
	if err := middleware.ValidateUUID("User ID", userID); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	rows, err := h.DB.Query(c.Context(), `
		SELECT id, user_id, total_amount, status, shipping_address, created_at
		FROM orders WHERE user_id = $1::uuid
		ORDER BY created_at DESC`, userID)
	if err != nil {
		return models.Error(c, "Gagal mengambil orders", 500)
	}
	defer rows.Close()

	var orders []models.Order
	for rows.Next() {
		var o models.Order
		if err := rows.Scan(&o.ID, &o.UserID, &o.TotalAmount, &o.Status, &o.ShippingAddress, &o.CreatedAt); err != nil {
			return models.Error(c, "Gagal scan order", 500)
		}
		orders = append(orders, o)
	}

	if orders == nil {
		orders = []models.Order{}
	}

	return models.Success(c, orders)
}

func (h *OrderHandler) GetOrderDetail(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := middleware.ValidateUUID("Order ID", id); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	var o models.Order
	err := h.DB.QueryRow(c.Context(), `
		SELECT id, user_id, total_amount, status, shipping_address, created_at
		FROM orders WHERE id = $1::uuid`, id,
	).Scan(&o.ID, &o.UserID, &o.TotalAmount, &o.Status, &o.ShippingAddress, &o.CreatedAt)
	if err != nil {
		return models.Error(c, "Order tidak ditemukan", 404)
	}

	rows, err := h.DB.Query(c.Context(), `
		SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price,
		       p.id, p.name, p.species, p.price, p.description, p.image_url,
		       p.badge, p.category_id, p.stock, p.is_active, p.created_at
		FROM order_items oi
		JOIN products p ON oi.product_id = p.id
		WHERE oi.order_id = $1::uuid`, id)
	if err != nil {
		return models.Error(c, "Gagal mengambil order items", 500)
	}
	defer rows.Close()

	var items []models.OrderItemWithProduct
	for rows.Next() {
		var oi models.OrderItemWithProduct
		if err := rows.Scan(&oi.ID, &oi.OrderID, &oi.ProductID, &oi.Quantity, &oi.Price,
			&oi.Product.ID, &oi.Product.Name, &oi.Product.Species, &oi.Product.Price,
			&oi.Product.Description, &oi.Product.ImageURL, &oi.Product.Badge,
			&oi.Product.CategoryID, &oi.Product.Stock, &oi.Product.IsActive, &oi.Product.CreatedAt); err != nil {
			return models.Error(c, "Gagal scan order item", 500)
		}
		items = append(items, oi)
	}

	if items == nil {
		items = []models.OrderItemWithProduct{}
	}

	return models.Success(c, models.OrderWithItems{Order: o, Items: items})
}

func (h *OrderHandler) UpdateOrderStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := middleware.ValidateUUID("Order ID", id); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	var input models.UpdateOrderStatusInput
	if err := c.BodyParser(&input); err != nil {
		return models.Error(c, "Request body tidak valid", 400)
	}

	validStatuses := map[string]bool{"pending": true, "paid": true, "shipped": true, "done": true, "cancelled": true}
	if !validStatuses[input.Status] {
		return models.Error(c, "Status tidak valid. Gunakan: pending, paid, shipped, done, cancelled", 400)
	}

	var o models.Order
	err := h.DB.QueryRow(c.Context(), `
		UPDATE orders SET status = $1 WHERE id = $2::uuid
		RETURNING id, user_id, total_amount, status, shipping_address, created_at`,
		input.Status, id,
	).Scan(&o.ID, &o.UserID, &o.TotalAmount, &o.Status, &o.ShippingAddress, &o.CreatedAt)

	if err != nil {
		return models.Error(c, "Order tidak ditemukan", 404)
	}

	return models.Success(c, o)
}

func (h *OrderHandler) CancelOrder(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := middleware.ValidateUUID("Order ID", id); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	var currentStatus string
	err := h.DB.QueryRow(c.Context(), `SELECT status FROM orders WHERE id = $1::uuid`, id).Scan(&currentStatus)
	if err != nil {
		return models.Error(c, "Order tidak ditemukan", 404)
	}

	if currentStatus != "pending" {
		return models.Error(c, "Hanya order dengan status pending yang bisa dibatalkan", 400)
	}

	var o models.Order
	err = h.DB.QueryRow(c.Context(), `
		UPDATE orders SET status = 'cancelled' WHERE id = $1::uuid AND status = 'pending'
		RETURNING id, user_id, total_amount, status, shipping_address, created_at`, id,
	).Scan(&o.ID, &o.UserID, &o.TotalAmount, &o.Status, &o.ShippingAddress, &o.CreatedAt)

	if err != nil {
		return models.Error(c, "Gagal membatalkan order", 500)
	}

	return models.Success(c, o)
}
