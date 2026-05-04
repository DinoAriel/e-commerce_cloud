package models

import "time"

type CartItem struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	ProductID string    `json:"product_id"`
	Quantity  int       `json:"quantity"`
	CreatedAt time.Time `json:"created_at"`
}

type CartItemWithProduct struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	ProductID string    `json:"product_id"`
	Quantity  int       `json:"quantity"`
	CreatedAt time.Time `json:"created_at"`
	Product   Product   `json:"products"`
}

type AddCartInput struct {
	UserID    string `json:"user_id"`
	ProductID string `json:"product_id"`
	Quantity  *int   `json:"quantity"`
}

type UpdateCartInput struct {
	Quantity int `json:"quantity"`
}
