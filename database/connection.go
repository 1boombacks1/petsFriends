package database

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"d0c/petsFriends/models"
)

var DB *gorm.DB

func Init() {
	loadEnv()
	db_name := os.Getenv("DB_NAME")
	db_user := os.Getenv("DB_USER")
	db_password := os.Getenv("DB_PASSWORD")
	db_host := os.Getenv("DB_HOST")
	db_port := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s", db_user, db_password, db_host, db_port, db_name)
	connection, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatalf("Failed to connect to DB, %s", err)
	}

	DB = connection

	connection.AutoMigrate(&models.User{}, &models.Pet{}, &models.Pet{})
}

func loadEnv() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
}
