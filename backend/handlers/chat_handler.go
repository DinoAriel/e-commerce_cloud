package handlers

import (
	"backend/config"
	"backend/models"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ChatHandler struct {
	DB      *pgxpool.Pool
	Config  config.Config
	Clients map[*websocket.Conn]string // Maps connection to UserID
	mu      sync.Mutex
}

func NewChatHandler(db *pgxpool.Pool, cfg config.Config) *ChatHandler {
	return &ChatHandler{
		DB:      db,
		Config:  cfg,
		Clients: make(map[*websocket.Conn]string),
	}
}


// GetChats returns a list of all chats, useful for the Admin Dashboard
func (h *ChatHandler) GetChats(c *fiber.Ctx) error {
	role, _ := c.Locals("user_role").(string)

	if role != "admin" {
		return models.Error(c, "Akses ditolak", 403)
	}

	rows, err := h.DB.Query(c.Context(), `
		SELECT 
			c.id, c.user_id, c.created_at, c.updated_at,
			p.id, p.username, p.full_name, p.avatar_url,
			(SELECT content FROM chat_messages cm WHERE cm.chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_content,
			(SELECT created_at FROM chat_messages cm WHERE cm.chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
			(SELECT COUNT(*) FROM chat_messages cm WHERE cm.chat_id = c.id AND cm.is_read = false AND cm.sender_id = c.user_id) as unread_count
		FROM chats c
		JOIN profiles p ON c.user_id = p.id
		ORDER BY c.updated_at DESC
	`)
	if err != nil {
		return models.Error(c, "Gagal mengambil data chat", 500)
	}
	defer rows.Close()

	var chats []models.Chat
	for rows.Next() {
		var chat models.Chat
		var p models.Profile
		var lastMsgContent *string
		var lastMsgTime *time.Time
		
		err := rows.Scan(
			&chat.ID, &chat.UserID, &chat.CreatedAt, &chat.UpdatedAt,
			&p.ID, &p.Username, &p.FullName, &p.AvatarURL,
			&lastMsgContent, &lastMsgTime, &chat.UnreadCount,
		)
		if err == nil {
			chat.User = &p
			if lastMsgContent != nil && lastMsgTime != nil {
				chat.LastMessage = &models.ChatMessage{
					Content:   *lastMsgContent,
					CreatedAt: *lastMsgTime,
				}
			}
			chats = append(chats, chat)
		}
	}
	return models.Success(c, chats)
}

// GetChatMessages returns history of messages
func (h *ChatHandler) GetChatMessages(c *fiber.Ctx) error {
	chatID := c.Params("id")
	userID := c.Locals("user_id").(string)
	role, _ := c.Locals("user_role").(string)

	// Verify permission
	if role != "admin" {
		var ownerID string
		err := h.DB.QueryRow(c.Context(), "SELECT user_id FROM chats WHERE id = $1", chatID).Scan(&ownerID)
		if err != nil {
			fmt.Println("[DEBUG CHAT] err getting owner:", err)
			return models.Error(c, "Akses ditolak", 403)
		}
		if ownerID != userID {
			fmt.Println("[DEBUG CHAT] owner mismatch. ownerID:", ownerID, "userID:", userID)
			return models.Error(c, "Akses ditolak", 403)
		}
	}

	// Mark messages as read
	if role == "admin" {
		h.DB.Exec(c.Context(), "UPDATE chat_messages SET is_read = true WHERE chat_id = $1 AND sender_id = (SELECT user_id FROM chats WHERE id = $1)", chatID)
	} else {
		h.DB.Exec(c.Context(), "UPDATE chat_messages SET is_read = true WHERE chat_id = $1 AND sender_id != $2", chatID, userID)
	}

	rows, err := h.DB.Query(c.Context(), "SELECT id, chat_id, sender_id, content, is_read, created_at FROM chat_messages WHERE chat_id = $1 ORDER BY created_at ASC", chatID)
	if err != nil {
		return models.Error(c, "Gagal mengambil pesan", 500)
	}
	defer rows.Close()

	var messages []models.ChatMessage
	for rows.Next() {
		var msg models.ChatMessage
		if err := rows.Scan(&msg.ID, &msg.ChatID, &msg.SenderID, &msg.Content, &msg.IsRead, &msg.CreatedAt); err == nil {
			messages = append(messages, msg)
		}
	}
	return models.Success(c, messages)
}

// GetOrCreateChat for User
func (h *ChatHandler) GetOrCreateChat(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(string)
	var chatID string
	err := h.DB.QueryRow(c.Context(), "SELECT id FROM chats WHERE user_id = $1", userID).Scan(&chatID)
	
	if err != nil {
		// Create new chat
		err = h.DB.QueryRow(c.Context(), "INSERT INTO chats (user_id) VALUES ($1) RETURNING id", userID).Scan(&chatID)
		if err != nil {
			return models.Error(c, "Gagal membuat chat", 500)
		}
	}

	return models.Success(c, fiber.Map{"chat_id": chatID})
}

// WebSocket handler
func (h *ChatHandler) HandleWebSocket(c *websocket.Conn) {
	// Locals are inherited from fiber Context if middleware sets them before upgrade
	userID, _ := c.Locals("user_id").(string)
	role, _ := c.Locals("user_role").(string)

	if role == "admin" {
		// Keep the real userID to satisfy foreign key constraint!
	}

	h.mu.Lock()
	h.Clients[c] = userID
	h.mu.Unlock()

	defer func() {
		h.mu.Lock()
		delete(h.Clients, c)
		h.mu.Unlock()
		c.Close()
	}()

	for {
		var msg models.WSMessage
		if err := c.ReadJSON(&msg); err != nil {
			fmt.Println("[DEBUG WS ERROR]:", err)
			break
		}

		if msg.Type == "message" {
			h.processMessage(userID, role, msg)
		}
	}
}

func (h *ChatHandler) processMessage(senderID string, role string, msg models.WSMessage) {
	var chatID string
	var receiverID string

	if role == "admin" {
		chatID = msg.ChatID
		if chatID == "" {
			return // Admin must specify which chat
		}
		// We use the admin's real senderID, which satisfies the foreign key
		// Find user_id from chat to know the receiver
		h.DB.QueryRow(context.Background(), "SELECT user_id FROM chats WHERE id = $1", chatID).Scan(&receiverID)
	} else {
		// User sending to admin
		// Ensure chat exists
		err := h.DB.QueryRow(context.Background(), "SELECT id FROM chats WHERE user_id = $1", senderID).Scan(&chatID)
		if err != nil {
			h.DB.QueryRow(context.Background(), "INSERT INTO chats (user_id) VALUES ($1) RETURNING id", senderID).Scan(&chatID)
		}
		receiverID = "admin"
	}

	// Save message to DB
	var savedMsg models.ChatMessage
	err := h.DB.QueryRow(context.Background(), `
		INSERT INTO chat_messages (chat_id, sender_id, content) 
		VALUES ($1, $2, $3) 
		RETURNING id, chat_id, sender_id, content, is_read, created_at
	`, chatID, senderID, msg.Content).Scan(&savedMsg.ID, &savedMsg.ChatID, &savedMsg.SenderID, &savedMsg.Content, &savedMsg.IsRead, &savedMsg.CreatedAt)

	if err != nil {
		log.Println("Error saving message:", err)
		return
	}

	// Update chat updated_at
	h.DB.Exec(context.Background(), "UPDATE chats SET updated_at = NOW() WHERE id = $1", chatID)

	// Broadcast to sender and receiver
	payload, _ := json.Marshal(savedMsg)
	
	h.mu.Lock()
	for conn, clientID := range h.Clients {
		// Admin needs to receive their own messages and all messages directed to them
		if clientID == senderID || clientID == receiverID || clientID == "admin" {
			conn.WriteMessage(websocket.TextMessage, payload)
		}
	}
	h.mu.Unlock()
}
