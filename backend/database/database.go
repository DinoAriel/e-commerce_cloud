package database

import (
	"context"
	"fmt"
	"log"

	"backend/config"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Connect(cfg config.Config) *pgxpool.Pool {
	pool, err := pgxpool.New(context.Background(), cfg.DSN())
	if err != nil {
		log.Fatalf("Gagal koneksi ke database: %v\n", err)
	}

	if err := pool.Ping(context.Background()); err != nil {
		log.Fatalf("Gagal ping database: %v\n", err)
	}

	// Auto-migration: Ensure rating and review columns exist in orders table
	_, migrationErr := pool.Exec(context.Background(), `
		ALTER TABLE orders ADD COLUMN IF NOT EXISTS rating INT;
		ALTER TABLE orders ADD COLUMN IF NOT EXISTS review TEXT;
	`)
	if migrationErr != nil {
		log.Printf("Peringatan migrasi database: %v\n", migrationErr)
	} else {
		fmt.Println("Migrasi database berhasil: Kolom rating & review siap.")
	}

	fmt.Println("Terhubung ke database Supabase!")
	return pool
}
