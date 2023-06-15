package utils

import (
	"d0c/petsFriends/database"
	. "d0c/petsFriends/logs"
	"d0c/petsFriends/models"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func getProfilePetById(id uint) (*models.Pet, error) {
	var pet models.Pet
	if err := database.DB.Where("id = ?", id).First(&pet).Error; err != nil {
		ErrLogger.Printf("Failed find pet by id in DB: %s\n", err)
		return nil, err
	}

	InfoLogger.Printf("Питомец: %v", pet)
	return nil, nil
}

//входные аргументы: ctx, user_id; выход: path
//выход -> /profile_id/last_file_num.png(jpg)
func MakeImagePath(userId uint, imageName string) string {
	imagesPath := os.Getenv("IMAGES_PATH")
	profileDir := fmt.Sprintf("/%d/", userId)

	folderPath := imagesPath + profileDir
	os.MkdirAll(folderPath, os.ModePerm)

	dir, _ := os.Open(folderPath)
	files, _ := dir.ReadDir(-1)

	countFiles := strconv.Itoa(len(files) + 1)
	typeFile := strings.Split(imageName, ".")[1]

	fullPath := profileDir + countFiles + "." + typeFile
	return fullPath
}

func DeleteImage(pathToImg string) error {
	fullPath := os.Getenv("IMAGES_PATH") + pathToImg
	err := os.Remove(fullPath)
	if err != nil {
		return err
	}
	return nil
}

//355 ане скинул быстро
