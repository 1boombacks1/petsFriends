package main

import (
	"errors"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html"
	"github.com/sirupsen/logrus"
)

type (
	AuthHandler struct {
		storage *AuthStorage
	}
	AuthStorage struct {
		users map[string]User
	}
	User struct {
		Login    string
		password string
	}
)

// Структуры HTTP-запросов на регистрацию и аунтитификацию
type RegisterRequest struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

//Структура HTTP-ответ на вход в акк
//Содержится JWT токен
type LoginResponse struct {
	AccessToken string `json:"access_token"`
}

//Ошибки
var (
	errBadCredentials = errors.New("email or password is incorrect")
)

//JWT-ключ, стоит хранить в безопастном месте, а не хардкодить тут
var jwtSecretKey = []byte("very-secret-key")

func main() {
	engine := html.New("../views", ".html")
	app := fiber.New(fiber.Config{
		Views: engine,
	})

	authHandler := &AuthHandler{&AuthStorage{map[string]User{}}}

	app.Get("/register", authHandler.RegistrationPage)
	app.Get("/login", authHandler.LoginPage)

	app.Post("/register", authHandler.Register)
	app.Post("/login", authHandler.Login)

	app.Static("/", "../public")

	logrus.Fatal(app.Listen(":3000"))
}

func (handler *AuthHandler) RegistrationPage(c *fiber.Ctx) error {
	return c.Render("registration", fiber.Map{})
}

func (handler *AuthHandler) LoginPage(c *fiber.Ctx) error {
	return c.Render("login", fiber.Map{})
}

func (handler *AuthHandler) Register(c *fiber.Ctx) error {
	regReq := RegisterRequest{}
	if err := c.BodyParser(&regReq); err != nil {
		return fmt.Errorf("body parser: %w", err)
	}

	if _, exists := handler.storage.users[regReq.Login]; exists {
		return errors.New("the user already exists")
	}

	handler.storage.users[regReq.Login] = User{
		Login:    regReq.Login,
		password: regReq.Password,
	}

	return c.SendStatus(fiber.StatusCreated)
}

func (handler *AuthHandler) Login(c *fiber.Ctx) error {

}
