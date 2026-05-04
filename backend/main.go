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
	godotenv.Load()

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

	routes.Setup(app, pool, cfg)

	fmt.Printf("Server berjalan di http://localhost:%s\n", cfg.Port)
	log.Fatal(app.Listen(":" + cfg.Port))
}
