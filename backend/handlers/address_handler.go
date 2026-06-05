package handlers

import (
	"backend/middleware"
	"backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AddressHandler struct {
	DB *pgxpool.Pool
}

func NewAddressHandler(db *pgxpool.Pool) *AddressHandler {
	return &AddressHandler{DB: db}
}

func (h *AddressHandler) GetUserAddresses(c *fiber.Ctx) error {
	userId := c.Params("userId")
	if err := middleware.ValidateUUID("User ID", userId); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	rows, err := h.DB.Query(c.Context(), `
		SELECT id, user_id, recipient_name, phone_number, full_address, is_primary, created_at
		FROM user_addresses
		WHERE user_id = $1
		ORDER BY is_primary DESC, created_at DESC`, userId)
	if err != nil {
		return models.Error(c, "Gagal mengambil alamat", 500)
	}
	defer rows.Close()

	var addresses []models.UserAddress
	for rows.Next() {
		var a models.UserAddress
		if err := rows.Scan(&a.ID, &a.UserID, &a.RecipientName, &a.PhoneNumber, &a.FullAddress, &a.IsPrimary, &a.CreatedAt); err != nil {
			return models.Error(c, "Gagal membaca data alamat", 500)
		}
		addresses = append(addresses, a)
	}

	return models.Success(c, addresses)
}

func (h *AddressHandler) CreateAddress(c *fiber.Ctx) error {
	userId := c.Locals("user_id").(string)
	if err := middleware.ValidateUUID("User ID", userId); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	var input models.CreateAddressInput
	if err := c.BodyParser(&input); err != nil {
		return models.Error(c, "Input tidak valid", 400)
	}

	if input.RecipientName == "" || input.PhoneNumber == "" || input.FullAddress == "" {
		return models.Error(c, "Nama, nomor telepon, dan alamat lengkap wajib diisi", 400)
	}

	// Jika ini alamat pertama, jadikan utama. Jika alamat ini diset utama, hapus utama yang lama
	if input.IsPrimary {
		_, _ = h.DB.Exec(c.Context(), "UPDATE user_addresses SET is_primary = false WHERE user_id = $1", userId)
	} else {
		// Cek apakah ada alamat lain
		var count int
		_ = h.DB.QueryRow(c.Context(), "SELECT COUNT(*) FROM user_addresses WHERE user_id = $1", userId).Scan(&count)
		if count == 0 {
			input.IsPrimary = true
		}
	}

	var a models.UserAddress
	err := h.DB.QueryRow(c.Context(), `
		INSERT INTO user_addresses (user_id, recipient_name, phone_number, full_address, is_primary)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, user_id, recipient_name, phone_number, full_address, is_primary, created_at`,
		userId, input.RecipientName, input.PhoneNumber, input.FullAddress, input.IsPrimary,
	).Scan(&a.ID, &a.UserID, &a.RecipientName, &a.PhoneNumber, &a.FullAddress, &a.IsPrimary, &a.CreatedAt)

	if err != nil {
		return models.Error(c, "Gagal menambahkan alamat", 500)
	}

	return models.Success(c, a)
}

func (h *AddressHandler) UpdateAddress(c *fiber.Ctx) error {
	userId := c.Locals("user_id").(string)
	id := c.Params("id")
	
	if err := middleware.ValidateUUID("Address ID", id); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	var input models.UpdateAddressInput
	if err := c.BodyParser(&input); err != nil {
		return models.Error(c, "Input tidak valid", 400)
	}

	// Cek kepemilikan
	var ownerId string
	err := h.DB.QueryRow(c.Context(), "SELECT user_id FROM user_addresses WHERE id = $1", id).Scan(&ownerId)
	if err == pgx.ErrNoRows {
		return models.Error(c, "Alamat tidak ditemukan", 404)
	} else if ownerId != userId {
		return models.Error(c, "Tidak diizinkan", 403)
	}

	if input.IsPrimary != nil && *input.IsPrimary {
		_, _ = h.DB.Exec(c.Context(), "UPDATE user_addresses SET is_primary = false WHERE user_id = $1", userId)
	}

	var a models.UserAddress
	err = h.DB.QueryRow(c.Context(), `
		UPDATE user_addresses SET
			recipient_name = COALESCE($1, recipient_name),
			phone_number = COALESCE($2, phone_number),
			full_address = COALESCE($3, full_address),
			is_primary = COALESCE($4, is_primary)
		WHERE id = $5 AND user_id = $6
		RETURNING id, user_id, recipient_name, phone_number, full_address, is_primary, created_at`,
		input.RecipientName, input.PhoneNumber, input.FullAddress, input.IsPrimary, id, userId,
	).Scan(&a.ID, &a.UserID, &a.RecipientName, &a.PhoneNumber, &a.FullAddress, &a.IsPrimary, &a.CreatedAt)

	if err != nil {
		return models.Error(c, "Gagal mengupdate alamat", 500)
	}

	return models.Success(c, a)
}

func (h *AddressHandler) DeleteAddress(c *fiber.Ctx) error {
	userId := c.Locals("user_id").(string)
	id := c.Params("id")

	if err := middleware.ValidateUUID("Address ID", id); err != nil {
		return models.Error(c, err.Error(), 400)
	}

	cmd, err := h.DB.Exec(c.Context(), "DELETE FROM user_addresses WHERE id = $1 AND user_id = $2", id, userId)
	if err != nil {
		return models.Error(c, "Gagal menghapus alamat", 500)
	}
	if cmd.RowsAffected() == 0 {
		return models.Error(c, "Alamat tidak ditemukan atau tidak diizinkan", 404)
	}

	return models.Success(c, fiber.Map{"message": "Alamat berhasil dihapus"})
}
