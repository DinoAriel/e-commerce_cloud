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

	// Auto-migration
	_, migrationErr := pool.Exec(context.Background(), `
		ALTER TABLE orders ADD COLUMN IF NOT EXISTS rating INT;
		ALTER TABLE orders ADD COLUMN IF NOT EXISTS review TEXT;
		
		ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT;
		ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT;
		ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birth_date TEXT;
		ALTER TABLE profiles ALTER COLUMN birth_date TYPE TEXT;

		CREATE TABLE IF NOT EXISTS user_addresses (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
			recipient_name TEXT NOT NULL,
			phone_number TEXT NOT NULL,
			full_address TEXT NOT NULL,
			is_primary BOOLEAN DEFAULT false,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
		);

		CREATE TABLE IF NOT EXISTS chats (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
			UNIQUE(user_id)
		);

		CREATE TABLE IF NOT EXISTS chat_messages (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
			sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
			content TEXT NOT NULL,
			is_read BOOLEAN DEFAULT false,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
		);
	`)
	if migrationErr != nil {
		log.Printf("Peringatan migrasi database: %v\n", migrationErr)
	} else {
		fmt.Println("Migrasi database berhasil.")
	}

	fmt.Println("Terhubung ke database Supabase!")
	return pool
}
