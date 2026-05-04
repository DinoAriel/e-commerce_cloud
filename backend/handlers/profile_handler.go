package handlers

import (
	"backend/middleware"
	"backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ProfileHandler struct {
	DB *pgxpool.Pool
}

func NewProfileHandler(db *pgxpool.Pool) *ProfileHandler {
	return &ProfileHandler{DB: db}
}

func (h *ProfileHandler) GetProfile(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := middleware.ValidateUUID("Profile ID", id); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	var p models.Profile
	err := h.DB.QueryRow(c.Context(), `
		SELECT id, full_name, phone, address, avatar_url, created_at
		FROM profiles WHERE id = $1`, id,
	).Scan(&p.ID, &p.FullName, &p.Phone, &p.Address, &p.AvatarURL, &p.CreatedAt)

	if err != nil {
		return models.Error(c, "Profil tidak ditemukan", 404)
	}

	return models.Success(c, p)
}

func (h *ProfileHandler) UpdateProfile(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := middleware.ValidateUUID("Profile ID", id); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	var input models.UpdateProfileInput
	if err := c.BodyParser(&input); err != nil {
		return models.Error(c, "Request body tidak valid", 400)
	}

	if input.Phone != nil && *input.Phone != "" && len(*input.Phone) < 8 {
		return models.Error(c, "Nomor telepon minimal 8 karakter", 400)
	}

	var p models.Profile
	err := h.DB.QueryRow(c.Context(), `
		UPDATE profiles SET
			full_name = COALESCE($1, full_name),
			phone = COALESCE($2, phone),
			address = COALESCE($3, address),
			avatar_url = COALESCE($4, avatar_url)
		WHERE id = $5
		RETURNING id, full_name, phone, address, avatar_url, created_at`,
		input.FullName, input.Phone, input.Address, input.AvatarURL, id,
	).Scan(&p.ID, &p.FullName, &p.Phone, &p.Address, &p.AvatarURL, &p.CreatedAt)

	if err != nil {
		return models.Error(c, "Profil tidak ditemukan atau gagal update", 404)
	}

	return models.Success(c, p)
}
