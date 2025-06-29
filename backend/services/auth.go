package services

import (
	"context"
	"errors"
	"time"

	"legalassist-ai-backend/database"
	"legalassist-ai-backend/models"
	"legalassist-ai-backend/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	collection string
}

func NewAuthService() *AuthService {
	return &AuthService{
		collection: "users",
	}
}

func (s *AuthService) Register(req models.RegisterRequest) (*models.User, error) {
	collection := database.GetCollection(s.collection)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Check if user already exists
	var existingUser models.User
	err := collection.FindOne(ctx, bson.M{"email": req.Email}).Decode(&existingUser)
	if err == nil {
		return nil, errors.New("user with this email already exists")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Create user
	user := models.User{
		ID:          primitive.NewObjectID(),
		Name:        req.Name,
		Email:       req.Email,
		Password:    string(hashedPassword),
		Badge:       req.Badge,
		Station:     req.Station,
		Rank:        req.Rank,
		Phone:       req.Phone,
		Department:  req.Department,
		District:    req.District,
		State:       req.State,
		IsActive:    true,
		Role:        "officer",
		Permissions: []string{"fir:create", "fir:read", "fir:update"},
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	_, err = collection.InsertOne(ctx, user)
	if err != nil {
		return nil, err
	}

	// Clear password before returning
	user.Password = ""
	return &user, nil
}

func (s *AuthService) Login(req models.LoginRequest) (*models.LoginResponse, error) {
	collection := database.GetCollection(s.collection)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Find user
	var user models.User
	err := collection.FindOne(ctx, bson.M{"email": req.Email}).Decode(&user)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	// Check password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	// Update last login
	now := time.Now()
	_, err = collection.UpdateOne(
		ctx,
		bson.M{"_id": user.ID},
		bson.M{"$set": bson.M{"last_login": now}},
	)
	if err != nil {
		// Log error but don't fail login
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(user.ID.Hex(), user.Email, user.Role)
	if err != nil {
		return nil, err
	}

	// Clear password before returning
	user.Password = ""
	
	return &models.LoginResponse{
		Token: token,
		User:  user,
	}, nil
}

func (s *AuthService) GetUserByID(userID string) (*models.User, error) {
	collection := database.GetCollection(s.collection)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	var user models.User
	err = collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&user)
	if err != nil {
		return nil, err
	}

	user.Password = ""
	return &user, nil
}

func (s *AuthService) UpdateProfile(userID string, updates bson.M) error {
	collection := database.GetCollection(s.collection)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return err
	}

	updates["updated_at"] = time.Now()
	_, err = collection.UpdateOne(
		ctx,
		bson.M{"_id": objectID},
		bson.M{"$set": updates},
	)

	return err
}