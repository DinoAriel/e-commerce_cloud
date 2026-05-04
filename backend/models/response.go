package models

import "github.com/gofiber/fiber/v2"

func Success(c *fiber.Ctx, data interface{}) error {
	return c.JSON(fiber.Map{"success": true, "data": data})
}

func SuccessStatus(c *fiber.Ctx, data interface{}, status int) error {
	return c.Status(status).JSON(fiber.Map{"success": true, "data": data})
}

func Error(c *fiber.Ctx, message string, status int) error {
	return c.Status(status).JSON(fiber.Map{"success": false, "error": message})
}
