package models

import "time"

type Auction struct {
	ID         string    `json:"id"`
	ProductID  string    `json:"product_id"`
	StartPrice int       `json:"start_price"`
	CurrentBid *int      `json:"current_bid"`
	StartTime  time.Time `json:"start_time"`
	EndTime    time.Time `json:"end_time"`
	Status     string    `json:"status"`
	CreatedAt  time.Time `json:"created_at"`
}

type AuctionWithProduct struct {
	Auction
	Product Product `json:"products"`
}

type AuctionDetail struct {
	Auction
	Product Product       `json:"products"`
	Bids    []BidWithUser `json:"bids"`
}

type BidWithUser struct {
	ID        string    `json:"id"`
	AuctionID string    `json:"auction_id"`
	UserID    string    `json:"user_id"`
	Amount    int       `json:"amount"`
	CreatedAt time.Time `json:"created_at"`
	FullName  *string   `json:"full_name"`
	AvatarURL *string   `json:"avatar_url"`
}

type CreateAuctionInput struct {
	ProductID  string `json:"product_id"`
	StartPrice int    `json:"start_price"`
	StartTime  string `json:"start_time"`
	EndTime    string `json:"end_time"`
}

type PlaceBidInput struct {
	UserID string `json:"user_id"`
	Amount int    `json:"amount"`
}
