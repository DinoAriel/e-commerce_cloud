package handlers

import (
	"backend/middleware"
	"backend/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ProductHandler struct {
	DB *pgxpool.Pool
}

func NewProductHandler(db *pgxpool.Pool) *ProductHandler {
	return &ProductHandler{DB: db}
}

func (h *ProductHandler) GetProducts(c *fiber.Ctx) error {
	category := c.Query("category")
	search := c.Query("search")
	badge := c.Query("badge")
	isActive := c.Query("is_active", "true")
	limit, _ := strconv.Atoi(c.Query("limit", "50"))
	offset, _ := strconv.Atoi(c.Query("offset", "0"))

	if limit <= 0 || limit > 100 {
		limit = 50
	}
	if offset < 0 {
		offset = 0
	}

	query := `
		SELECT p.id, p.name, p.species, p.price, p.description, p.image_url,
		       p.badge, p.category_id, p.stock, p.is_active, p.created_at,
		       c.id, c.name, c.slug,
		       COUNT(*) OVER() as total_count
		FROM products p
		LEFT JOIN categories c ON p.category_id = c.id
		WHERE ($1::text IS NULL OR c.slug = $1)
		  AND ($2::text IS NULL OR (p.name ILIKE '%' || $2 || '%' OR p.species ILIKE '%' || $2 || '%'))
		  AND ($3::text IS NULL OR p.badge = $3)
		  AND p.is_active = $4
		ORDER BY p.created_at DESC
		LIMIT $5 OFFSET $6`

	var categoryVal, searchVal, badgeVal *string
	if category != "" {
		categoryVal = &category
	}
	if search != "" {
		searchVal = &search
	}
	if badge != "" {
		badgeVal = &badge
	}
	activeBool := isActive == "true"

	rows, err := h.DB.Query(c.Context(), query, categoryVal, searchVal, badgeVal, activeBool, limit, offset)
	if err != nil {
		return models.Error(c, "Gagal mengambil produk", 500)
	}
	defer rows.Close()

	var products []models.ProductWithCategory
	total := 0
	for rows.Next() {
		var p models.ProductWithCategory
		var catID, catName, catSlug *string
		var totalCount int
		if err := rows.Scan(&p.ID, &p.Name, &p.Species, &p.Price, &p.Description, &p.ImageURL,
			&p.Badge, &p.CategoryID, &p.Stock, &p.IsActive, &p.CreatedAt,
			&catID, &catName, &catSlug, &totalCount); err != nil {
			return models.Error(c, "Gagal scan produk", 500)
		}
		if catID != nil {
			p.Category = &models.CategoryInfo{ID: *catID, Name: *catName, Slug: *catSlug}
		}
		total = totalCount
		products = append(products, p)
	}

	if products == nil {
		products = []models.ProductWithCategory{}
	}

	return models.Success(c, models.ProductListResponse{
		Products: products,
		Total:    total,
		Limit:    limit,
		Offset:   offset,
	})
}

func (h *ProductHandler) GetProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := middleware.ValidateUUID("Product ID", id); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	var p models.ProductWithCategory
	var catID, catName, catSlug *string

	err := h.DB.QueryRow(c.Context(), `
		SELECT p.id, p.name, p.species, p.price, p.description, p.image_url,
		       p.badge, p.category_id, p.stock, p.is_active, p.created_at,
		       c.id, c.name, c.slug
		FROM products p
		LEFT JOIN categories c ON p.category_id = c.id
		WHERE p.id = $1`, id).Scan(
		&p.ID, &p.Name, &p.Species, &p.Price, &p.Description, &p.ImageURL,
		&p.Badge, &p.CategoryID, &p.Stock, &p.IsActive, &p.CreatedAt,
		&catID, &catName, &catSlug)
	if err != nil {
		return models.Error(c, "Produk tidak ditemukan", 404)
	}

	if catID != nil {
		p.Category = &models.CategoryInfo{ID: *catID, Name: *catName, Slug: *catSlug}
	}

	return models.Success(c, p)
}

func (h *ProductHandler) CreateProduct(c *fiber.Ctx) error {
	var input models.CreateProductInput
	if err := c.BodyParser(&input); err != nil {
		return models.Error(c, "Request body tidak valid", 400)
	}

	if err := middleware.ValidateRequired(map[string]string{
		"name": input.Name, "species": input.Species,
		"description": input.Description, "image_url": input.ImageURL,
	}); err != nil {
		return models.Error(c, err.Error(), 400)
	}
	if err := middleware.ValidatePositiveInt("price", input.Price); err != nil {
		return models.Error(c, err.Error(), 400)
	}
	if input.CategoryID != nil {
		if err := middleware.ValidateUUID("category_id", *input.CategoryID); err != nil {
			return models.Error(c, err.Error(), 400)
		}
	}

	stock := 0
	if input.Stock != nil {
		stock = *input.Stock
	}
	isActive := true
	if input.IsActive != nil {
		isActive = *input.IsActive
	}

	var p models.Product
	err := h.DB.QueryRow(c.Context(), `
		INSERT INTO products (name, species, price, description, image_url, badge, category_id, stock, is_active)
		VALUES ($1, $2, $3, $4, $5, $6, $7::uuid, $8, $9)
		RETURNING id, name, species, price, description, image_url, badge, category_id, stock, is_active, created_at`,
		input.Name, input.Species, input.Price, input.Description, input.ImageURL,
		input.Badge, input.CategoryID, stock, isActive,
	).Scan(&p.ID, &p.Name, &p.Species, &p.Price, &p.Description, &p.ImageURL,
		&p.Badge, &p.CategoryID, &p.Stock, &p.IsActive, &p.CreatedAt)

	if err != nil {
		return models.Error(c, "Gagal membuat produk", 500)
	}

	return models.SuccessStatus(c, p, 201)
}

func (h *ProductHandler) UpdateProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := middleware.ValidateUUID("Product ID", id); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	var input models.UpdateProductInput
	if err := c.BodyParser(&input); err != nil {
		return models.Error(c, "Request body tidak valid", 400)
	}

	if input.Price != nil && *input.Price <= 0 {
		return models.Error(c, "price harus lebih dari 0", 400)
	}
	if input.Stock != nil && *input.Stock < 0 {
		return models.Error(c, "stock tidak boleh negatif", 400)
	}
	if input.CategoryID != nil {
		if err := middleware.ValidateUUID("category_id", *input.CategoryID); err != nil {
			return models.Error(c, err.Error(), 400)
		}
	}

	var p models.Product
	err := h.DB.QueryRow(c.Context(), `
		UPDATE products SET
			name = COALESCE($1, name),
			species = COALESCE($2, species),
			price = COALESCE($3, price),
			description = COALESCE($4, description),
			image_url = COALESCE($5, image_url),
			badge = COALESCE($6, badge),
			category_id = COALESCE($7::uuid, category_id),
			stock = COALESCE($8, stock),
			is_active = COALESCE($9, is_active)
		WHERE id = $10
		RETURNING id, name, species, price, description, image_url, badge, category_id, stock, is_active, created_at`,
		input.Name, input.Species, input.Price, input.Description, input.ImageURL,
		input.Badge, input.CategoryID, input.Stock, input.IsActive, id,
	).Scan(&p.ID, &p.Name, &p.Species, &p.Price, &p.Description, &p.ImageURL,
		&p.Badge, &p.CategoryID, &p.Stock, &p.IsActive, &p.CreatedAt)

	if err != nil {
		return models.Error(c, "Produk tidak ditemukan atau gagal update", 404)
	}

	return models.Success(c, p)
}

func (h *ProductHandler) DeleteProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := middleware.ValidateUUID("Product ID", id); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	tag, err := h.DB.Exec(c.Context(), `DELETE FROM products WHERE id = $1`, id)
	if err != nil {
		return models.Error(c, "Gagal menghapus produk", 500)
	}
	if tag.RowsAffected() == 0 {
		return models.Error(c, "Produk tidak ditemukan", 404)
	}

	return models.Success(c, fiber.Map{"message": "Produk berhasil dihapus"})
}
