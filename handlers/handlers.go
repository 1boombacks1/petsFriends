package handlers

import (
	"d0c/petsFriends/database"
	. "d0c/petsFriends/logs"
	"d0c/petsFriends/models"
	"os"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

type registerRequest struct {
	TypePet   bool   `json:"petType"`
	Name      string `json:"name"`
	Age       int    `json:"age"`
	Sex       bool   `json:"sex"`
	Breed     int    `json:"breed"`
	IsMeeting bool   `json:"goal"`
}

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

	InfoLogger.Printf("User [%s,%s,%v] created success!\n", user.Login, user.Name, user.Password)

	return c.JSON(fiber.Map{
		"status": "ok",
		"user":   user,
	})
}

func Login(c *fiber.Ctx) error {
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
	tokenFromCookie := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(tokenFromCookie, &jwt.StandardClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET_KEY")), nil
	})
	if err != nil {
		ErrLogger.Println("Unauthorized user")
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"status": "unauthorized",
		})
	}

	claims := token.Claims.(*jwt.StandardClaims)

	var data registerRequest

	if err := c.BodyParser(&data); err != nil {
		ErrLogger.Printf("Не спарсил данные! %s\n", err)
		return err
	}

	userId, _ := strconv.Atoi(claims.Issuer)
	pet := models.Pet{
		TypePet: data.TypePet,
		Name:    data.Name,
		Age:     uint(data.Age),
		Sex:     data.Sex,
		BreedID: uint(data.Breed),
		Mating:  data.IsMeeting,
		UserID:  uint(userId),
	}

	if err := database.DB.Create(&pet).Error; err != nil {
		ErrLogger.Printf("Failed to create pet %s in DB: %s", pet.Name, err.Error())
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"status": "Error: Failed to create pet in DB",
		})
	}

	InfoLogger.Printf("Pet [%s] created success! %v\n", pet.Name, pet)
	return c.SendStatus(fiber.StatusOK)
}
