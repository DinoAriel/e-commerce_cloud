package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"backend/config"
	"backend/database"

	"github.com/joho/godotenv"
)

func main() {
	// Pindah ke direktori utama backend jika dijalankan dari cmd/migrate
	err := godotenv.Load("../../.env")
	if err != nil {
		err = godotenv.Load("../../.env.example")
		if err != nil {
			log.Println("Peringatan: File .env tidak ditemukan")
		}
	}

	cfg := config.Load()
	pool := database.Connect(cfg)
	defer pool.Close()

	sqlBytes, err := os.ReadFile("../../schema.sql")
	if err != nil {
		log.Fatalf("Gagal membaca schema.sql: %v", err)
	}

	sqlStr := string(sqlBytes)
	fmt.Println("Menjalankan migrasi database...")

	_, err = pool.Exec(context.Background(), sqlStr)
	if err != nil {
		log.Fatalf("Gagal mengeksekusi query migrasi: %v", err)
	}

	fmt.Println("Migrasi dan seeding data berhasil!")
}
