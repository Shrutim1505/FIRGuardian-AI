package config

import (
	"os"
)

type Config struct {
	Port           string
	MongoURI       string
	JWTSecret      string
	OpenAIAPIKey   string
	SpeechAPIKey   string
	EncryptionKey  string
	CORSOrigin     string
	AppEnv         string
}

func Load() *Config {
	return &Config{
		Port:          getEnv("PORT", "5000"),
		MongoURI:      getEnv("MONGODB_URI", "mongodb://localhost:27017/legalassist-ai"),
		JWTSecret:     getEnv("JWT_SECRET", "fallback-secret-key"),
		OpenAIAPIKey:  getEnv("OPENAI_API_KEY", ""),
		SpeechAPIKey:  getEnv("GOOGLE_SPEECH_API_KEY", ""),
		EncryptionKey: getEnv("ENCRYPTION_KEY", ""),
		CORSOrigin:    getEnv("CORS_ORIGIN", "http://localhost:3000"),
		AppEnv:        getEnv("APP_ENV", "development"),
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}