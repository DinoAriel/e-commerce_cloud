package models

import "time"

type Chat struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	User      *Profile  `json:"user,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	LastMessage *ChatMessage `json:"last_message,omitempty"`
	UnreadCount int `json:"unread_count"`
}

type ChatMessage struct {
	ID        string    `json:"id"`
	ChatID    string    `json:"chat_id"`
	SenderID  string    `json:"sender_id"`
	Content   string    `json:"content"`
	IsRead    bool      `json:"is_read"`
	CreatedAt time.Time `json:"created_at"`
}

// WSMessage is the payload sent/received over WebSocket
type WSMessage struct {
	Type     string `json:"type"` // e.g., "message", "auth"
	Token    string `json:"token,omitempty"`
	Content  string `json:"content,omitempty"`
	ChatID   string `json:"chat_id,omitempty"` // Required when admin replies
	SenderID string `json:"sender_id,omitempty"`
}
