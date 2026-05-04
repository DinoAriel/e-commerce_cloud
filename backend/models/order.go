package models

import "time"

type Order struct {
	ID              string    `json:"id"`
	UserID          string    `json:"user_id"`
	TotalAmount     int       `json:"total_amount"`
	Status          string    `json:"status"`
	ShippingAddress *string   `json:"shipping_address"`
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

type CreateOrderInput struct {
	UserID          string `json:"user_id"`
	ShippingAddress string `json:"shipping_address"`
}

type UpdateOrderStatusInput struct {
	Status string `json:"status"`
}
