package main

import (
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/golang-jwt/jwt/v4"
	"github.com/sirupsen/logrus"

	"d0c/petsFriends/database"
	"d0c/petsFriends/routes"
)

type (
	AuthHandler struct {
		storage *Storage
	}
	Storage struct {
		users map[string]User
	}
	User struct {
		Login    string
		password string
	}
)

//Обработчик HTTP-запросов которые свзязаны с пользователем
type UserHandler struct {
	storage *Storage
}

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

type ProfileResponse struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

//Ошибки
var (
	errBadCredentials     = errors.New("email or password is incorrect")
	errPasswordNotCorrect = errors.New("password is incorrect")
)

//JWT-ключ, стоит хранить в безопастном месте, а не хардкодить тут
var jwtSecretKey = []byte("very-secret-key")

const contextKeyUser = "user"

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

	fmt.Printf("Пользователь %s успешно зарегистрирован!\n", regReq.Login)
	return c.SendStatus(fiber.StatusCreated)
}

func (handler *AuthHandler) Login(c *fiber.Ctx) error {
	logReq := LoginRequest{}
	if err := c.BodyParser(&logReq); err != nil {
		return fmt.Errorf("body parser: %w", err)
	}

	user, exists := handler.storage.users[logReq.Login]
	fmt.Printf("Info:\n-%s\n-%s\n", logReq.Login, logReq.Password)

	if !exists {
		return errBadCredentials
	}

	if exists && logReq.Password != user.password {
		return errPasswordNotCorrect
	}

	payload := jwt.MapClaims{
		"sub": logReq.Login,
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, payload)
	t, err := token.SignedString(jwtSecretKey)
	if err != nil {
		logrus.WithError(err).Error("JWT token signing")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.JSON(LoginResponse{AccessToken: t})
}

func jwtPayloadFromRequest(c *fiber.Ctx) (jwt.MapClaims, bool) {
	jwtToken, ok := c.Context().Value(contextKeyUser).(*jwt.Token)
	if !ok {
		logrus.WithFields(logrus.Fields{
			"jwt_token_context_value": c.Context().Value(contextKeyUser),
		}).Error("wrong type of JWT token in context")
		return nil, false
	}

	payload, ok := jwtToken.Claims.(jwt.MapClaims)
	if !ok {
		logrus.WithFields(logrus.Fields{
			"jwt_token_claims": jwtToken.Claims,
		}).Error("wrong type of JWT token claims")
		return nil, false
	}

	return payload, true
}

func (handler *UserHandler) Profile(c *fiber.Ctx) error {
	payload, ok := jwtPayloadFromRequest(c)

	if !ok {
		return c.SendStatus(fiber.StatusUnauthorized)
	}
	userInfo, ok := handler.storage.users[payload["sub"].(string)]
	if !ok {
		return errors.New("user not found")
	}

	return c.JSON(ProfileResponse{
		Login:    userInfo.Login,
		Password: userInfo.password,
	})
}
