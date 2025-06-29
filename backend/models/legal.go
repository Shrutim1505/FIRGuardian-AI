package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type LegalSection struct {
	ID               primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Section          string             `bson:"section" json:"section"`
	Act              string             `bson:"act" json:"act"`
	Title            string             `bson:"title" json:"title"`
	Description      string             `bson:"description" json:"description"`
	Category         string             `bson:"category" json:"category"`
	Amendments       []string           `bson:"amendments" json:"amendments"`
	RelatedSections  []string           `bson:"related_sections" json:"related_sections"`
	Keywords         []string           `bson:"keywords" json:"keywords"`
	Punishment       string             `bson:"punishment" json:"punishment"`
	IsBailable       bool               `bson:"is_bailable" json:"is_bailable"`
	IsCognizable     bool               `bson:"is_cognizable" json:"is_cognizable"`
	CreatedAt        time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt        time.Time          `bson:"updated_at" json:"updated_at"`
}

type CaseLawRecord struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title        string             `bson:"title" json:"title"`
	Court        string             `bson:"court" json:"court"`
	Year         string             `bson:"year" json:"year"`
	Judges       []string           `bson:"judges" json:"judges"`
	Summary      string             `bson:"summary" json:"summary"`
	KeyPoints    []string           `bson:"key_points" json:"key_points"`
	Citations    []string           `bson:"citations" json:"citations"`
	Category     string             `bson:"category" json:"category"`
	Importance   string             `bson:"importance" json:"importance"` // "landmark", "significant", "reference"
	LegalIssues  []string           `bson:"legal_issues" json:"legal_issues"`
	Sections     []string           `bson:"sections" json:"sections"`
	FullText     string             `bson:"full_text" json:"full_text"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt    time.Time          `bson:"updated_at" json:"updated_at"`
}

type LandmarkJudgment struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Case          string             `bson:"case" json:"case"`
	Court         string             `bson:"court" json:"court"`
	Year          string             `bson:"year" json:"year"`
	Significance  string             `bson:"significance" json:"significance"`
	Impact        string             `bson:"impact" json:"impact"`
	KeyPrinciples []string           `bson:"key_principles" json:"key_principles"`
	LegalDoctrine string             `bson:"legal_doctrine" json:"legal_doctrine"`
	Precedent     string             `bson:"precedent" json:"precedent"`
	CreatedAt     time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt     time.Time          `bson:"updated_at" json:"updated_at"`
}

type SearchRequest struct {
	Query    string `json:"query" binding:"required"`
	Category string `json:"category"`
	Limit    int    `json:"limit"`
	Page     int    `json:"page"`
}