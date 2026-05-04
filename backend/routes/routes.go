package routes

import (
	"backend/config"
	"backend/handlers"
	"backend/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
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
	orderHandler := handlers.NewOrderHandler(pool)
	auctionHandler := handlers.NewAuctionHandler(pool)

	// Products (GET public, write needs auth)
	products := app.Group("/api/products")
	products.Get("/", productHandler.GetProducts)
	products.Get("/:id", productHandler.GetProduct)
	products.Post("/", auth, productHandler.CreateProduct)
	products.Put("/:id", auth, productHandler.UpdateProduct)
	products.Delete("/:id", auth, productHandler.DeleteProduct)

	// Categories (GET public, write needs auth)
	categories := app.Group("/api/categories")
	categories.Get("/", categoryHandler.GetCategories)
	categories.Post("/", auth, categoryHandler.CreateCategory)
	categories.Delete("/:id", auth, categoryHandler.DeleteCategory)

	// Profiles (needs auth)
	profiles := app.Group("/api/profiles", auth)
	profiles.Get("/:id", profileHandler.GetProfile)
	profiles.Put("/:id", profileHandler.UpdateProfile)

	// Cart (needs auth)
	cart := app.Group("/api/cart", auth)
	cart.Get("/:userId", cartHandler.GetCartItems)
	cart.Post("/", cartHandler.AddToCart)
	cart.Put("/:id", cartHandler.UpdateCartItem)
	cart.Delete("/:id", cartHandler.RemoveCartItem)

	// Orders (needs auth)
	orders := app.Group("/api/orders", auth)
	orders.Post("/", orderHandler.CreateOrder)
	orders.Get("/user/:userId", orderHandler.GetUserOrders)
	orders.Get("/:id", orderHandler.GetOrderDetail)
	orders.Put("/:id/status", orderHandler.UpdateOrderStatus)
	orders.Put("/:id/cancel", orderHandler.CancelOrder)

	// Auctions (GET public, write needs auth)
	auctions := app.Group("/api/auctions")
	auctions.Get("/", auctionHandler.GetAuctions)
	auctions.Get("/:id", auctionHandler.GetAuctionDetail)
	auctions.Get("/:id/bids", auctionHandler.GetAuctionBids)
	auctions.Post("/", auth, auctionHandler.CreateAuction)
	auctions.Post("/:id/bids", auth, auctionHandler.PlaceBid)
}
