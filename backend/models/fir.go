package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type FIR struct {
	ID                  primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	FIRNumber           string             `bson:"fir_number" json:"fir_number"`
	OfficerID           primitive.ObjectID `bson:"officer_id" json:"officer_id"`
	ComplainantName     string             `bson:"complainant_name" json:"complainant_name"`
	ComplainantAddress  string             `bson:"complainant_address" json:"complainant_address"`
	ComplainantPhone    string             `bson:"complainant_phone" json:"complainant_phone"`
	IncidentDate        time.Time          `bson:"incident_date" json:"incident_date"`
	IncidentTime        string             `bson:"incident_time" json:"incident_time"`
	IncidentLocation    string             `bson:"incident_location" json:"incident_location"`
	IncidentDescription string             `bson:"incident_description" json:"incident_description"`
	WitnessDetails      string             `bson:"witness_details" json:"witness_details"`
	EvidenceDetails     string             `bson:"evidence_details" json:"evidence_details"`
	OfficerRemarks      string             `bson:"officer_remarks" json:"officer_remarks"`
	Language            string             `bson:"language" json:"language"`
	Status              string             `bson:"status" json:"status"` // "draft", "submitted", "under_investigation", "closed"
	Priority            string             `bson:"priority" json:"priority"` // "low", "medium", "high"
	ApplicableSections  []string           `bson:"applicable_sections" json:"applicable_sections"`
	SuggestedLaws       []SuggestedLaw     `bson:"suggested_laws" json:"suggested_laws"`
	AIAnalysis          AIAnalysis         `bson:"ai_analysis" json:"ai_analysis"`
	GeneratedFIR        string             `bson:"generated_fir" json:"generated_fir"`
	CreatedAt           time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt           time.Time          `bson:"updated_at" json:"updated_at"`
	SubmittedAt         *time.Time         `bson:"submitted_at" json:"submitted_at"`
}

type SuggestedLaw struct {
	Section     string  `bson:"section" json:"section"`
	Act         string  `bson:"act" json:"act"`
	Description string  `bson:"description" json:"description"`
	Confidence  float64 `bson:"confidence" json:"confidence"`
	Relevance   string  `bson:"relevance" json:"relevance"`
}

type AIAnalysis struct {
	Confidence       float64     `bson:"confidence" json:"confidence"`
	KeyEntities      []string    `bson:"key_entities" json:"key_entities"`
	CrimeType        string      `bson:"crime_type" json:"crime_type"`
	RelevantCaseLaws []CaseLaw   `bson:"relevant_case_laws" json:"relevant_case_laws"`
	Recommendations  []string    `bson:"recommendations" json:"recommendations"`
	ProcessedAt      time.Time   `bson:"processed_at" json:"processed_at"`
}

type CaseLaw struct {
	Title     string  `bson:"title" json:"title"`
	Court     string  `bson:"court" json:"court"`
	Year      string  `bson:"year" json:"year"`
	Relevance float64 `bson:"relevance" json:"relevance"`
	Summary   string  `bson:"summary" json:"summary"`
}

type CreateFIRRequest struct {
	ComplainantName     string `json:"complainant_name" binding:"required"`
	ComplainantAddress  string `json:"complainant_address" binding:"required"`
	ComplainantPhone    string `json:"complainant_phone" binding:"required"`
	IncidentDate        string `json:"incident_date" binding:"required"`
	IncidentTime        string `json:"incident_time" binding:"required"`
	IncidentLocation    string `json:"incident_location" binding:"required"`
	IncidentDescription string `json:"incident_description" binding:"required"`
	WitnessDetails      string `json:"witness_details"`
	EvidenceDetails     string `json:"evidence_details"`
	OfficerRemarks      string `json:"officer_remarks"`
	Language            string `json:"language"`
}

type GenerateFIRRequest struct {
	IncidentDescription string `json:"incident_description" binding:"required"`
	ComplainantName     string `json:"complainant_name"`
	IncidentLocation    string `json:"incident_location"`
	IncidentDate        string `json:"incident_date"`
}