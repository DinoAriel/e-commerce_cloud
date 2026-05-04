package handlers

import (
	"backend/middleware"
	"backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CategoryHandler struct {
	DB *pgxpool.Pool
}

func NewCategoryHandler(db *pgxpool.Pool) *CategoryHandler {
	return &CategoryHandler{DB: db}
}

func (h *CategoryHandler) GetCategories(c *fiber.Ctx) error {
	rows, err := h.DB.Query(c.Context(), `SELECT id, name, slug, description, created_at FROM categories ORDER BY name ASC`)
	if err != nil {
		return models.Error(c, "Gagal mengambil kategori", 500)
	}
	defer rows.Close()

	var categories []models.Category
	for rows.Next() {
		var cat models.Category
		if err := rows.Scan(&cat.ID, &cat.Name, &cat.Slug, &cat.Description, &cat.CreatedAt); err != nil {
			return models.Error(c, "Gagal scan kategori", 500)
		}
		categories = append(categories, cat)
	}

	if categories == nil {
		categories = []models.Category{}
	}

	return models.Success(c, categories)
}

func (h *CategoryHandler) CreateCategory(c *fiber.Ctx) error {
	var input models.CreateCategoryInput
	if err := c.BodyParser(&input); err != nil {
		return models.Error(c, "Request body tidak valid", 400)
	}

	if err := middleware.ValidateRequired(map[string]string{
		"name": input.Name, "slug": input.Slug,
	}); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	var cat models.Category
	err := h.DB.QueryRow(c.Context(), `
		INSERT INTO categories (name, slug, description)
		VALUES ($1, $2, $3)
		RETURNING id, name, slug, description, created_at`,
		input.Name, input.Slug, input.Description,
	).Scan(&cat.ID, &cat.Name, &cat.Slug, &cat.Description, &cat.CreatedAt)

	if err != nil {
		if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23505" {
			return models.Error(c, "Slug sudah digunakan", 409)
		}
		return models.Error(c, "Gagal membuat kategori", 500)
	}

	return models.SuccessStatus(c, cat, 201)
}

func (h *CategoryHandler) DeleteCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := middleware.ValidateUUID("Category ID", id); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	tag, err := h.DB.Exec(c.Context(), `DELETE FROM categories WHERE id = $1::uuid`, id)
	if err != nil {
		return models.Error(c, "Gagal menghapus kategori", 500)
	}
	if tag.RowsAffected() == 0 {
		return models.Error(c, "Kategori tidak ditemukan", 404)
	}

	return models.Success(c, fiber.Map{"message": "Kategori berhasil dihapus"})
}
