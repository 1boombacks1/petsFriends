package main

import (
	"fmt"
	"log"

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

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "http://localhost:3000",
	}))

	routes.Setup(app)

	fmt.Print("Идет запуск сервера!")
	log.Fatal(app.Listen(":4000"))
}
