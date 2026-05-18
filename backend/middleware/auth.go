package middleware

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"math/big"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type JWK struct {
	Alg string `json:"alg"`
	Crv string `json:"crv"`
	Kid string `json:"kid"`
	Kty string `json:"kty"`
	X   string `json:"x"`
	Y   string `json:"y"`
}

type JWKS struct {
	Keys []JWK `json:"keys"`
}

var (
	cachedKeys   = make(map[string]*ecdsa.PublicKey)
	cachedKeysMu sync.RWMutex
	lastFetch    time.Time
)

func getECDSAPublicKey(projectRef, kid string) (*ecdsa.PublicKey, error) {
	cachedKeysMu.RLock()
	pubKey, ok := cachedKeys[kid]
	cachedKeysMu.RUnlock()
	if ok {
		return pubKey, nil
	}

	cachedKeysMu.Lock()
	defer cachedKeysMu.Unlock()

	// Double-check key was not added while waiting for lock
	if pubKey, ok = cachedKeys[kid]; ok {
		return pubKey, nil
	}

	// Rate limit fetches to once per 10 seconds to prevent excessive requests
	if time.Since(lastFetch) < 10*time.Second && len(cachedKeys) > 0 {
		return nil, fmt.Errorf("rate limited JWKS fetch, key not cached: %s", kid)
	}

	jwksURL := fmt.Sprintf("https://%s.supabase.co/auth/v1/.well-known/jwks.json", projectRef)
	resp, err := http.Get(jwksURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch JWKS, status code: %d", resp.StatusCode)
	}

	var jwks JWKS
	if err := json.NewDecoder(resp.Body).Decode(&jwks); err != nil {
		return nil, err
	}

	lastFetch = time.Now()

	var foundKey *ecdsa.PublicKey
	for _, key := range jwks.Keys {
		if key.Kty == "EC" && key.Crv == "P-256" {
			xBytes, err := base64.RawURLEncoding.DecodeString(key.X)
			if err != nil {
				continue
			}
			yBytes, err := base64.RawURLEncoding.DecodeString(key.Y)
			if err != nil {
				continue
			}

			keyPubKey := &ecdsa.PublicKey{
				Curve: elliptic.P256(),
				X:     new(big.Int).SetBytes(xBytes),
				Y:     new(big.Int).SetBytes(yBytes),
			}

			cachedKeys[key.Kid] = keyPubKey
			if key.Kid == kid {
				foundKey = keyPubKey
			}
		}
	}

	if foundKey != nil {
		return foundKey, nil
	}

	return nil, fmt.Errorf("key %s not found in JWKS", kid)
}

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
			alg := t.Method.Alg()
			fmt.Printf("[DEBUG ALGORITHM]: %v, Type: %T\n", alg, t.Method)

			if strings.HasPrefix(alg, "HS") {
				// HMAC (Symmetric) validation
				if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("unexpected signing method for symmetric: %v", t.Header["alg"])
				}
				// Decode base64 secret if possible
				if decoded, err := base64.StdEncoding.DecodeString(secret); err == nil {
					return decoded, nil
				}
				return []byte(secret), nil
			} else if alg == "ES256" {
				// ECDSA (Asymmetric) validation
				if _, ok := t.Method.(*jwt.SigningMethodECDSA); !ok {
					return nil, fmt.Errorf("unexpected signing method for ECDSA: %v", t.Header["alg"])
				}

				kid, _ := t.Header["kid"].(string)
				if kid == "" {
					return nil, fmt.Errorf("missing kid header for ES256")
				}

				dbUser := os.Getenv("DB_USER")
				projectRef := "lymszumtdfbtrdexqrvv" // fallback default
				if dbUser != "" {
					dbUserParts := strings.Split(dbUser, ".")
					if len(dbUserParts) >= 2 {
						projectRef = dbUserParts[1]
					}
				}

				pubKey, err := getECDSAPublicKey(projectRef, kid)
				if err != nil {
					return nil, fmt.Errorf("failed to get public key for kid %s: %w", kid, err)
				}
				return pubKey, nil
			}

			return nil, fmt.Errorf("unsupported signing method: %v", alg)
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

		c.Locals("user_id", userID)
		c.Locals("user_role", role)

		return c.Next()
	}
}
