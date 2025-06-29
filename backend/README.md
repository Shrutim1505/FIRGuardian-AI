# LegalAssist-AI Backend

A comprehensive Golang backend for the LegalAssist-AI system, providing secure APIs for police officers to draft accurate FIRs using AI assistance.

## Features

- **Authentication & Authorization**: JWT-based secure authentication
- **AI-Powered Analysis**: Integration with OpenAI/LLM for incident analysis
- **FIR Management**: Complete CRUD operations for FIR drafting and management
- **Legal Database**: Comprehensive legal sections, case laws, and judgments
- **Voice Processing**: Audio transcription capabilities
- **Real-time Analytics**: Dashboard with statistics and insights
- **Multilingual Support**: Support for multiple Indian languages
- **Security**: Enterprise-level security with encryption and validation

## Tech Stack

- **Language**: Go 1.21+
- **Framework**: Gin (HTTP web framework)
- **Database**: MongoDB
- **Authentication**: JWT tokens
- **AI Integration**: OpenAI API
- **Containerization**: Docker & Docker Compose

## Setup & Installation

### Prerequisites

- Go 1.21 or higher
- MongoDB 7.0+
- OpenAI API key (optional, for AI features)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   go mod download
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run MongoDB** (if not using Docker)
   ```bash
   # Using local MongoDB
   mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7
   ```

5. **Run the application**
   ```bash
   go run main.go
   ```

The server will start on `http://localhost:5000`

### Docker Development

1. **Using Docker Compose**
   ```bash
   docker-compose up -d
   ```

This will start both the application and MongoDB containers.

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new officer
- `POST /api/auth/login` - Officer login
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/profile` - Get officer profile

### FIR Management Endpoints

- `POST /api/fir/create` - Create new FIR
- `GET /api/fir/list` - Get officer's FIRs (with pagination)
- `GET /api/fir/:id` - Get specific FIR
- `POST /api/fir/generate` - Generate FIR using AI
- `PUT /api/fir/:id/submit` - Submit FIR
- `POST /api/fir/transcribe` - Transcribe audio to text

### Dashboard Endpoints

- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-cases` - Get recent cases

### Legal Database Endpoints

- `GET /api/legal/search` - Search legal database
- `GET /api/legal/sections/:act` - Get sections by act
- `GET /api/legal/case-laws/:section` - Get case laws by section
- `GET /api/legal/landmark-judgments` - Get landmark judgments

### Settings Endpoints

- `GET /api/settings/profile` - Get profile settings
- `PUT /api/settings/profile` - Update profile
- `GET /api/settings/preferences` - Get user preferences
- `PUT /api/settings/preferences` - Update preferences

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port (default: 5000) | No |
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | Secret key for JWT tokens | Yes |
| OPENAI_API_KEY | OpenAI API key for AI features | No |
| GOOGLE_SPEECH_API_KEY | Google Speech API key | No |
| CORS_ORIGIN | Frontend URL for CORS | No |
| APP_ENV | Environment (development/production) | No |

## Project Structure

```
backend/
├── config/          # Configuration management
├── database/        # Database connection and setup
├── handlers/        # HTTP request handlers
├── middleware/      # Custom middleware (auth, etc.)
├── models/          # Data models and structures
├── routes/          # Route definitions
├── services/        # Business logic
├── utils/           # Utility functions
├── main.go          # Application entry point
├── go.mod           # Go dependencies
├── Dockerfile       # Docker configuration
└── docker-compose.yml
```

## AI Integration

The system integrates with multiple AI services:

1. **OpenAI GPT**: For incident analysis and FIR generation
2. **Google Speech API**: For audio transcription
3. **Natural Language Processing**: For entity extraction and legal mapping

### Sample AI Analysis Request

```json
{
  "incident_description": "A woman was harassed by a group of men near the market..."
}
```

### Sample AI Response

```json
{
  "confidence": 87.5,
  "crime_type": "harassment",
  "suggested_laws": [
    {
      "section": "354",
      "act": "Indian Penal Code",
      "description": "Assault or criminal force to woman with intent to outrage her modesty",
      "confidence": 85.0,
      "relevance": "high"
    }
  ],
  "relevant_case_laws": [
    {
      "title": "Vishaka vs State of Rajasthan",
      "court": "Supreme Court of India",
      "year": "1997",
      "relevance": 92.0,
      "summary": "Landmark judgment on workplace harassment"
    }
  ]
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **CORS Protection**: Configurable CORS policies
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API rate limiting (can be configured)
- **Data Encryption**: Sensitive data encryption

## Testing

Run tests using:

```bash
go test ./...
```

For coverage report:

```bash
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

## Deployment

### Production Deployment

1. **Build the application**
   ```bash
   go build -o main .
   ```

2. **Set production environment variables**
   ```bash
   export APP_ENV=production
   export JWT_SECRET=your-secure-secret
   export MONGODB_URI=your-production-mongodb-uri
   ```

3. **Run the application**
   ```bash
   ./main
   ```

### Docker Production

```bash
docker build -t legalassist-ai-backend .
docker run -p 5000:5000 --env-file .env legalassist-ai-backend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.