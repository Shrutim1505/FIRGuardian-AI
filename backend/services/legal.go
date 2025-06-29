package services

import (
	"context"
	"strings"
	"time"

	"legalassist-ai-backend/database"
	"legalassist-ai-backend/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type LegalService struct {
	sectionsCollection   string
	caseLawsCollection   string
	judgmentsCollection  string
}

func NewLegalService() *LegalService {
	return &LegalService{
		sectionsCollection:  "legal_sections",
		caseLawsCollection:  "case_laws",
		judgmentsCollection: "landmark_judgments",
	}
}

func (s *LegalService) SearchLaws(query string, category string, page, limit int) (map[string]interface{}, error) {
	// Create search filter
	filter := bson.M{}
	if query != "" {
		filter["$or"] = []bson.M{
			{"title": bson.M{"$regex": query, "$options": "i"}},
			{"description": bson.M{"$regex": query, "$options": "i"}},
			{"keywords": bson.M{"$in": []string{query}}},
		}
	}
	if category != "" && category != "all" {
		filter["category"] = category
	}

	// Search legal sections
	sections, sectionsTotal, _ := s.searchSections(filter, page, limit)
	
	// Search case laws
	caseLaws, caseLawsTotal, _ := s.searchCaseLaws(filter, page, limit)
	
	// Search judgments
	judgments, judgmentsTotal, _ := s.searchJudgments(filter, page, limit)

	return map[string]interface{}{
		"sections": map[string]interface{}{
			"data":  sections,
			"total": sectionsTotal,
		},
		"case_laws": map[string]interface{}{
			"data":  caseLaws,
			"total": caseLawsTotal,
		},
		"judgments": map[string]interface{}{
			"data":  judgments,
			"total": judgmentsTotal,
		},
	}, nil
}

func (s *LegalService) searchSections(filter bson.M, page, limit int) ([]models.LegalSection, int64, error) {
	collection := database.GetCollection(s.sectionsCollection)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Get mock data if collection is empty
	count, _ := collection.CountDocuments(ctx, bson.M{})
	if count == 0 {
		return s.getMockSections(), 3, nil
	}

	total, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	opts := options.Find()
	opts.SetSkip(int64((page - 1) * limit))
	opts.SetLimit(int64(limit))
	opts.SetSort(bson.D{{"section", 1}})

	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	var sections []models.LegalSection
	err = cursor.All(ctx, &sections)
	return sections, total, err
}

func (s *LegalService) searchCaseLaws(filter bson.M, page, limit int) ([]models.CaseLawRecord, int64, error) {
	collection := database.GetCollection(s.caseLawsCollection)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Get mock data if collection is empty
	count, _ := collection.CountDocuments(ctx, bson.M{})
	if count == 0 {
		return s.getMockCaseLaws(), 2, nil
	}

	total, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	opts := options.Find()
	opts.SetSkip(int64((page - 1) * limit))
	opts.SetLimit(int64(limit))
	opts.SetSort(bson.D{{"year", -1}})

	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	var caseLaws []models.CaseLawRecord
	err = cursor.All(ctx, &caseLaws)
	return caseLaws, total, err
}

func (s *LegalService) searchJudgments(filter bson.M, page, limit int) ([]models.LandmarkJudgment, int64, error) {
	collection := database.GetCollection(s.judgmentsCollection)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Get mock data if collection is empty
	count, _ := collection.CountDocuments(ctx, bson.M{})
	if count == 0 {
		return s.getMockJudgments(), 2, nil
	}

	// Modify filter for judgments
	judgmentFilter := bson.M{}
	if filter["$or"] != nil {
		judgmentFilter["$or"] = []bson.M{
			{"case": bson.M{"$regex": filter["$or"].([]bson.M)[0]["title"].(bson.M)["$regex"], "$options": "i"}},
			{"significance": bson.M{"$regex": filter["$or"].([]bson.M)[0]["title"].(bson.M)["$regex"], "$options": "i"}},
		}
	}

	total, err := collection.CountDocuments(ctx, judgmentFilter)
	if err != nil {
		return nil, 0, err
	}

	opts := options.Find()
	opts.SetSkip(int64((page - 1) * limit))
	opts.SetLimit(int64(limit))
	opts.SetSort(bson.D{{"year", -1}})

	cursor, err := collection.Find(ctx, judgmentFilter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	var judgments []models.LandmarkJudgment
	err = cursor.All(ctx, &judgments)
	return judgments, total, err
}

// Mock data functions
func (s *LegalService) getMockSections() []models.LegalSection {
	return []models.LegalSection{
		{
			ID:              primitive.NewObjectID(),
			Section:         "354",
			Act:             "Indian Penal Code",
			Title:           "Assault or criminal force to woman with intent to outrage her modesty",
			Description:     "Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty, shall be punished with imprisonment of either description for a term which may extend to two years, or with fine, or with both.",
			Category:        "crimes_against_women",
			Amendments:      []string{"Criminal Law Amendment Act, 2013"},
			RelatedSections: []string{"354A", "354B", "354C", "354D"},
			Keywords:        []string{"assault", "woman", "modesty", "criminal force"},
			Punishment:      "Imprisonment up to 2 years or fine or both",
			IsBailable:      true,
			IsCognizable:    true,
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
		},
		{
			ID:              primitive.NewObjectID(),
			Section:         "420",
			Act:             "Indian Penal Code",
			Title:           "Cheating and dishonestly inducing delivery of property",
			Description:     "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
			Category:        "property_crimes",
			Amendments:      []string{},
			RelatedSections: []string{"415", "417", "418", "419"},
			Keywords:        []string{"cheating", "fraud", "property", "deception"},
			Punishment:      "Imprisonment up to 7 years and fine",
			IsBailable:      false,
			IsCognizable:    true,
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
		},
		{
			ID:              primitive.NewObjectID(),
			Section:         "498A",
			Act:             "Indian Penal Code",
			Title:           "Husband or relative of husband of a woman subjecting her to cruelty",
			Description:     "Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine.",
			Category:        "crimes_against_women",
			Amendments:      []string{"Criminal Law Amendment Act, 1983"},
			RelatedSections: []string{"304B", "406", "34"},
			Keywords:        []string{"dowry", "cruelty", "husband", "domestic violence"},
			Punishment:      "Imprisonment up to 3 years and fine",
			IsBailable:      false,
			IsCognizable:    true,
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
		},
	}
}

func (s *LegalService) getMockCaseLaws() []models.CaseLawRecord {
	return []models.CaseLawRecord{
		{
			ID:          primitive.NewObjectID(),
			Title:       "Vishaka & Ors vs State Of Rajasthan & Ors",
			Court:       "Supreme Court of India",
			Year:        "1997",
			Judges:      []string{"Justice J.S. Verma", "Justice Sujata V. Manohar", "Justice B.N. Kirpal"},
			Summary:     "This landmark judgment established guidelines for prevention of sexual harassment of women at workplace and the obligations of employers.",
			KeyPoints:   []string{"Established Vishaka Guidelines", "Sexual harassment as violation of fundamental rights", "Employer obligations", "Complaint procedures"},
			Citations:   []string{"AIR 1997 SC 3011", "1997 (6) SCC 241"},
			Category:    "women_rights",
			Importance:  "landmark",
			LegalIssues: []string{"Sexual harassment", "Workplace safety", "Fundamental rights"},
			Sections:    []string{"354", "509"},
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          primitive.NewObjectID(),
			Title:       "State of Punjab vs Gurmit Singh & Ors",
			Court:       "Supreme Court of India",
			Year:        "1996",
			Judges:      []string{"Justice K. Ramaswamy", "Justice S. Saghir Ahmad"},
			Summary:     "This case clarified the scope and meaning of outraging modesty under Section 354 IPC and established important precedents.",
			KeyPoints:   []string{"Definition of outraging modesty", "Physical contact not always necessary", "Mens rea requirement", "Victim testimony importance"},
			Citations:   []string{"AIR 1996 SC 1393", "1996 (2) SCC 384"},
			Category:    "criminal_law",
			Importance:  "significant",
			LegalIssues: []string{"Outraging modesty", "Section 354", "Criminal law"},
			Sections:    []string{"354"},
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
	}
}

func (s *LegalService) getMockJudgments() []models.LandmarkJudgment {
	return []models.LandmarkJudgment{
		{
			ID:            primitive.NewObjectID(),
			Case:          "Kesavananda Bharati vs State of Kerala",
			Court:         "Supreme Court of India",
			Year:          "1973",
			Significance:  "Established the Basic Structure Doctrine of the Constitution",
			Impact:        "Fundamental principle that limits Parliament's power to amend the Constitution",
			KeyPrinciples: []string{"Basic Structure Doctrine", "Parliamentary limitations", "Constitutional supremacy", "Judicial review"},
			LegalDoctrine: "Basic Structure Doctrine",
			Precedent:     "Constitutional amendments cannot alter the basic structure of the Constitution",
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		},
		{
			ID:            primitive.NewObjectID(),
			Case:          "Maneka Gandhi vs Union of India",
			Court:         "Supreme Court of India",
			Year:          "1978",
			Significance:  "Expanded the scope of Article 21 (Right to Life and Personal Liberty)",
			Impact:        "Established that right to life includes right to live with dignity",
			KeyPrinciples: []string{"Expanded Article 21", "Right to dignity", "Procedural due process", "Interconnected rights"},
			LegalDoctrine: "Expanded interpretation of fundamental rights",
			Precedent:     "Right to life and personal liberty includes various facets of human dignity",
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		},
	}
}