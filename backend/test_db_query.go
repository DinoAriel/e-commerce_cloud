package main

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"os"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file")
	}
	dbURL := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_SSLMODE"))
	pool, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer pool.Close()

	rows, err := pool.Query(context.Background(), `
		SELECT o.rating, COALESCE(o.review, ''), COALESCE(pr.full_name, pr.username, 'User'), o.created_at
		FROM orders o
		JOIN order_items oi ON o.id = oi.order_id
		JOIN profiles pr ON o.user_id = pr.id
		WHERE o.rating IS NOT NULL
		ORDER BY o.created_at DESC`)
	if err != nil {
		log.Fatalf("Query error: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var rating int
		var comment, username string
		var created_at interface{}
		if err := rows.Scan(&rating, &comment, &username, &created_at); err != nil {
			log.Fatalf("Scan error: %v", err)
		}
		fmt.Printf("Review: %d, %s, %s, %v\n", rating, comment, username, created_at)
	}
	if err := rows.Err(); err != nil {
		log.Fatalf("Rows error: %v", err)
	}
}
