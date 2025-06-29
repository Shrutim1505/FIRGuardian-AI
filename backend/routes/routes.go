package routes

import (
	"legalassist-ai-backend/config"
	"legalassist-ai-backend/handlers"
	"legalassist-ai-backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.RouterGroup, cfg *config.Config) {
	// Initialize handlers
	authHandler := handlers.NewAuthHandler()
	firHandler := handlers.NewFIRHandler()
	dashboardHandler := handlers.NewDashboardHandler()
	legalHandler := handlers.NewLegalHandler()

	// Auth routes
	auth := router.Group("/auth")
	{
		auth.POST("/register", authHandler.Register)
		auth.POST("/login", authHandler.Login)
		auth.GET("/verify", middleware.AuthMiddleware(), authHandler.VerifyToken)
		auth.GET("/profile", middleware.AuthMiddleware(), authHandler.GetProfile)
	}

	// Protected routes
	protected := router.Group("/")
	protected.Use(middleware.AuthMiddleware())

	// Dashboard routes
	dashboard := protected.Group("/dashboard")
	{
		dashboard.GET("/stats", dashboardHandler.GetStats)
		dashboard.GET("/recent-cases", dashboardHandler.GetRecentCases)
	}

	// FIR routes
	fir := protected.Group("/fir")
	{
		fir.POST("/create", firHandler.CreateFIR)
		fir.GET("/list", firHandler.GetFIRs)
		fir.GET("/:id", firHandler.GetFIRByID)
		fir.POST("/generate", firHandler.GenerateFIR)
		fir.PUT("/:id/submit", firHandler.SubmitFIR)
		fir.POST("/transcribe", firHandler.TranscribeAudio)
	}

	// Legal database routes
	legal := protected.Group("/legal")
	{
		legal.GET("/search", legalHandler.SearchLaws)
		legal.GET("/sections/:act", legalHandler.GetSections)
		legal.GET("/case-laws/:section", legalHandler.GetCaseLaws)
		legal.GET("/landmark-judgments", legalHandler.GetLandmarkJudgments)
	}

	// Settings routes
	settings := protected.Group("/settings")
	{
		settings.GET("/profile", authHandler.GetProfile)
		settings.PUT("/profile", authHandler.GetProfile) // Will implement update
		settings.GET("/preferences", func(c *gin.Context) {
			c.JSON(200, gin.H{"preferences": map[string]interface{}{}})
		})
	}
}