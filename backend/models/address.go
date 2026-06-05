package models

import "time"

type UserAddress struct {
	ID            string    `json:"id"`
	UserID        string    `json:"user_id"`
	RecipientName string    `json:"recipient_name"`
	PhoneNumber   string    `json:"phone_number"`
	FullAddress   string    `json:"full_address"`
	IsPrimary     bool      `json:"is_primary"`
	CreatedAt     time.Time `json:"created_at"`
}

type CreateAddressInput struct {
	RecipientName string `json:"recipient_name"`
	PhoneNumber   string `json:"phone_number"`
	FullAddress   string `json:"full_address"`
	IsPrimary     bool   `json:"is_primary"`
}

type UpdateAddressInput struct {
	RecipientName *string `json:"recipient_name"`
	PhoneNumber   *string `json:"phone_number"`
	FullAddress   *string `json:"full_address"`
	IsPrimary     *bool   `json:"is_primary"`
}
