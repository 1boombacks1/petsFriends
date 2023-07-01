package routes

import (
	"fmt"

	"github.com/gofiber/fiber/v2"

	"d0c/petsFriends/handlers"
	"d0c/petsFriends/middleware"
)

func Setup(app *fiber.App) {

	auth := app.Group("auth", middleware.AuthJwtCheck)
	{
		auth.Get("/checker", handlers.Checker)
		auth.Post("/register", handlers.Register)
		auth.Post("/login", handlers.Login)
	}

	api := app.Group("api", middleware.UserJwtCheck)
	{
		api.Get("/breeds", handlers.GetBreeds)
		user := api.Group("user")
		{
			user.Post("/registerPet", handlers.RegisterPet)
			user.Post("/logout", handlers.Logout)
			user.Get("/getMe", handlers.GetMe)
			user.Patch("/updateInfo", handlers.UpdateUserInfo)
			user.Patch("/updateProfilePhoto", handlers.UpdateProfilePhoto)

			user.Get("/getSuitablePets", handlers.GetSuitablePets)
			user.Post("/dislikePet", handlers.DislikePet)
			user.Post("/likePet", handlers.LikePet)

			user.Get("/getLikeAndLikedPetsAndPairs", handlers.GetLikeAndLikedPetsAndPairs)
			
			user.Get("/getProfile/:id", handlers.GetProfilePetById)
		}
	}

	app.All("*", func(c *fiber.Ctx) error {
		path := c.Path()
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "fail",
			"message": fmt.Sprintf("Path %s not exist 😔", path),
		})
	})
}
