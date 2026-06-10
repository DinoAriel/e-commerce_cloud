package main

import (
	"backend/config"
	"backend/database"
	"backend/routes"
	"context"
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Println("Peringatan: File .env tidak ditemukan, menggunakan env system")
	}

	cfg := config.Load()

	pool := database.Connect(cfg)
	defer pool.Close()

	// Auto-Migrate missing columns for orders table
	migrationQueries := []string{
		"ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount INT NOT NULL DEFAULT 0;",
		"ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address TEXT NOT NULL DEFAULT '';",
		"ALTER TABLE orders ADD COLUMN IF NOT EXISTS rating INT;",
		"ALTER TABLE orders ADD COLUMN IF NOT EXISTS review TEXT;",
		"ALTER TABLE orders ADD COLUMN IF NOT EXISTS snap_token TEXT;",
		"ALTER TABLE order_items ADD COLUMN IF NOT EXISTS price INT NOT NULL DEFAULT 0;",
	}
	for _, q := range migrationQueries {
		_, err := pool.Exec(context.Background(), q)
		if err != nil {
			fmt.Printf("Gagal menjalankan migrasi: %s -> %v\n", q, err)
		}
	}

	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"success": false,
				"error":   err.Error(),
			})
		},
	})

	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{
			"success": true,
			"message": "API Backend Golang Berhasil Dijalankan!",
			"status":  "Active",
		})
	})

	routes.Setup(app, pool, cfg)

	address := fmt.Sprintf(":%s", cfg.Port)
	fmt.Printf("Server berjalan di http://localhost:%s\n", cfg.Port)
	
	if err := app.Listen(address); err != nil {
		log.Fatalf("Gagal menjalankan server: %v", err)
	}
}