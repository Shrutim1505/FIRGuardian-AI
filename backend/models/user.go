package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name        string             `bson:"name" json:"name" binding:"required"`
	Email       string             `bson:"email" json:"email" binding:"required,email"`
	Password    string             `bson:"password" json:"password,omitempty" binding:"required,min=6"`
	Badge       string             `bson:"badge" json:"badge" binding:"required"`
	Station     string             `bson:"station" json:"station" binding:"required"`
	Rank        string             `bson:"rank" json:"rank" binding:"required"`
	Phone       string             `bson:"phone" json:"phone"`
	Department  string             `bson:"department" json:"department"`
	District    string             `bson:"district" json:"district"`
	State       string             `bson:"state" json:"state"`
	IsActive    bool               `bson:"is_active" json:"is_active"`
	Role        string             `bson:"role" json:"role"` // "officer", "admin", "supervisor"
	Permissions []string           `bson:"permissions" json:"permissions"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time          `bson:"updated_at" json:"updated_at"`
	LastLogin   *time.Time         `bson:"last_login" json:"last_login"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type RegisterRequest struct {
	Name       string `json:"name" binding:"required"`
	Email      string `json:"email" binding:"required,email"`
	Password   string `json:"password" binding:"required,min=6"`
	Badge      string `json:"badge" binding:"required"`
	Station    string `json:"station" binding:"required"`
	Rank       string `json:"rank" binding:"required"`
	Phone      string `json:"phone"`
	Department string `json:"department"`
	District   string `json:"district"`
	State      string `json:"state"`
}