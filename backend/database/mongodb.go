package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	Client   *mongo.Client
	Database *mongo.Database
)

func InitMongoDB(uri string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}

	// Ping the database
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Failed to ping MongoDB:", err)
	}

	Client = client
	Database = client.Database("legalassist-ai")
	log.Println("Connected to MongoDB successfully")
}

func CloseMongoDB() {
	if Client != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		Client.Disconnect(ctx)
		log.Println("MongoDB connection closed")
	}
}

func GetCollection(collectionName string) *mongo.Collection {
	return Database.Collection(collectionName)
}