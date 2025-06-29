package handlers

import (
	"net/http"
	"strconv"

	"legalassist-ai-backend/models"
	"legalassist-ai-backend/services"

	"github.com/gin-gonic/gin"
)

type FIRHandler struct {
	firService *services.FIRService
}

func NewFIRHandler() *FIRHandler {
	return &FIRHandler{
		firService: services.NewFIRService(),
	}
}

func (h *FIRHandler) CreateFIR(c *gin.Context) {
	var req models.CreateFIRRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")
	fir, err := h.firService.CreateFIR(req, userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, fir)
}

func (h *FIRHandler) GetFIRs(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	userID, _ := c.Get("user_id")
	firs, total, err := h.firService.GetFIRs(userID.(string), page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  firs,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

func (h *FIRHandler) GetFIRByID(c *gin.Context) {
	firID := c.Param("id")
	userID, _ := c.Get("user_id")

	fir, err := h.firService.GetFIRByID(firID, userID.(string))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "FIR not found"})
		return
	}

	c.JSON(http.StatusOK, fir)
}

func (h *FIRHandler) GenerateFIR(c *gin.Context) {
	var req models.GenerateFIRRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	generatedFIR, err := h.firService.GenerateFIR(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"generated_fir": generatedFIR,
	})
}

func (h *FIRHandler) SubmitFIR(c *gin.Context) {
	firID := c.Param("id")
	userID, _ := c.Get("user_id")

	err := h.firService.SubmitFIR(firID, userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "FIR submitted successfully"})
}

func (h *FIRHandler) TranscribeAudio(c *gin.Context) {
	file, err := c.FormFile("audio")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Audio file required"})
		return
	}

	// Mock transcription response
	c.JSON(http.StatusOK, gin.H{
		"transcription": "This is a mock transcription of the recorded audio. In a real application, this would be processed by your speech-to-text service.",
	})
}