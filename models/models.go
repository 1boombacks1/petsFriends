package models

import "gorm.io/gorm"

//db models
type User struct {
	gorm.Model
	Name     string
	Login    string `gorm:"unique"`
	Password []byte
	Pets     []Pet `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type Pet struct {
	gorm.Model
	TypePet     bool   `gorm:"not null"`
	Name        string `gorm:"not null"`
	Age         uint   `gorm:"not null"`
	BreedID     uint   `gorm:"not null"`
	Breed       Breed
	Sex         bool `gorm:"not null"`
	Mating      bool `gorm:"not null"`
	AboutMeInfo string
	Pedigree    bool
	Awards      []Award `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	UserID      uint
	Images      []Image `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type Image struct {
	ID    uint `gorm:"primaryKey"`
	PetID uint `gorm:"not null"`
	Path  string
}

type Award struct {
	ID        uint `gorm:"primaryKey"`
	PetID     uint `gorm:"not null"`
	AwardName string
}

type Breed struct {
	ID        uint
	BreedName string
}

//requests
type RegisterRequest struct {
	TypePet   bool   `json:"petType"`
	Name      string `json:"name"`
	Age       int    `json:"age"`
	Sex       bool   `json:"sex"`
	Breed     int    `json:"breed"`
	IsMeeting bool   `json:"goal"`
}

//responses
type UserResponse struct {
	ID    uint   `json:"id,omitempty"`
	Login string `json:"login,omitempty"`
}

type PetResponse struct {
	Name        string   `json:"name,omitempty"`
	Sex         bool     `json:"sex,omitempty"`
	Breed       string   `json:"breed,omitempty"`
	Age         uint     `json:"age,omitempty"`
	AboutMeInfo string   `json:"aboutMeInfo,omitempty"`
	Photos      []string `json:"photos,omitempty"`
	Goal        bool     `json:"goal,omitempty"`
	Pedigree    bool     `json:"pedigree,omitempty"`
	Awards      []string `json:"awards,omitempty"`
}

func FilterUserResponse(user *User) UserResponse {
	return UserResponse{
		ID:    user.ID,
		Login: user.Login,
	}
}
