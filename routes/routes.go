package routes

import (
	"github.com/gofiber/fiber/v2"

	"d0c/petsFriends/handlers"
)

func Setup(app *fiber.App) {

	auth := app.Group("auth")
	{
		auth.Post("/register", handlers.Register)
		auth.Post("/login", handlers.Login)
	}

	api := app.Group("api")
	{
		api.Get("/breeds", handlers.GetBreeds)
		user := api.Group("user")
		{
			user.Post("/registerPet", handlers.RegisterPet)
			user.Post("/logout", handlers.Logout)
		}
	}
	// api.Get("/user", controllers.User)
	// api.Post("/logout", controllers.Logout)
}
