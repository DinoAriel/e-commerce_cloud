package jobs

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func StartAuctionCron(pool *pgxpool.Pool) {
	// Jalankan pengecekan pertama kali setelah server hidup
	go processEndedAuctions(pool)

	ticker := time.NewTicker(1 * time.Minute)
	go func() {
		for {
			<-ticker.C
			processEndedAuctions(pool)
		}
	}()
}

func processEndedAuctions(pool *pgxpool.Pool) {
	ctx := context.Background()

	// Mulai transaction
	tx, err := pool.Begin(ctx)
	if err != nil {
		log.Printf("AuctionCron: Gagal mulai transaksi: %v", err)
		return
	}
	defer tx.Rollback(ctx)

	// Cari semua lelang yang sudah habis waktunya tapi masih aktif
	rows, err := tx.Query(ctx, `
		UPDATE auctions
		SET status = 'ended'
		WHERE status = 'active' AND end_time <= now()
		RETURNING id, product_id, current_bid
	`)
	if err != nil {
		log.Printf("AuctionCron: Gagal update status auctions: %v", err)
		return
	}

	type endedAuction struct {
		ID         string
		ProductID  string
		CurrentBid int
	}
	var auctions []endedAuction
	for rows.Next() {
		var a endedAuction
		if err := rows.Scan(&a.ID, &a.ProductID, &a.CurrentBid); err == nil {
			auctions = append(auctions, a)
		}
	}
	rows.Close()

	if len(auctions) == 0 {
		return // Tidak ada lelang yang diakhiri
	}

	fmt.Printf("AuctionCron: Menemukan %d lelang yang berakhir.\n", len(auctions))

	// Cari pemenang untuk masing-masing lelang
	for _, a := range auctions {
		var winnerID string
		err := tx.QueryRow(ctx, `
			SELECT user_id 
			FROM bids 
			WHERE auction_id = $1 
			ORDER BY bid_amount DESC, created_at ASC
			LIMIT 1
		`, a.ID).Scan(&winnerID)

		if err != nil {
			// Tidak ada penawar
			log.Printf("AuctionCron: Lelang %s berakhir tanpa penawar.", a.ID)
			continue
		}

		// Ada pemenang! Buat pesanan (Order)
		var orderID string
		err = tx.QueryRow(ctx, `
			INSERT INTO orders (user_id, status, total, total_amount)
			VALUES ($1, 'pending', $2, $2)
			RETURNING id
		`, winnerID, a.CurrentBid).Scan(&orderID)

		if err != nil {
			log.Printf("AuctionCron: Gagal membuat pesanan untuk pemenang lelang %s: %v", a.ID, err)
			continue
		}

		// Tambahkan Order Item
		_, err = tx.Exec(ctx, `
			INSERT INTO order_items (order_id, product_id, quantity, price)
			VALUES ($1, $2, 1, $3)
		`, orderID, a.ProductID, a.CurrentBid)

		if err != nil {
			log.Printf("AuctionCron: Gagal membuat order_items untuk pemenang lelang %s: %v", a.ID, err)
			continue
		}

		fmt.Printf("AuctionCron: Pesanan berhasil dibuat untuk pemenang lelang %s dengan order ID %s\n", a.ID, orderID)
	}

	tx.Commit(ctx)
}
