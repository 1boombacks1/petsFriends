package handlers

import (
	"d0c/petsFriends/database"
	. "d0c/petsFriends/logs"
	"d0c/petsFriends/models"
	"d0c/petsFriends/utils"
	"os"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
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
		ErrLogger.Printf("User with [%s] login alredy exists!\n", user.Login)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"status": "loginExist",
		})
	}

	InfoLogger.Printf("User [%s,%s] created success!\n", user.Login, user.Name)

	return c.JSON(fiber.Map{
		"status": "ok",
		"user":   user,
	})
}

func Login(c *fiber.Ctx) error {
	//Create payload for data
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User

	database.DB.Preload("Pets").Where("login = ?", data["login"]).First(&user)

	if user.Model.ID == 0 {
		ErrLogger.Printf("User [%s] not found in database\n", user.Login)
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"status": "userNotFound",
		})
	}

	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(data["password"])); err != nil {
		ErrLogger.Printf("User [%s] exists, but password not correct: %s\n", user.Login, err.Error())
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"status": "incorrectPassword",
		})
	}

	InfoLogger.Printf("User [%s] input data correct!", user.Login)

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.Model.ID)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	})

	token, err := claims.SignedString([]byte(os.Getenv("SECRET_KEY")))
	if err != nil {
		ErrLogger.Printf("Failed to create JWT: %s\n", err.Error())
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"status": "FailedToLogin",
		})
	}

	InfoLogger.Printf("Successful creation JWT for [%s] - [%s]\n", user.Login, token)

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	hasPets := len(user.Pets)

	InfoLogger.Printf("User [%s] have %d pets\n", user.Login, hasPets)

	sendData := fiber.Map{
		"status":  "ok",
		"hasPets": false,
	}
	if hasPets > 0 {
		sendData = fiber.Map{
			"status":  "ok",
			"hasPets": true,
		}
	}

	return c.JSON(sendData)
}

func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}
	c.Cookie(&cookie)
	c.Status(fiber.StatusOK)

	InfoLogger.Println("User logout from app")

	return c.JSON(fiber.Map{
		"status": "ok",
	})
}

func GetBreeds(c *fiber.Ctx) error {
	breeds := []models.Breed{}
	if err := database.DB.Find(&breeds).Error; err != nil {
		return c.SendStatus(fiber.StatusBadGateway)
	}
	return c.JSON(breeds)
}

func RegisterPet(c *fiber.Ctx) error {
	user := c.Locals("user").(models.UserResponse)

	var payload models.RegisterRequest

	if err := c.BodyParser(&payload); err != nil {
		ErrLogger.Printf("Не спарсил данные! %s", err)
		return err
	}

	img, err := c.FormFile("img")
	if err != nil {
		ErrLogger.Printf("Failed to get file from client: %v", err)
		return err
	}
	db_path := utils.MakeImagePath(user.ID, img.Filename)

	if err = c.SaveFile(img, os.Getenv("IMAGES_PATH")+db_path); err != nil {
		ErrLogger.Printf("Failed to save image on server: %v", err)
		return err
	}

	pet := models.Pet{
		TypePet: payload.TypePet,
		Name:    payload.Name,
		Age:     uint(payload.Age),
		Sex:     payload.Sex,
		BreedID: uint(payload.Breed),
		Mating:  payload.IsMeeting,
		UserID:  user.ID,
		Images: []models.Image{
			{Path: db_path},
		},
	}

	if err := database.DB.Create(&pet).Error; err != nil {
		ErrLogger.Printf("Failed to create pet %s in DB: %s", pet.Name, err.Error())
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"status": "Error: Failed to create pet in DB",
		})
	}

	InfoLogger.Printf(
		"Питомец пользователя [%d] зарегистрирован [Имя: %s,Пол: %v,Тип: %v,Порода: %v,Цель: %v,Возраст: %d]",
		user.ID,
		payload.Name,
		payload.Sex,
		payload.TypePet,
		payload.Breed,
		payload.IsMeeting,
		payload.Age)

	return c.SendStatus(fiber.StatusOK)
}

// func GetProfilePetById(c *fiber.Ctx) error {
// 	user_id, _ := strconv.Atoi(c.Params("id"))
// 	// var user models.User
// 	var pet models.Pet
// 	// database.DB.Preload("Pets").Where("id = ?", user_id).First(&user)
// 	if err := database.DB.Where("user_id = ?", user_id).First(&pet).Error; err != nil {
// 		ErrLogger.Printf("Не удалось найти питомца пользователя: %v", err)
// 		return err
// 	}

// 	InfoLogger.Printf("Питомец: %v", pet)

// 	return c.JSON(pet)
// }

func GetMe(c *fiber.Ctx) error {
	user := c.Locals("user").(models.UserResponse)

	var userPet models.Pet

	if err := database.DB.Preload("Breed").Preload("Images").
		Where("user_id = ?", user.ID).Find(&userPet).Error; err != nil {
		ErrLogger.Printf("Не удалось найти питомца пользователя: %v", err)
		return err
	}

	photos := make([]string, 0)
	for _, img := range userPet.Images {
		photos = append(photos, img.Path)
	}

	awards := make([]string, 1)
	for _, award := range userPet.Awards {
		awards = append(awards, award.AwardName)
	}

	InfoLogger.Printf(
		"Питомец - [name: %s, sex: %v, breed: %s, age: %d, photos: %v, goal: %v, pedigree: %v, awards: %v]",
		userPet.Name, userPet.Sex, userPet.Breed.BreedName,
		userPet.Age, photos, userPet.Mating, userPet.Pedigree, userPet.Awards,
	)
	InfoLogger.Print(awards)
	return c.JSON(models.PetResponse{
		Name:        userPet.Name,
		Sex:         userPet.Sex,
		Breed:       userPet.Breed.BreedName,
		Age:         userPet.Age,
		AboutMeInfo: userPet.AboutMeInfo,
		Photos:      photos,
		Goal:        userPet.Mating,
		Pedigree:    userPet.Pedigree,
		Awards:      awards,
	})
}
