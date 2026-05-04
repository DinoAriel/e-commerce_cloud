package handlers

import (
	"backend/middleware"
	"backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CartHandler struct {
	DB *pgxpool.Pool
}

func NewCartHandler(db *pgxpool.Pool) *CartHandler {
	return &CartHandler{DB: db}
}

func (h *CartHandler) GetCartItems(c *fiber.Ctx) error {
	userID := c.Params("userId")
	if err := middleware.ValidateUUID("User ID", userID); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	rows, err := h.DB.Query(c.Context(), `
		SELECT ci.id, ci.user_id, ci.product_id, ci.quantity, ci.created_at,
		       p.id, p.name, p.species, p.price, p.description, p.image_url,
		       p.badge, p.category_id, p.stock, p.is_active, p.created_at
		FROM cart_items ci
		JOIN products p ON ci.product_id = p.id
		WHERE ci.user_id = $1
		ORDER BY ci.created_at DESC`, userID)
	if err != nil {
		return models.Error(c, "Gagal mengambil cart", 500)
	}
	defer rows.Close()

	var items []models.CartItemWithProduct
	for rows.Next() {
		var item models.CartItemWithProduct
		if err := rows.Scan(&item.ID, &item.UserID, &item.ProductID, &item.Quantity, &item.CreatedAt,
			&item.Product.ID, &item.Product.Name, &item.Product.Species, &item.Product.Price,
			&item.Product.Description, &item.Product.ImageURL, &item.Product.Badge,
			&item.Product.CategoryID, &item.Product.Stock, &item.Product.IsActive, &item.Product.CreatedAt); err != nil {
			return models.Error(c, "Gagal scan cart item", 500)
		}
		items = append(items, item)
	}

	if items == nil {
		items = []models.CartItemWithProduct{}
	}

	return models.Success(c, items)
}

func (h *CartHandler) AddToCart(c *fiber.Ctx) error {
	var input models.AddCartInput
	if err := c.BodyParser(&input); err != nil {
		return models.Error(c, "Request body tidak valid", 400)
	}

	if err := middleware.ValidateRequired(map[string]string{
		"user_id": input.UserID, "product_id": input.ProductID,
	}); err != nil {
		return models.Error(c, err.Error(), 400)
	}
	if err := middleware.ValidateUUID("user_id", input.UserID); err != nil {
		return models.Error(c, err.Error(), 400)
	}
	if err := middleware.ValidateUUID("product_id", input.ProductID); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	qty := 1
	if input.Quantity != nil && *input.Quantity > 0 {
		qty = *input.Quantity
	}
	if qty > 99 {
		return models.Error(c, "Quantity maksimal 99", 400)
	}

	var item models.CartItem
	err := h.DB.QueryRow(c.Context(), `
		INSERT INTO cart_items (user_id, product_id, quantity)
		VALUES ($1::uuid, $2::uuid, $3)
		ON CONFLICT (user_id, product_id)
		DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
		RETURNING id, user_id, product_id, quantity, created_at`,
		input.UserID, input.ProductID, qty,
	).Scan(&item.ID, &item.UserID, &item.ProductID, &item.Quantity, &item.CreatedAt)

	if err != nil {
		return models.Error(c, "Gagal menambah ke cart", 500)
	}

	return models.SuccessStatus(c, item, 201)
}

func (h *CartHandler) UpdateCartItem(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := middleware.ValidateUUID("Cart item ID", id); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	var input models.UpdateCartInput
	if err := c.BodyParser(&input); err != nil {
		return models.Error(c, "Request body tidak valid", 400)
	}
	if input.Quantity <= 0 {
		return models.Error(c, "Quantity harus lebih dari 0", 400)
	}
	if input.Quantity > 99 {
		return models.Error(c, "Quantity maksimal 99", 400)
	}

	var item models.CartItem
	err := h.DB.QueryRow(c.Context(), `
		UPDATE cart_items SET quantity = $1 WHERE id = $2::uuid
		RETURNING id, user_id, product_id, quantity, created_at`,
		input.Quantity, id,
	).Scan(&item.ID, &item.UserID, &item.ProductID, &item.Quantity, &item.CreatedAt)

	if err != nil {
		return models.Error(c, "Cart item tidak ditemukan", 404)
	}

	return models.Success(c, item)
}

func (h *CartHandler) RemoveCartItem(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := middleware.ValidateUUID("Cart item ID", id); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	tag, err := h.DB.Exec(c.Context(), `DELETE FROM cart_items WHERE id = $1::uuid`, id)
	if err != nil {
		return models.Error(c, "Gagal menghapus cart item", 500)
	}
	if tag.RowsAffected() == 0 {
		return models.Error(c, "Cart item tidak ditemukan", 404)
	}

	return models.Success(c, fiber.Map{"message": "Item berhasil dihapus dari keranjang"})
}
