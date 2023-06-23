package middleware

import (
	"d0c/petsFriends/database"
	"d0c/petsFriends/logs"
	"d0c/petsFriends/models"
	"os"
	"strconv"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
)

func UserJwtCheck(c *fiber.Ctx) error {
	var tokenString string
	authorization := c.Get("Authorization")

	if strings.HasPrefix(authorization, "Bearer ") {
		tokenString = strings.TrimPrefix(authorization, "Bearer ")
	} else if c.Cookies("jwt") != "" {
		tokenString = c.Cookies("jwt")
	}

	if tokenString == "" {
		logs.ErrLogger.Println("User not logged in")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "fail", "message": "You are not logged in"})
	}

	token, err := jwt.ParseWithClaims(tokenString, &jwt.StandardClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET_KEY")), nil
	})
	if err != nil {
		logs.ErrLogger.Println("Unauthorized user")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"status": "unauthorized",
		})
	}

	claims := token.Claims.(*jwt.StandardClaims)

	user_id, _ := strconv.Atoi(claims.Issuer)
	var user models.User
	if err = database.DB.First(&user, user_id).Error; err != nil {
		logs.ErrLogger.Printf("User [%d] not detected in DB: %s", user_id, err.Error())
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"status": "fail", "message": "the user belonging to this token no logger exists",
		})
	}
	logs.InfoLogger.Printf("User id=%d, user login=%s", user.ID, user.Login)

	c.Locals("user", models.FilterUserResponse(&user))
	return c.Next()
}

func AuthJwtCheck(c *fiber.Ctx) error {
	if strings.HasPrefix(c.Get("Authorization"), "Bearer ") || c.Cookies("jwt") != "" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"status": "fail", "message": "You are logged, to get started, log out of the profile",
		})
}
return c.Next()}

