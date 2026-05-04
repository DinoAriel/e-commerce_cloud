package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func JWTProtected(secret string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(401).JSON(fiber.Map{
				"success": false,
				"error":   "Token tidak ditemukan. Silakan login terlebih dahulu.",
			})
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			return c.Status(401).JSON(fiber.Map{
				"success": false,
				"error":   "Format token tidak valid. Gunakan: Bearer <token>",
			})
		}

		tokenStr := parts[1]
		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			return c.Status(401).JSON(fiber.Map{
				"success": false,
				"error":   "Token tidak valid atau sudah expired.",
			})
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return c.Status(401).JSON(fiber.Map{
				"success": false,
				"error":   "Gagal membaca token claims.",
			})
		}

		userID, _ := claims["sub"].(string)
		if userID == "" {
			return c.Status(401).JSON(fiber.Map{
				"success": false,
				"error":   "User ID tidak ditemukan dalam token.",
			})
		}

		role, _ := claims["role"].(string)

		c.Locals("user_id", userID)
		c.Locals("user_role", role)

		return c.Next()
	}
}
