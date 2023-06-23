package handlers

import (
	"d0c/petsFriends/database"
	. "d0c/petsFriends/logs"
	"d0c/petsFriends/models"
	"d0c/petsFriends/utils"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
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
		Contact:  utils.ValidContactForm(data["contact"]),
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

func Checker(c *fiber.Ctx) error {
	return c.SendStatus(200)
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
		ErrLogger.Print("Не удалось получить список подходящих пород")
		return c.SendStatus(fiber.StatusBadGateway)
	}
	return c.JSON(breeds)
}

func RegisterPet(c *fiber.Ctx) error {
	user := c.Locals("user").(models.UserResponse)

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

	age, _ := strconv.Atoi(c.FormValue("age"))
	breed, _ := strconv.Atoi(c.FormValue("breed"))

	pet := models.Pet{
		TypePet: c.FormValue("petType") == "true",
		Name:    c.FormValue("name"),
		Age:     uint(age),
		Sex:     c.FormValue("sex") == "true",
		BreedID: uint(breed),
		Mating:  c.FormValue("goal") == "true",
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
		pet.Name,
		pet.Sex,
		pet.TypePet,
		pet.Breed,
		pet.Mating,
		pet.Age,
	)

	return c.SendStatus(fiber.StatusOK)
}

func GetMe(c *fiber.Ctx) error {
	user := c.Locals("user").(models.UserResponse)

	var userPet models.Pet

	if err := database.DB.Preload("Breed").Preload("Images", func(db *gorm.DB) *gorm.DB {
		return db.Order("id")
	}).Preload("Awards").
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

func GetProfilePetById(c *fiber.Ctx) error {
	param, err := c.ParamsInt("id")
	InfoLogger.Print(param)

	if err != nil {
		ErrLogger.Print("Не удалось получить параметр", err)
		return err
	}
	var pet models.Pet

	database.DB.Preload(clause.Associations).First(&pet, param)
	if pet.ID == 0 {
		return c.SendStatus(fiber.StatusNotFound)
	}

	return c.JSON(pet)
}

//TODO:При добавлении фоток нужно жестко привязать к фоткам id, чтобы возможно было их удалить в случае чего
//TODO:Добавить возможность изменить первую фотку
func UpdateUserInfo(c *fiber.Ctx) error {
	user := c.Locals("user").(models.UserResponse)

	var payload models.ProfileInfoUpdateRequest

	if err := c.BodyParser(&payload); err != nil {
		ErrLogger.Printf("Не спарсил данные! %s", err)
		return err
	}

	photoPaths := make([]string, 0)

	for i := 0; i < 5; i++ {
		img, err := c.FormFile(fmt.Sprintf("photo%d", i))
		if err != nil {
			break
		}

		photoPath := utils.MakeImagePath(user.ID, img.Filename)
		InfoLogger.Print(photoPath)
		if err = c.SaveFile(img, os.Getenv("IMAGES_PATH")+photoPath); err != nil {
			ErrLogger.Printf("Failed to save image %s on server: %v", photoPath, err)
			return err
		}
		photoPaths = append(photoPaths, photoPath)
		InfoLogger.Printf("Saved image %v on server", photoPath)
	}

	awards := make([]models.Award, 0)
	for _, award := range strings.Split(payload.Awards, ",") {
		awards = append(awards, models.Award{AwardName: award})
	}

	var pet models.Pet

	//*Обновление информации о питомце в бд
	if err := database.DB.Model(models.Pet{}).Where(models.Pet{UserID: user.ID}).Updates(map[string]interface{}{
		"about_me_info": payload.AboutMeInfo,
		"mating":        payload.Goal,
		"pedigree":      payload.Pedigree,
	}).First(&pet).Error; err != nil {
		ErrLogger.Printf("Failed to update information in DB: %v", err)
		return err
	}

	InfoLogger.Printf("Информация питомца id=%d [AboutMeInfo,Goal,Pedigree] обновлена", pet.ID)

	//*Удаление изображений, если таковы имеются в списке
	//Сделано наполовину
	deletedImgs := strings.Split(c.FormValue("deletedPhotos"), ",")
	if len(deletedImgs) > 0 {
		for _, imgID := range deletedImgs {
			var deletedImg models.Image
			database.DB.Unscoped().
				Where("pet_id = ? AND path LIKE ?", pet.ID, "%/"+imgID+".%").First(&deletedImg).Delete(&models.Image{})
			if err := utils.DeleteImage(deletedImg.Path); err != nil {
				ErrLogger.Printf("Не удалось удалить фото %s: \n%v", deletedImg.Path, err)
			}
		}
	}

	//*Добавления наград в бд
	//Model(&pet) -> Туда передаем объект владельца, который будем изменять(дополнять/удалять)
	//Association("Awards") -> устанавливаем связь с моделью Award
	//Find(&temp, ...) -> Кладем в temp значение, если найдено
	//SELECT * FROM awards WHERE award_name = ... AND pet_id = ... (pet_id берется из Model(&pet))
	for _, award := range awards {
		var temp models.Award
		database.DB.Model(&pet).Association("Awards").Find(&temp, "award_name = ?", award.AwardName)
		if temp.ID == 0 {
			database.DB.Model(&pet).Association("Awards").Append(&award)
		}
	}
	InfoLogger.Printf("Информация питомца id=%d [Awards] обновлена", pet.ID)

	//*Добавления фото в бд
	if len(photoPaths) != 0 {
		for _, path := range photoPaths {
			database.DB.Model(models.Image{}).Where("pet_id = ?", pet.ID).Create(&models.Image{PetID: pet.ID, Path: path})
		}
		InfoLogger.Printf("Информация питомца id=%d [Photos] обновлена", pet.ID)
	}

	return c.JSON(payload)
}

func UpdateProfilePhoto(c *fiber.Ctx) error {
	userID := c.Locals("user").(models.UserResponse).ID
	photo, err := c.FormFile("photo")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "failed",
			"message": "Отправьте фото",
		})
	}
	var pet models.Pet
	database.DB.Preload("Images", func(db *gorm.DB) *gorm.DB {
		return db.Order("id")
	}).First(&pet, "user_id = ?", userID)
	imagePath := pet.Images[0].Path
	utils.DeleteImage(imagePath)

	before, _, _ := strings.Cut(imagePath, ".")
	timestamp := fmt.Sprintf("?%d", time.Now().Unix())
	newPath := before + "." + strings.Split(photo.Filename, ".")[1]

	InfoLogger.Printf("Сгенерирован путь - %s", newPath)

	if err = c.SaveFile(photo, os.Getenv("IMAGES_PATH")+newPath); err != nil {
		ErrLogger.Printf("Failed to change image %s on server: %v", imagePath, err)
		return c.SendStatus(500)
	}
	InfoLogger.Printf("Saved image %v on server", imagePath)

	database.DB.Model(&models.Image{}).Where("pet_id = ? and path LIKE ?", pet.ID, "%/1.%").Update("path", newPath+timestamp)

	return c.SendStatus(200)
}

//*Получение питомцев для карточек
//Из юзера достаем информацию о нашем питомце, а именно тип питомца и цель
func GetSuitablePets(c *fiber.Ctx) error {
	//достаем из middleware данные о пользователе
	user := c.Locals("user").(models.UserResponse)
	var pet models.Pet
	//Кладем питомца пользователя в переменную
	if err := database.DB.Preload("LikedPets").Preload("DislikedPets").Where("user_id = ?", user.ID).First(&pet).Error; err != nil {
		ErrLogger.Printf("Failed to get user [%v] pet from DB: %v", user.ID, err)
		return err
	}
	//Кладем подходящих питомцев в переменную
	var suitablePets []models.Pet

	if err := database.DB.Preload(clause.Associations).Where(
		"type_pet = ? AND mating = ? AND user_id != ?",
		pet.TypePet,
		pet.Mating,
		user.ID,
	).Find(&suitablePets).Error; err != nil {
		ErrLogger.Printf("Failed to get suitable pets from DB: %v", err)
		return err
	}

	likedDislikedPets := make([]*models.Pet, 0)
	likedDislikedPets = append(likedDislikedPets, pet.LikedPets...)
	likedDislikedPets = append(likedDislikedPets, pet.DislikedPets...)

	result := utils.Filter[models.Pet](suitablePets, func(p models.Pet) bool {
		for _, el := range likedDislikedPets {
			if p.ID == el.ID {
				return true
			}
		}
		return false
	})

	return c.JSON(result)
}

//*Лайк питомца. (LikedPetId) -> match or notMatch
func LikePet(c *fiber.Ctx) error {
	userID := c.Locals("user").(models.UserResponse).ID
	var userPet models.Pet
	database.DB.Preload("Images").Where("user_id = ?", userID).First(&userPet)

	var likedPet models.Pet
	if err := c.BodyParser(&likedPet); err != nil {
		ErrLogger.Printf("Не спарсил данные! %s", err)
		return err
	}

	//Удалить питомца с DislikedPets
	database.DB.Unscoped().Model(&userPet).Association("DislikedPets").Delete(&likedPet)
	//Создать питомца в LikedPets
	database.DB.Model(&userPet).Association("LikedPets").Append(&likedPet)

	InfoLogger.Printf("Питомец [%v] лайкнул питомца [%v]", userPet.ID, likedPet.ID)

	var count int64
	database.DB.Debug().Unscoped().Table("pairs").Where("pet_id = ? AND pair_id = ?", userPet.ID, likedPet.ID).
		Or("pet_id = ? AND pair_id = ?", likedPet.ID, userPet.ID).Count(&count)

	if count > 0 {
		database.DB.Preload("Images").First(&likedPet, likedPet.ID)

		var user models.User
		database.DB.Find(&user, userID)

		return c.JSON(models.MatchResponse{
			IsMatch:  true,
			UserPet:  userPet,
			LikedPet: likedPet,
			Contact:  user.Contact,
		})
	}

	return c.JSON(models.MatchResponse{
		IsMatch: false,
	})
}

func DislikePet(c *fiber.Ctx) error {
	userID := c.Locals("user").(models.UserResponse).ID
	var userPet models.Pet
	database.DB.Where("user_id = ?", userID).First(&userPet)

	var dislikedPet models.DislikedPet
	if err := c.BodyParser(&dislikedPet); err != nil {
		ErrLogger.Printf("Не спарсил данные! %s", err)
		return err
	}
	dislikedPet.PetID = userPet.ID

	//Проверка сущетствует ли запись в DislikedPets
	//? Заметка: В метод Append класть нужно СТРОГО модель из Ассоциации, которую задали в структуре
	//? В данном случае DislikedPets в моделе прописана *[]Pet - значит нужна модель Pet,
	//? и ничто другое
	database.DB.Debug().Where("disliked_pet_id = ?", dislikedPet.DislikedPetID).Assign(models.DislikedPet{
		Confirmed: dislikedPet.Confirmed,
	}).FirstOrCreate(&dislikedPet)

	return c.JSON(dislikedPet)
}

func GetLikeAndLikedPetsAndPairs(c *fiber.Ctx) error {
	userID := c.Locals("user").(models.UserResponse).ID

	var pet models.Pet
	database.DB.
		Preload("LikedPets.Images").
		Preload("Pairs.Images").
		Preload(clause.Associations).
		Where("user_id = ?", userID).First(&pet)

	//Питомцы, которым понравился питомец пользователя
	var petslikedUserPet []models.Pet
	likedPetIDs := make([]uint, 1)
	for _, likedPet := range pet.LikedPets {
		likedPetIDs = append(likedPetIDs, likedPet.ID)
	}
	database.DB.Preload("Images").Preload("LikedPets").Preload("DislikedPets").
		Where(
			"id IN (SELECT pet_id FROM liked_pets WHERE liked_pet_id = ? AND pet_id NOT IN (?) AND id NOT IN (SELECT disliked_pet_id from disliked_pets WHERE confirmed is true))",
			pet.ID,
			likedPetIDs,
		).
		Find(&petslikedUserPet)
	/*
		? Болле строгий вариант поиска внутри m2m таблицы
		? database.DB.Where("id IN (?)", DB.Table("liked_pets").Select("pet_id").Where("liked_pet_id =?", pet.ID)).Find(&pets)
		https://stackoverflow.com/questions/63475885/how-to-query-a-many2many-relationship-with-a-where-clause-on-the-association-wit/73797763#73797763
		Отсюда взял варианты
	*/

	//Питомцы-пары пользователя
	type pairUserPet struct {
		UserContact  string `json:"contact"`
		PetID        uint   `json:"petID"`
		PetName      string `json:"petName"`
		PetImagePath string `json:"petImagePath"`
	}
	var petsUsers []pairUserPet

	database.DB.Debug().Model(&models.User{}).Select(
		"users.contact as user_contact, pets.id as pet_id, pets.name as pet_name, images.path as pet_image_path",
	).
		Joins("JOIN pets ON pets.user_id = users.id").
		Joins("JOIN images ON pets.id = images.pet_id AND images.path LIKE ?", "%/1.%").
		Where("pets.id IN (SELECT pair_id from pairs WHERE pet_id = (?) OR pair_id = (?))", pet.ID, pet.ID).Scan(&petsUsers)

	InfoLogger.Print(petsUsers)

	return c.JSON(fiber.Map{
		"likedPets":        pet.LikedPets,
		"petsLikedUserPet": petslikedUserPet,
		"pairPets":         petsUsers,
	})
}
