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

	fmt.Println("Terhubung ke database Supabase!")
	return pool
}
