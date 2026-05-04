package middleware

import (
	"regexp"

	"github.com/gofiber/fiber/v2"
)

var uuidRegex = regexp.MustCompile(`^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`)

func ValidateUUID(field, value string) error {
	if value == "" {
		return fiber.NewError(400, field+" wajib diisi")
	}
	if !uuidRegex.MatchString(value) {
		return fiber.NewError(400, field+" format tidak valid")
	}
	return nil
}

func ValidateRequired(fields map[string]string) error {
	for field, value := range fields {
		if value == "" {
			return fiber.NewError(400, field+" wajib diisi")
		}
	}
	return nil
}

func ValidatePositiveInt(field string, value int) error {
	if value <= 0 {
		return fiber.NewError(400, field+" harus lebih dari 0")
	}
	return nil
}
