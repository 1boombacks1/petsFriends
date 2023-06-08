package routes

import (
	"github.com/gofiber/fiber/v2"

	"d0c/petsFriends/handlers"
)

func Setup(app *fiber.App) {
	api := app.Group("api")
	api.Post("/register", handlers.Register)
	api.Post("/login", handlers.Login)
	api.Get("/breeds", handlers.GetBreeds)
	api.Post("/registerPet", handlers.RegisterPet)

	user := app.Group("user")
	user.Post("/logout", handlers.Logout)
	// api.Get("/user", controllers.User)
	// api.Post("/logout", controllers.Logout)
}
