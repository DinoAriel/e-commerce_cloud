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
		CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

		CREATE TABLE IF NOT EXISTS users (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			email TEXT UNIQUE NOT NULL,
			password_hash TEXT NOT NULL,
			role TEXT DEFAULT 'user',
			created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
		);

		CREATE TABLE IF NOT EXISTS profiles (
			id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
			username TEXT,
			full_name TEXT,
			phone TEXT,
			address TEXT,
			avatar_url TEXT,
			gender TEXT,
			birth_date TEXT,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
		);

		-- Create products table if it doesn't exist
		CREATE TABLE IF NOT EXISTS products (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			name TEXT NOT NULL,
			description TEXT,
			price DECIMAL(10,2) NOT NULL,
			stock INT DEFAULT 0,
			category_id UUID,
			image_url TEXT,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
		);

		-- Create orders table if it doesn't exist
		CREATE TABLE IF NOT EXISTS orders (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
			status TEXT DEFAULT 'pending',
			total DECIMAL(10,2) NOT NULL,
			rating INT,
			review TEXT,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
		);


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

	fmt.Println("Terhubung ke database (AWS RDS)!")
	return pool
}
