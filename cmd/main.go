package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"d0c/petsFriends/database"
	"d0c/petsFriends/routes"
)

func main() {
	database.Init()
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "http://localhost:3000",
	}))

	routes.Setup(app)

	fmt.Print("Идет запуск сервера!")
	log.Fatal(app.Listen(":4000"))

	// engine := html.New("../views", ".html")
	// app := fiber.New(fiber.Config{
	// 	Views: engine,
	// })

	// authStorage := &Storage{map[string]User{}}
	// authHandler := &AuthHandler{authStorage}
	// userHandler := &UserHandler{authStorage}

	// publicGroup := app.Group("public")
	// publicGroup.Get("/register", authHandler.RegistrationPage)
	// publicGroup.Get("/login", authHandler.LoginPage)
	// publicGroup.Post("/register", authHandler.Register)
	// publicGroup.Post("/login", authHandler.Login)

	// authorizedGroup := app.Group("auth")
	// authorizedGroup.Use(jwtware.New(jwtware.Config{
	// 	SigningKey: jwtSecretKey,
	// 	ContextKey: contextKeyUser,
	// }))
	// authorizedGroup.Get("/profile", userHandler.Profile)

	// app.Static("/", "../public")

	// logrus.Fatal(app.Listen(":3000"))
}
