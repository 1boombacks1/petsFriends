package handlers

import (
	"d0c/petsFriends/database"
	"d0c/petsFriends/models"
	"log"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)

	user := models.User{
		Name:     data["name"],
		Login:    data["login"],
		Password: password,
	}

	if err := database.DB.Create(&user).Error; err != nil {
		log.Printf("User with same login alredy exists!\n")
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "User with same login alredy exists!",
		})
	}

	return c.JSON(user)
}
