package handlers

import (
	"net/http"
	"strconv"

	"legalassist-ai-backend/services"

	"github.com/gin-gonic/gin"
)

type LegalHandler struct {
	legalService *services.LegalService
}

func NewLegalHandler() *LegalHandler {
	return &LegalHandler{
		legalService: services.NewLegalService(),
	}
}

func (h *LegalHandler) SearchLaws(c *gin.Context) {
	query := c.Query("q")
	category := c.Query("category")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	results, err := h.legalService.SearchLaws(query, category, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, results)
}

func (h *LegalHandler) GetSections(c *gin.Context) {
	act := c.Param("act")
	
	// Mock response for now
	c.JSON(http.StatusOK, gin.H{
		"act":      act,
		"sections": []string{"354", "420", "498A"},
	})
}

func (h *LegalHandler) GetCaseLaws(c *gin.Context) {
	section := c.Param("section")
	
	// Mock response for now
	c.JSON(http.StatusOK, gin.H{
		"section":   section,
		"case_laws": []string{},
	})
}

func (h *LegalHandler) GetLandmarkJudgments(c *gin.Context) {
	// Mock response for now
	c.JSON(http.StatusOK, gin.H{
		"judgments": []string{},
	})
}