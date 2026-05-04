package models

import "time"

type Product struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Species     string    `json:"species"`
	Price       int       `json:"price"`
	Description string    `json:"description"`
	ImageURL    string    `json:"image_url"`
	Badge       *string   `json:"badge"`
	CategoryID  *string   `json:"category_id"`
	Stock       int       `json:"stock"`
	IsActive    bool      `json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
}

type ProductWithCategory struct {
	Product
	Category *CategoryInfo `json:"categories"`
}

type CategoryInfo struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

type ProductListResponse struct {
	Products []ProductWithCategory `json:"products"`
	Total    int                   `json:"total"`
	Limit    int                   `json:"limit"`
	Offset   int                   `json:"offset"`
}

type CreateProductInput struct {
	Name        string  `json:"name"`
	Species     string  `json:"species"`
	Price       int     `json:"price"`
	Description string  `json:"description"`
	ImageURL    string  `json:"image_url"`
	Badge       *string `json:"badge"`
	CategoryID  *string `json:"category_id"`
	Stock       *int    `json:"stock"`
	IsActive    *bool   `json:"is_active"`
}

type UpdateProductInput struct {
	Name        *string `json:"name"`
	Species     *string `json:"species"`
	Price       *int    `json:"price"`
	Description *string `json:"description"`
	ImageURL    *string `json:"image_url"`
	Badge       *string `json:"badge"`
	CategoryID  *string `json:"category_id"`
	Stock       *int    `json:"stock"`
	IsActive    *bool   `json:"is_active"`
}
