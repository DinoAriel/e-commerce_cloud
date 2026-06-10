package handlers

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Register mendaftarkan pengguna baru
func Register(pool *pgxpool.Pool) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req RegisterRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"error":   "Gagal memproses data",
			})
		}

		if req.Email == "" || req.Password == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"error":   "Email dan Password tidak boleh kosong",
			})
		}

		// Hash password
		hashBytes, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"error":   "Gagal mengenkripsi kata sandi",
			})
		}

		// Atur Role: jika email adalah admin@aquamarket.com jadikan admin
		role := "user"
		if req.Email == "admin@aquamarket.com" {
			role = "admin"
		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		tx, err := pool.Begin(ctx)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal memulai transaksi"})
		}
		defer tx.Rollback(ctx)

		var userID string
		err = tx.QueryRow(ctx, `
			INSERT INTO users (email, password_hash, role) 
			VALUES ($1, $2, $3) 
			RETURNING id`, req.Email, string(hashBytes), role).Scan(&userID)
		if err != nil {
			fmt.Println("[DEBUG] Register Error:", err)
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"success": false,
				"error":   "Email ini sudah terdaftar",
			})
		}

		// Insert empty profile
		_, err = tx.Exec(ctx, `
			INSERT INTO profiles (id, full_name) 
			VALUES ($1, $2)`, userID, "")
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal membuat profil"})
		}

		if err := tx.Commit(ctx); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menyimpan data"})
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"success": true,
			"message": "Pendaftaran berhasil, silakan login",
		})
	}
}

// Login memvalidasi email/password dan mengembalikan JWT
func Login(pool *pgxpool.Pool) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req LoginRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"error":   "Format request tidak valid",
			})
		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		var userID, passwordHash, role string
		err := pool.QueryRow(ctx, "SELECT id, password_hash, role FROM users WHERE email = $1", req.Email).Scan(&userID, &passwordHash, &role)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"success": false,
				"error":   "Email atau kata sandi salah",
			})
		}

		// Validasi Password
		if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"success": false,
				"error":   "Email atau kata sandi salah",
			})
		}

		// TEMPORARY FIX: Paksa akun ini menjadi admin jika belum admin
		if req.Email == "admin@aquamarket.com" && role != "admin" {
			_, _ = pool.Exec(ctx, "UPDATE users SET role = 'admin' WHERE email = $1", req.Email)
			role = "admin"
		}

		// Generate JWT Token
		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"error":   "Konfigurasi JWT tidak ditemukan",
			})
		}

		claims := jwt.MapClaims{
			"sub":   userID,
			"email": req.Email,
			"role":  role,
			"exp":   time.Now().Add(time.Hour * 72).Unix(),
			"iat":   time.Now().Unix(),
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		t, err := token.SignedString([]byte(secret))
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"error":   "Gagal membuat token",
			})
		}

		return c.JSON(fiber.Map{
			"success": true,
			"message": "Login berhasil",
			"data": fiber.Map{
				"session": fiber.Map{
					"access_token": t,
					"user": fiber.Map{
						"id":    userID,
						"email": req.Email,
						"role":  role,
					},
				},
			},
		})
	}
}
