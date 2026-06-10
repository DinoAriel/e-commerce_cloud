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

		CREATE TABLE IF NOT EXISTS categories (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			name TEXT NOT NULL,
			slug TEXT UNIQUE NOT NULL
		);

		CREATE TABLE IF NOT EXISTS products (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			name TEXT NOT NULL,
			description TEXT,
			price DECIMAL(10,2) NOT NULL,
			stock INT DEFAULT 0,
			category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
			image_url TEXT,
			species TEXT DEFAULT '',
			badge TEXT DEFAULT '',
			is_active BOOLEAN DEFAULT true,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
		);

		-- Insert Initial Categories (if not exist)
		INSERT INTO categories (name, slug)
		VALUES 
			('Freshwater', 'freshwater'),
			('Saltwater', 'saltwater'),
			('Rare', 'rare')
		ON CONFLICT (slug) DO NOTHING;

		-- Insert Mock Products (only if products table is empty)
		INSERT INTO products (name, species, price, description, image_url, badge, category_id, stock, is_active)
		SELECT 'Symphysodon aequifasciatus', 'Discus Fish', 150000, 'Ikan Discus warna-warni yang indah untuk akuarium air tawar.', '/images/discus.png', 'Best Seller', c.id, 50, true
		FROM categories c WHERE c.slug = 'freshwater' AND NOT EXISTS (SELECT 1 FROM products LIMIT 1);

		INSERT INTO products (name, species, price, description, image_url, badge, category_id, stock, is_active)
		SELECT 'Betta splendens', 'Ikan Cupang', 50000, 'Ikan cupang dengan ekor lebar yang cantik.', '/images/cupang.png', 'New', c.id, 100, true
		FROM categories c WHERE c.slug = 'freshwater' AND NOT EXISTS (SELECT 1 FROM products WHERE name='Betta splendens');

		INSERT INTO products (name, species, price, description, image_url, badge, category_id, stock, is_active)
		SELECT 'Amphiprioninae', 'Clownfish', 250000, 'Ikan badut yang populer seperti Nemo. Cocok untuk air laut.', '/images/clownfish.png', 'Hot', c.id, 20, true
		FROM categories c WHERE c.slug = 'saltwater' AND NOT EXISTS (SELECT 1 FROM products WHERE name='Amphiprioninae');

		INSERT INTO products (name, species, price, description, image_url, badge, category_id, stock, is_active)
		SELECT 'Pterois volitans', 'Lionfish', 850000, 'Ikan predator air laut yang elegan dan berbahaya.', '/images/lionfish.png', 'Rare', c.id, 5, true
		FROM categories c WHERE c.slug = 'rare' AND NOT EXISTS (SELECT 1 FROM products WHERE name='Pterois volitans');

		CREATE TABLE IF NOT EXISTS cart_items (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
			product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
			quantity INTEGER NOT NULL CHECK (quantity > 0),
			created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
			UNIQUE(user_id, product_id)
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

		CREATE TABLE IF NOT EXISTS order_items (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
			product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
			quantity INTEGER NOT NULL CHECK (quantity > 0),
			price DECIMAL(10,2) NOT NULL CHECK (price >= 0)
		);

		CREATE TABLE IF NOT EXISTS auctions (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
			start_time TIMESTAMP WITH TIME ZONE NOT NULL,
			end_time TIMESTAMP WITH TIME ZONE NOT NULL,
			starting_price INTEGER NOT NULL CHECK (starting_price >= 0),
			current_bid INTEGER NOT NULL DEFAULT 0 CHECK (current_bid >= 0),
			status TEXT NOT NULL DEFAULT 'active',
			created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
		);

		CREATE TABLE IF NOT EXISTS bids (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
			user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
			bid_amount INTEGER NOT NULL CHECK (bid_amount >= 0),
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
