package models

import "gorm.io/gorm"

//db models
type User struct {
	gorm.Model
	Name     string
	Login    string `gorm:"unique" json:"login"`
	Password []byte `json:"-"`
	Pets     []Pet  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type Pet struct {
	gorm.Model
	TypePet     bool    `gorm:"not null" json:"typePet"`
	Name        string  `gorm:"not null" json:"name"`
	Age         uint    `gorm:"not null" json:"age"`
	BreedID     uint    `gorm:"not null" json:"-"`
	Breed       Breed   `json:"breed"`
	Sex         bool    `gorm:"not null" json:"sex"`
	Mating      bool    `gorm:"not null" json:"isMating"`
	AboutMeInfo string  `json:"aboutMeInfo"`
	Pedigree    bool    `json:"pedigree" gorm:"default:false"`
	Awards      []Award `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"awards"`
	UserID      uint    `json:"userID"`
	Images      []Image `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"photos"`
}

type Image struct {
	ID    uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	PetID uint   `gorm:"not null" json:"-"`
	Path  string `json:"path"`
}

type Award struct {
	ID        uint   `gorm:"primaryKey" json:"-"`
	PetID     uint   `gorm:"not null" json:"-"`
	AwardName string `json:"name"`
}

type Breed struct {
	ID        uint
	IsDog     bool   `gorm:"default:true"`
	BreedName string `json:"name"`
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

type ProfileInfoUpdateRequest struct {
	AboutMeInfo string `json:"aboutMeInfo"`
	Goal        bool   `json:"goal"`
	Pedigree    bool   `json:"pedigree"`
	Awards      string `json:"awards"`
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
