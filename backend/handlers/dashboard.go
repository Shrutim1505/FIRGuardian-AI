package handlers

import (
	"net/http"

	"legalassist-ai-backend/services"

	"github.com/gin-gonic/gin"
)

type DashboardHandler struct {
	firService *services.FIRService
}

func NewDashboardHandler() *DashboardHandler {
	return &DashboardHandler{
		firService: services.NewFIRService(),
	}
}

func (h *DashboardHandler) GetStats(c *gin.Context) {
	userID, _ := c.Get("user_id")

	stats, err := h.firService.GetDashboardStats(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stats)
}

func (h *DashboardHandler) GetRecentCases(c *gin.Context) {
	userID, _ := c.Get("user_id")

	firs, _, err := h.firService.GetFIRs(userID.(string), 1, 5)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, firs)
}