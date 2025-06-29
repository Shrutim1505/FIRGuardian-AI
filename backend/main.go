package main

import (
	"log"
	"os"

	"legalassist-ai-backend/config"
	"legalassist-ai-backend/database"
	"legalassist-ai-backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize configuration
	cfg := config.Load()

	// Initialize database
	database.InitMongoDB(cfg.MongoURI)
	defer database.CloseMongoDB()

	// Initialize Gin router
	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	// CORS middleware
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{cfg.CORSOrigin}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	corsConfig.AllowCredentials = true
	router.Use(cors.New(corsConfig))

	// API routes
	api := router.Group("/api")
	routes.SetupRoutes(api, cfg)

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "OK", "message": "LegalAssist-AI Backend is running"})
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}