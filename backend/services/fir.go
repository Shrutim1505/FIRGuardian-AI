package services

import (
	"context"
	"fmt"
	"time"

	"legalassist-ai-backend/database"
	"legalassist-ai-backend/models"
	"legalassist-ai-backend/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type FIRService struct {
	collection string
	aiService  *AIService
}

func NewFIRService() *FIRService {
	return &FIRService{
		collection: "firs",
		aiService:  NewAIService(),
	}
}

func (s *FIRService) CreateFIR(req models.CreateFIRRequest, officerID string) (*models.FIR, error) {
	collection := database.GetCollection(s.collection)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(officerID)
	if err != nil {
		return nil, err
	}

	// Parse incident date
	incidentDate, err := time.Parse("2006-01-02", req.IncidentDate)
	if err != nil {
		return nil, fmt.Errorf("invalid incident date format")
	}

	// Generate FIR number
	firNumber := utils.GenerateFIRNumber()

	// Analyze incident with AI
	aiAnalysis, suggestedLaws := s.aiService.AnalyzeIncident(req.IncidentDescription)

	fir := models.FIR{
		ID:                  primitive.NewObjectID(),
		FIRNumber:           firNumber,
		OfficerID:           objectID,
		ComplainantName:     req.ComplainantName,
		ComplainantAddress:  req.ComplainantAddress,
		ComplainantPhone:    req.ComplainantPhone,
		IncidentDate:        incidentDate,
		IncidentTime:        req.IncidentTime,
		IncidentLocation:    req.IncidentLocation,
		IncidentDescription: req.IncidentDescription,
		WitnessDetails:      req.WitnessDetails,
		EvidenceDetails:     req.EvidenceDetails,
		OfficerRemarks:      req.OfficerRemarks,
		Language:            req.Language,
		Status:              "draft",
		Priority:            s.determinePriority(req.IncidentDescription),
		SuggestedLaws:       suggestedLaws,
		AIAnalysis:          aiAnalysis,
		CreatedAt:           time.Now(),
		UpdatedAt:           time.Now(),
	}

	// Extract applicable sections
	for _, law := range suggestedLaws {
		fir.ApplicableSections = append(fir.ApplicableSections, law.Section)
	}

	_, err = collection.InsertOne(ctx, fir)
	if err != nil {
		return nil, err
	}

	return &fir, nil
}

func (s *FIRService) GetFIRs(officerID string, page, limit int) ([]models.FIR, int64, error) {
	collection := database.GetCollection(s.collection)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(officerID)
	if err != nil {
		return nil, 0, err
	}

	filter := bson.M{"officer_id": objectID}
	
	// Count total documents
	total, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	// Find with pagination
	opts := options.Find()
	opts.SetSort(bson.D{{"created_at", -1}})
	opts.SetSkip(int64((page - 1) * limit))
	opts.SetLimit(int64(limit))

	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	var firs []models.FIR
	err = cursor.All(ctx, &firs)
	if err != nil {
		return nil, 0, err
	}

	return firs, total, nil
}

func (s *FIRService) GetFIRByID(firID, officerID string) (*models.FIR, error) {
	collection := database.GetCollection(s.collection)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	firObjectID, err := primitive.ObjectIDFromHex(firID)
	if err != nil {
		return nil, err
	}

	officerObjectID, err := primitive.ObjectIDFromHex(officerID)
	if err != nil {
		return nil, err
	}

	var fir models.FIR
	err = collection.FindOne(ctx, bson.M{
		"_id":       firObjectID,
		"officer_id": officerObjectID,
	}).Decode(&fir)
	if err != nil {
		return nil, err
	}

	return &fir, nil
}

func (s *FIRService) UpdateFIR(firID, officerID string, updates bson.M) error {
	collection := database.GetCollection(s.collection)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	firObjectID, err := primitive.ObjectIDFromHex(firID)
	if err != nil {
		return err
	}

	officerObjectID, err := primitive.ObjectIDFromHex(officerID)
	if err != nil {
		return err
	}

	updates["updated_at"] = time.Now()
	_, err = collection.UpdateOne(
		ctx,
		bson.M{"_id": firObjectID, "officer_id": officerObjectID},
		bson.M{"$set": updates},
	)

	return err
}

func (s *FIRService) GenerateFIR(req models.GenerateFIRRequest) (string, error) {
	return s.aiService.GenerateFIRDocument(req)
}

func (s *FIRService) SubmitFIR(firID, officerID string) error {
	now := time.Now()
	return s.UpdateFIR(firID, officerID, bson.M{
		"status":       "submitted",
		"submitted_at": now,
	})
}

func (s *FIRService) GetDashboardStats(officerID string) (map[string]interface{}, error) {
	collection := database.GetCollection(s.collection)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(officerID)
	if err != nil {
		return nil, err
	}

	// Aggregate stats
	pipeline := []bson.M{
		{"$match": bson.M{"officer_id": objectID}},
		{"$group": bson.M{
			"_id": "$status",
			"count": bson.M{"$sum": 1},
		}},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	statusCounts := make(map[string]int)
	for cursor.Next(ctx) {
		var result struct {
			ID    string `bson:"_id"`
			Count int    `bson:"count"`
		}
		cursor.Decode(&result)
		statusCounts[result.ID] = result.Count
	}

	// Get recent cases
	recentCases, _, err := s.GetFIRs(officerID, 1, 5)
	if err != nil {
		return nil, err
	}

	total := 0
	for _, count := range statusCounts {
		total += count
	}

	// Calculate accuracy rate (mock calculation)
	accuracyRate := 87 // In real implementation, this would be calculated based on AI predictions vs actual outcomes

	return map[string]interface{}{
		"totalFIRs":     total,
		"pendingFIRs":   statusCounts["draft"] + statusCounts["submitted"],
		"completedFIRs": statusCounts["closed"],
		"accuracyRate":  accuracyRate,
		"recentCases":   s.formatRecentCases(recentCases),
	}, nil
}

func (s *FIRService) formatRecentCases(firs []models.FIR) []map[string]interface{} {
	var cases []map[string]interface{}
	for _, fir := range firs {
		cases = append(cases, map[string]interface{}{
			"id":         fir.ID.Hex(),
			"title":      fmt.Sprintf("%s - %s", fir.FIRNumber, fir.ComplainantName),
			"status":     fir.Status,
			"date":       fir.CreatedAt.Format("2006-01-02"),
			"confidence": fir.AIAnalysis.Confidence,
		})
	}
	return cases
}

func (s *FIRService) determinePriority(description string) string {
	// Simple priority determination based on keywords
	// In a real implementation, this would use more sophisticated NLP
	description = utils.ToLower(description)
	
	highPriorityKeywords := []string{"murder", "rape", "kidnapping", "terrorism", "bomb", "weapon", "gun"}
	mediumPriorityKeywords := []string{"assault", "theft", "burglary", "fraud", "harassment"}
	
	for _, keyword := range highPriorityKeywords {
		if utils.Contains(description, keyword) {
			return "high"
		}
	}
	
	for _, keyword := range mediumPriorityKeywords {
		if utils.Contains(description, keyword) {
			return "medium"
		}
	}
	
	return "low"
}