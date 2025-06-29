package services

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"legalassist-ai-backend/models"

	"github.com/sashabaranov/go-openai"
)

type AIService struct {
	client *openai.Client
}

func NewAIService() *AIService {
	// In production, get API key from config
	return &AIService{
		client: openai.NewClient(""), // Add your OpenAI API key here
	}
}

func (s *AIService) AnalyzeIncident(description string) (models.AIAnalysis, []models.SuggestedLaw) {
	// For demo purposes, return mock data
	// In production, this would call OpenAI API or other LLM
	
	analysis := models.AIAnalysis{
		Confidence:  s.calculateConfidence(description),
		KeyEntities: s.extractEntities(description),
		CrimeType:   s.determineCrimeType(description),
		RelevantCaseLaws: []models.CaseLaw{
			{
				Title:     "State of Punjab vs Gurmit Singh",
				Court:     "Supreme Court of India",
				Year:      "1996",
				Relevance: 0.85,
				Summary:   "Definition and scope of outraging modesty under Section 354 IPC",
			},
		},
		Recommendations: []string{
			"Ensure all witness statements are recorded accurately",
			"Consider collecting additional evidence for stronger case",
			"Verify jurisdiction and applicable state amendments",
		},
	}

	suggestedLaws := s.getSuggestedLaws(description)

	return analysis, suggestedLaws
}

func (s *AIService) GenerateFIRDocument(req models.GenerateFIRRequest) (string, error) {
	// Mock FIR generation - in production, use OpenAI API
	template := `
FIRST INFORMATION REPORT
(Under Section 154 of the Code of Criminal Procedure, 1973)

Police Station: %s
Date: %s

COMPLAINANT DETAILS:
Name: %s

INCIDENT DETAILS:
Date of Incident: %s
Description: %s

APPLICABLE SECTIONS:
Based on AI analysis, the following sections may be applicable:
- Section 354 of Indian Penal Code
- Section 509 of Indian Penal Code

This FIR has been generated with AI assistance and should be reviewed by the investigating officer.
	`

	generatedFIR := fmt.Sprintf(template,
		req.IncidentLocation,
		req.IncidentDate,
		req.ComplainantName,
		req.IncidentDate,
		req.IncidentDescription,
	)

	return strings.TrimSpace(generatedFIR), nil
}

func (s *AIService) TranscribeAudio(audioData []byte) (string, error) {
	// Mock transcription - in production, use Google Speech API or Whisper
	return "This is a mock transcription of the recorded audio. In a real application, this would be processed by your speech-to-text service.", nil
}

func (s *AIService) calculateConfidence(description string) float64 {
	// Simple confidence calculation based on description length and keywords
	if len(description) < 50 {
		return 65.0
	} else if len(description) < 200 {
		return 80.0
	}
	return 90.0
}

func (s *AIService) extractEntities(description string) []string {
	// Mock entity extraction
	entities := []string{"person", "location", "incident"}
	
	desc := strings.ToLower(description)
	if strings.Contains(desc, "woman") || strings.Contains(desc, "girl") {
		entities = append(entities, "female victim")
	}
	if strings.Contains(desc, "phone") || strings.Contains(desc, "mobile") {
		entities = append(entities, "electronic device")
	}
	
	return entities
}

func (s *AIService) determineCrimeType(description string) string {
	desc := strings.ToLower(description)
	
	if strings.Contains(desc, "assault") || strings.Contains(desc, "attack") {
		return "assault"
	}
	if strings.Contains(desc, "theft") || strings.Contains(desc, "steal") {
		return "theft"
	}
	if strings.Contains(desc, "fraud") || strings.Contains(desc, "cheat") {
		return "fraud"
	}
	
	return "miscellaneous"
}

func (s *AIService) getSuggestedLaws(description string) []models.SuggestedLaw {
	// Mock law suggestions based on keywords
	desc := strings.ToLower(description)
	var laws []models.SuggestedLaw

	if strings.Contains(desc, "woman") || strings.Contains(desc, "modesty") {
		laws = append(laws, models.SuggestedLaw{
			Section:     "354",
			Act:         "Indian Penal Code",
			Description: "Assault or criminal force to woman with intent to outrage her modesty",
			Confidence:  85.0,
			Relevance:   "high",
		})
		laws = append(laws, models.SuggestedLaw{
			Section:     "509",
			Act:         "Indian Penal Code",
			Description: "Word, gesture or act intended to insult the modesty of a woman",
			Confidence:  78.0,
			Relevance:   "medium",
		})
	}

	if strings.Contains(desc, "theft") || strings.Contains(desc, "steal") {
		laws = append(laws, models.SuggestedLaw{
			Section:     "379",
			Act:         "Indian Penal Code",
			Description: "Punishment for theft",
			Confidence:  90.0,
			Relevance:   "high",
		})
	}

	if strings.Contains(desc, "fraud") || strings.Contains(desc, "cheat") {
		laws = append(laws, models.SuggestedLaw{
			Section:     "420",
			Act:         "Indian Penal Code",
			Description: "Cheating and dishonestly inducing delivery of property",
			Confidence:  88.0,
			Relevance:   "high",
		})
	}

	return laws
}

// Real OpenAI integration (for when API key is available)
func (s *AIService) callOpenAI(prompt string) (string, error) {
	resp, err := s.client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
		},
	)

	if err != nil {
		return "", err
	}

	return resp.Choices[0].Message.Content, nil
}