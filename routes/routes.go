package routes

import (
	"github.com/gofiber/fiber/v2"

	"d0c/petsFriends/handlers"
)

func Setup(app *fiber.App) {
	api := app.Group("api")
	api.Post("/register", handlers.Register)
	// api.Post("/login", controllers.Login)
	// api.Get("/user", controllers.User)
	// api.Post("/logout", controllers.Logout)
}
