package routes

import (
	"backend/config"
	"backend/handlers"
	"backend/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/websocket/v2"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Setup(app *fiber.App, pool *pgxpool.Pool, cfg config.Config) {
	app.Use(logger.New())
	app.Use(cors.New(middleware.CORSConfig()))

	auth := middleware.JWTProtected(cfg.JWTSecret)

	productHandler := handlers.NewProductHandler(pool)
	categoryHandler := handlers.NewCategoryHandler(pool)
	profileHandler := handlers.NewProfileHandler(pool)
	cartHandler := handlers.NewCartHandler(pool)
	orderHandler := handlers.NewOrderHandler(pool, cfg)
	auctionHandler := handlers.NewAuctionHandler(pool)
	uploadHandler := handlers.NewUploadHandler()
	addressHandler := handlers.NewAddressHandler(pool)
	chatHandler := handlers.NewChatHandler(pool, cfg)

	// Middleware to check if request is a WebSocket upgrade
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	// WebSocket Route
	app.Get("/ws/chat", auth, websocket.New(chatHandler.HandleWebSocket))

	// Auth (public)
	app.Post("/api/auth/register", handlers.Register(pool))
	app.Post("/api/auth/login", handlers.Login(pool))

	// Products (GET public, write needs auth)
	products := app.Group("/api/products")
	products.Get("/", productHandler.GetProducts)
	products.Get("", productHandler.GetProducts)
	products.Get("/:id", productHandler.GetProduct)
	products.Post("/", auth, productHandler.CreateProduct)
	products.Post("", auth, productHandler.CreateProduct)
	products.Put("/:id", auth, productHandler.UpdateProduct)
	products.Delete("/:id", auth, productHandler.DeleteProduct)
	
	// Temporary admin route to clear products
	products.Delete("/admin/truncate", auth, productHandler.TruncateProducts)

	// Categories (GET public, write needs auth)
	categories := app.Group("/api/categories")
	categories.Get("/admin/schema", func(c *fiber.Ctx) error {
		rows, err := pool.Query(c.Context(), "SELECT column_name FROM information_schema.columns WHERE table_name = 'order_items'")
		if err != nil {
			return c.JSON(fiber.Map{"error": err.Error()})
		}
		defer rows.Close()
		var cols []string
		for rows.Next() {
			var col string
			rows.Scan(&col)
			cols = append(cols, col)
		}
		return c.JSON(fiber.Map{"columns": cols})
	})
	categories.Get("/", categoryHandler.GetCategories)
	categories.Get("", categoryHandler.GetCategories)
	categories.Post("/", auth, categoryHandler.CreateCategory)
	categories.Post("", auth, categoryHandler.CreateCategory)
	categories.Delete("/:id", auth, categoryHandler.DeleteCategory)

	// Profiles (needs auth)
	profiles := app.Group("/api/profiles", auth)
	profiles.Get("/:id", profileHandler.GetProfile)
	profiles.Put("/:id", profileHandler.UpdateProfile)

	// Cart (needs auth)
	cart := app.Group("/api/cart", auth)
	cart.Get("/:userId", cartHandler.GetCartItems)
	cart.Post("/", cartHandler.AddToCart)
	cart.Post("", cartHandler.AddToCart)
	cart.Put("/:id", cartHandler.UpdateCartItem)
	cart.Delete("/:id", cartHandler.RemoveCartItem)

	// Orders (needs auth)
	orders := app.Group("/api/orders", auth)
	orders.Get("/", orderHandler.GetAllOrders)
	orders.Get("", orderHandler.GetAllOrders)
	orders.Post("/", orderHandler.CreateOrder)
	orders.Post("", orderHandler.CreateOrder)
	orders.Get("/user/:userId", orderHandler.GetUserOrders)
	orders.Get("/:id", orderHandler.GetOrderDetail)
	orders.Put("/:id/status", orderHandler.UpdateOrderStatus)
	orders.Put("/:id/cancel", orderHandler.CancelOrder)
	orders.Put("/:id/rate", orderHandler.RateOrder)

	// Webhook Midtrans (public)
	app.Post("/api/payment/notification", orderHandler.PaymentNotification)

	// Auctions (GET public, write needs auth)
	auctions := app.Group("/api/auctions")
	auctions.Get("/", auctionHandler.GetAuctions)
	auctions.Get("", auctionHandler.GetAuctions)
	auctions.Get("/my", auth, auctionHandler.GetMyAuctions)
	auctions.Get("/:id", auctionHandler.GetAuctionDetail)
	auctions.Get("/:id/bids", auctionHandler.GetAuctionBids)
	auctions.Post("/", auth, auctionHandler.CreateAuction)
	auctions.Post("", auth, auctionHandler.CreateAuction)
	auctions.Post("/:id/bids", auth, auctionHandler.PlaceBid)

	// Uploads
	app.Post("/api/upload", auth, uploadHandler.UploadImage)

	// Addresses (needs auth)
	addresses := app.Group("/api/addresses", auth)
	addresses.Get("/user/:userId", addressHandler.GetUserAddresses)
	addresses.Post("/", addressHandler.CreateAddress)
	addresses.Post("", addressHandler.CreateAddress)
	addresses.Put("/:id", addressHandler.UpdateAddress)
	addresses.Delete("/:id", addressHandler.DeleteAddress)
	// Chats (needs auth)
	chats := app.Group("/api/chats", auth)
	chats.Get("/", chatHandler.GetChats) // For admin list
	chats.Get("", chatHandler.GetChats)
	chats.Post("/init", chatHandler.GetOrCreateChat) // For user
	chats.Get("/:id/messages", chatHandler.GetChatMessages)
}
