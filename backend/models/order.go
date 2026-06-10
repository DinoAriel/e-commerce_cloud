package models

import "time"

type Order struct {
	ID              string    `json:"id"`
	UserID          string    `json:"user_id"`
	TotalAmount     int       `json:"total_amount"`
	Status          string    `json:"status"`
	ShippingAddress *string   `json:"shipping_address"`
	SnapToken       *string   `json:"snap_token"`
	Rating          *int      `json:"rating"`
	Review          *string   `json:"review"`
	CreatedAt       time.Time `json:"created_at"`
}

type OrderItem struct {
	ID        string `json:"id"`
	OrderID   string `json:"order_id"`
	ProductID string `json:"product_id"`
	Quantity  int    `json:"quantity"`
	Price     int    `json:"price"`
}

type OrderItemWithProduct struct {
	ID        string  `json:"id"`
	OrderID   string  `json:"order_id"`
	ProductID string  `json:"product_id"`
	Quantity  int     `json:"quantity"`
	Price     int     `json:"price"`
	Product   Product `json:"products"`
}

type OrderWithItems struct {
	Order
	Items []OrderItemWithProduct `json:"items"`
}

type CartItemInput struct {
	ProductID string `json:"product_id"`
	Quantity  int    `json:"quantity"`
	Price     int    `json:"price"`
}

type CreateOrderInput struct {
	UserID          string          `json:"user_id"`
	ShippingAddress string          `json:"shipping_address"`
	Items           []CartItemInput `json:"items"`
}

type UpdateOrderStatusInput struct {
	Status string `json:"status"`
}
