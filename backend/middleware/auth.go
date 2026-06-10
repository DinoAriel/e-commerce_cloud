package middleware


import (
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func JWTProtected(secret string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		var tokenStr string
		
		if authHeader != "" {
			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) == 2 && strings.ToLower(parts[0]) == "bearer" {
				tokenStr = parts[1]
			} else {
				return c.Status(401).JSON(fiber.Map{
					"success": false,
					"error":   "Format token tidak valid. Gunakan: Bearer <token>",
				})
			}
		} else {
			tokenStr = c.Query("token")
		}

		if tokenStr == "" {
			return c.Status(401).JSON(fiber.Map{
				"success": false,
				"error":   "Token tidak ditemukan. Silakan login terlebih dahulu.",
			})
		}

		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
			}
			return []byte(secret), nil
		})

		// --- TAMBAHKAN KODE DEBUG INI ---
		if err != nil {
			fmt.Println("[DEBUG JWT ERROR]:", err)
			fmt.Println("[DEBUG SECRET YANG DIPAKAI]:", secret)
			
			// Parse unverified to inspect claims
			parser := jwt.NewParser()
			unverifiedToken, _, unverifiedErr := parser.ParseUnverified(tokenStr, jwt.MapClaims{})
			if unverifiedErr == nil {
				fmt.Println("[DEBUG UNVERIFIED CLAIMS]:", unverifiedToken.Claims)
				fmt.Println("[DEBUG UNVERIFIED HEADER]:", unverifiedToken.Header)
			} else {
				fmt.Println("[DEBUG UNVERIFIED ERR]:", unverifiedErr)
			}
		}
		// --------------------------------

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
		
		fmt.Printf("[DEBUG AUTH] claims for %s: %+v\n", userID, claims)

		// Fallback to app_metadata.role if available (Supabase custom claims)
		if appMetadata, ok := claims["app_metadata"].(map[string]interface{}); ok {
			if amRole, ok := appMetadata["role"].(string); ok {
				role = amRole
			}
		}
		if userMetadata, ok := claims["user_metadata"].(map[string]interface{}); ok {
			if umRole, ok := userMetadata["role"].(string); ok {
				role = umRole
			}
		}

		// Force jyu.jur5@gmail.com to be admin (as requested by user)
		email, _ := claims["email"].(string)
		if email == "jyu.jur5@gmail.com" {
			role = "admin"
		}

		c.Locals("user_id", userID)
		c.Locals("user_role", role)
		c.Locals("user_email", email)

		return c.Next()
	}
}
