package handlers

import (
	"backend/middleware"
	"backend/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AuctionHandler struct {
	DB *pgxpool.Pool
}

func NewAuctionHandler(db *pgxpool.Pool) *AuctionHandler {
	return &AuctionHandler{DB: db}
}

func (h *AuctionHandler) GetAuctions(c *fiber.Ctx) error {
	status := c.Query("status")

	query := `
		SELECT a.id, a.product_id, a.start_price, a.current_bid, a.start_time, a.end_time,
		       a.status, a.created_at,
		       p.id, p.name, p.species, p.price, p.description, p.image_url,
		       p.badge, p.category_id, p.stock, p.is_active, p.created_at
		FROM auctions a
		JOIN products p ON a.product_id = p.id`

	var args []interface{}
	if status != "" {
		validStatuses := map[string]bool{"active": true, "ended": true, "cancelled": true}
		if !validStatuses[status] {
			return models.Error(c, "Status tidak valid. Gunakan: active, ended, cancelled", 400)
		}
		query += ` WHERE a.status = $1`
		args = append(args, status)
	}
	query += ` ORDER BY a.created_at DESC`

	rows, err := h.DB.Query(c.Context(), query, args...)
	if err != nil {
		return models.Error(c, "Gagal mengambil auctions", 500)
	}
	defer rows.Close()

	var auctions []models.AuctionWithProduct
	for rows.Next() {
		var a models.AuctionWithProduct
		if err := rows.Scan(&a.ID, &a.ProductID, &a.StartPrice, &a.CurrentBid, &a.StartTime, &a.EndTime,
			&a.Status, &a.CreatedAt,
			&a.Product.ID, &a.Product.Name, &a.Product.Species, &a.Product.Price,
			&a.Product.Description, &a.Product.ImageURL, &a.Product.Badge, &a.Product.CategoryID,
			&a.Product.Stock, &a.Product.IsActive, &a.Product.CreatedAt); err != nil {
			return models.Error(c, "Gagal scan auction", 500)
		}
		auctions = append(auctions, a)
	}

	if auctions == nil {
		auctions = []models.AuctionWithProduct{}
	}

	return models.Success(c, auctions)
}

func (h *AuctionHandler) CreateAuction(c *fiber.Ctx) error {
	var input models.CreateAuctionInput
	if err := c.BodyParser(&input); err != nil {
		return models.Error(c, "Request body tidak valid", 400)
	}

	if err := middleware.ValidateRequired(map[string]string{
		"product_id": input.ProductID,
	}); err != nil {
		return models.Error(c, err.Error(), 400)
	}
	if err := middleware.ValidateUUID("product_id", input.ProductID); err != nil {
		return models.Error(c, err.Error(), 400)
	}
	if err := middleware.ValidatePositiveInt("start_price", input.StartPrice); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	if input.StartTime == "" || input.EndTime == "" {
		return models.Error(c, "start_time dan end_time wajib diisi", 400)
	}

	startTime, err := time.Parse(time.RFC3339, input.StartTime)
	if err != nil {
		return models.Error(c, "Format start_time tidak valid (gunakan RFC3339)", 400)
	}
	endTime, err := time.Parse(time.RFC3339, input.EndTime)
	if err != nil {
		return models.Error(c, "Format end_time tidak valid (gunakan RFC3339)", 400)
	}
	if endTime.Before(startTime) {
		return models.Error(c, "end_time harus setelah start_time", 400)
	}
	if endTime.Before(time.Now()) {
		return models.Error(c, "end_time harus di masa depan", 400)
	}

	var a models.Auction
	err = h.DB.QueryRow(c.Context(), `
		INSERT INTO auctions (product_id, start_price, start_time, end_time, status)
		VALUES ($1::uuid, $2, $3, $4, 'active')
		RETURNING id, product_id, start_price, current_bid, start_time, end_time, status, created_at`,
		input.ProductID, input.StartPrice, startTime, endTime,
	).Scan(&a.ID, &a.ProductID, &a.StartPrice, &a.CurrentBid, &a.StartTime, &a.EndTime, &a.Status, &a.CreatedAt)

	if err != nil {
		return models.Error(c, "Gagal membuat auction", 500)
	}

	return models.SuccessStatus(c, a, 201)
}

func (h *AuctionHandler) GetAuctionDetail(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := middleware.ValidateUUID("Auction ID", id); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	var a models.Auction
	err := h.DB.QueryRow(c.Context(), `
		SELECT id, product_id, start_price, current_bid, start_time, end_time, status, created_at
		FROM auctions WHERE id = $1::uuid`, id,
	).Scan(&a.ID, &a.ProductID, &a.StartPrice, &a.CurrentBid, &a.StartTime, &a.EndTime, &a.Status, &a.CreatedAt)
	if err != nil {
		return models.Error(c, "Auction tidak ditemukan", 404)
	}

	var product models.Product
	err = h.DB.QueryRow(c.Context(), `
		SELECT id, name, species, price, description, image_url, badge, category_id, stock, is_active, created_at
		FROM products WHERE id = $1`, a.ProductID,
	).Scan(&product.ID, &product.Name, &product.Species, &product.Price, &product.Description,
		&product.ImageURL, &product.Badge, &product.CategoryID, &product.Stock, &product.IsActive, &product.CreatedAt)

	bids, _ := h.getBids(c, id)

	return models.Success(c, models.AuctionDetail{
		Auction: a,
		Product: product,
		Bids:    bids,
	})
}

func (h *AuctionHandler) PlaceBid(c *fiber.Ctx) error {
	auctionID := c.Params("id")
	if err := middleware.ValidateUUID("Auction ID", auctionID); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	var input models.PlaceBidInput
	if err := c.BodyParser(&input); err != nil {
		return models.Error(c, "Request body tidak valid", 400)
	}
	if err := middleware.ValidateRequired(map[string]string{
		"user_id": input.UserID,
	}); err != nil {
		return models.Error(c, err.Error(), 400)
	}
	if err := middleware.ValidateUUID("user_id", input.UserID); err != nil {
		return models.Error(c, err.Error(), 400)
	}
	if err := middleware.ValidatePositiveInt("amount", input.Amount); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	var a models.Auction
	err := h.DB.QueryRow(c.Context(), `
		SELECT id, start_price, current_bid, start_time, end_time, status
		FROM auctions WHERE id = $1::uuid`, auctionID,
	).Scan(&a.ID, &a.StartPrice, &a.CurrentBid, &a.StartTime, &a.EndTime, &a.Status)
	if err != nil {
		return models.Error(c, "Auction tidak ditemukan", 404)
	}

	if a.Status != "active" {
		return models.Error(c, "Auction tidak aktif", 400)
	}

	now := time.Now()
	if now.Before(a.StartTime) || now.After(a.EndTime) {
		return models.Error(c, "Auction belum dimulai atau sudah berakhir", 400)
	}

	if input.Amount <= a.StartPrice {
		return models.Error(c, "Bid harus lebih besar dari start_price", 400)
	}
	if a.CurrentBid != nil && input.Amount <= *a.CurrentBid {
		return models.Error(c, "Bid harus lebih besar dari current_bid", 400)
	}

	tx, err := h.DB.Begin(c.Context())
	if err != nil {
		return models.Error(c, "Gagal memulai transaksi", 500)
	}
	defer tx.Rollback(c.Context())

	var bid struct {
		ID        string    `json:"id"`
		AuctionID string    `json:"auction_id"`
		UserID    string    `json:"user_id"`
		Amount    int       `json:"amount"`
		CreatedAt time.Time `json:"created_at"`
	}
	err = tx.QueryRow(c.Context(), `
		INSERT INTO bids (auction_id, user_id, amount)
		VALUES ($1::uuid, $2::uuid, $3)
		RETURNING id, auction_id, user_id, amount, created_at`,
		auctionID, input.UserID, input.Amount,
	).Scan(&bid.ID, &bid.AuctionID, &bid.UserID, &bid.Amount, &bid.CreatedAt)
	if err != nil {
		return models.Error(c, "Gagal membuat bid", 500)
	}

	tx.Exec(c.Context(), `UPDATE auctions SET current_bid = $1 WHERE id = $2::uuid`, input.Amount, auctionID)

	if err := tx.Commit(c.Context()); err != nil {
		return models.Error(c, "Gagal commit bid", 500)
	}

	return models.SuccessStatus(c, bid, 201)
}

func (h *AuctionHandler) GetAuctionBids(c *fiber.Ctx) error {
	auctionID := c.Params("id")
	if err := middleware.ValidateUUID("Auction ID", auctionID); err != nil {
		return models.Error(c, err.Error(), 400)
	}
	bids, err := h.getBids(c, auctionID)
	if err != nil {
		return err
	}
	return models.Success(c, bids)
}

func (h *AuctionHandler) getBids(c *fiber.Ctx, auctionID string) ([]models.BidWithUser, error) {
	rows, err := h.DB.Query(c.Context(), `
		SELECT b.id, b.auction_id, b.user_id, b.amount, b.created_at,
		       p.full_name, p.avatar_url
		FROM bids b
		JOIN profiles p ON b.user_id = p.id
		WHERE b.auction_id = $1::uuid
		ORDER BY b.amount DESC`, auctionID)
	if err != nil {
		return nil, models.Error(c, "Gagal mengambil bids", 500)
	}
	defer rows.Close()

	var bids []models.BidWithUser
	for rows.Next() {
		var b models.BidWithUser
		if err := rows.Scan(&b.ID, &b.AuctionID, &b.UserID, &b.Amount, &b.CreatedAt,
			&b.FullName, &b.AvatarURL); err != nil {
			return nil, models.Error(c, "Gagal scan bid", 500)
		}
		bids = append(bids, b)
	}

	if bids == nil {
		bids = []models.BidWithUser{}
	}

	return bids, nil
}
