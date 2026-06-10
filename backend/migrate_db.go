package main

import (
	"context"
	"fmt"
	"log"

	"backend/config"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Peringatan: File .env tidak ditemukan")
	}

	cfg := config.Load()

	dbUrl := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s",
		cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName, cfg.DBSSLMode)

	pool, err := pgxpool.New(context.Background(), dbUrl)
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()

	// Add missing columns if any
	queries := []string{
		"ALTER TABLE orders ADD COLUMN IF NOT EXISTS rating INT;",
		"ALTER TABLE orders ADD COLUMN IF NOT EXISTS review TEXT;",
		"ALTER TABLE orders ADD COLUMN IF NOT EXISTS snap_token TEXT;",
	}

	for _, q := range queries {
		_, err := pool.Exec(context.Background(), q)
		if err != nil {
			fmt.Println("Error executing query:", q, "->", err)
		} else {
			fmt.Println("Successfully executed:", q)
		}
	}
}
