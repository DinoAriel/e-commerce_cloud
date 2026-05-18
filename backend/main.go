package main

import (
	"backend/config"
	"backend/database"
	"backend/routes"
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