package handlers

import (
	"backend/middleware"
	"backend/models"
	"log"

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
		SELECT id, username, full_name, phone_number, address, avatar_url, role, gender, birth_date, created_at
		FROM profiles WHERE id = $1`, id,
	).Scan(&p.ID, &p.Username, &p.FullName, &p.Phone, &p.Address, &p.AvatarURL, &p.Role, &p.Gender, &p.BirthDate, &p.CreatedAt)

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
	
	// DEBUG LOG
	log.Printf("Received UpdateProfileInput: %+v\n", input)
	if input.Username != nil {
		log.Printf("Username: %v\n", *input.Username)
	} else {
		log.Printf("Username is nil\n")
	}
	if input.Gender != nil {
		log.Printf("Gender: %v\n", *input.Gender)
	} else {
		log.Printf("Gender is nil\n")
	}
	if input.BirthDate != nil {
		log.Printf("BirthDate: %v\n", *input.BirthDate)
	} else {
		log.Printf("BirthDate is nil\n")
	}

	if input.Phone != nil && *input.Phone != "" && len(*input.Phone) < 8 {
		return models.Error(c, "Nomor telepon minimal 8 karakter", 400)
	}

	var p models.Profile
	err := h.DB.QueryRow(c.Context(), `
		UPDATE profiles SET
			username = COALESCE($1, username),
			full_name = COALESCE($2, full_name),
			phone_number = COALESCE($3, phone_number),
			address = COALESCE($4, address),
			avatar_url = COALESCE($5, avatar_url),
			gender = COALESCE($6, gender),
			birth_date = COALESCE($7, birth_date)
		WHERE id = $8
		RETURNING id, username, full_name, phone_number, address, avatar_url, role, gender, birth_date, created_at`,
		input.Username, input.FullName, input.Phone, input.Address, input.AvatarURL, input.Gender, input.BirthDate, id,
	).Scan(&p.ID, &p.Username, &p.FullName, &p.Phone, &p.Address, &p.AvatarURL, &p.Role, &p.Gender, &p.BirthDate, &p.CreatedAt)

	if err != nil {
		return models.Error(c, "Profil tidak ditemukan atau gagal update", 404)
	}

	return models.Success(c, p)
}
