package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"d0c/petsFriends/database"
	"d0c/petsFriends/logs"
	"d0c/petsFriends/routes"
)

func main() {
	database.Init()
	logs.Init()

	app := fiber.New()

	app.Static("/static", "../profileImages")

	clientURL := os.Getenv("CLIENT_HOST") + ":" + os.Getenv("CLIENT_PORT")
	serverURL := os.Getenv("SERVER_HOST") + ":" + os.Getenv("SERVER_PORT")

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     clientURL,
	}))

	routes.Setup(app)

	fmt.Print("Идет запуск сервера!")
	log.Fatal(app.Listen(serverURL))
}
