package models

import "time"

type Profile struct {
	ID        string    `json:"id"`
	Username  *string   `json:"username"`
	FullName  *string   `json:"full_name"`
	Phone     *string   `json:"phone"`
	Address   *string   `json:"address"`
	AvatarURL *string   `json:"avatar_url"`
	Role      *string   `json:"role"`
	Gender    *string   `json:"gender"`
	BirthDate *string   `json:"birth_date"`
	CreatedAt time.Time `json:"created_at"`
}

type UpdateProfileInput struct {
	Username  *string `json:"username"`
	FullName  *string `json:"full_name"`
	Phone     *string `json:"phone"`
	Address   *string `json:"address"`
	AvatarURL *string `json:"avatar_url"`
	Gender    *string `json:"gender"`
	BirthDate *string `json:"birth_date"`
}
