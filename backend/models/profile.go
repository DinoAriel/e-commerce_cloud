package models

import "time"

type Profile struct {
	ID        string    `json:"id"`
	FullName  *string   `json:"full_name"`
	Phone     *string   `json:"phone"`
	Address   *string   `json:"address"`
	AvatarURL *string   `json:"avatar_url"`
	CreatedAt time.Time `json:"created_at"`
}

type UpdateProfileInput struct {
	FullName  *string `json:"full_name"`
	Phone     *string `json:"phone"`
	Address   *string `json:"address"`
	AvatarURL *string `json:"avatar_url"`
}
