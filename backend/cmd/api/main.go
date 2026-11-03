package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"

	"taskmanager/backend/internal/database"
	"taskmanager/backend/internal/routes"
)

func main() {
	_ = godotenv.Load()

	dbPath := os.Getenv("DATABASE_PATH")
	if dbPath == "" {
		dbPath = "./data/tasks.db"
	}

	db, err := database.New(dbPath)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	router := routes.NewRouter(db)

	log.Printf("Server running on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
