package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name     string
	Login    string `gorm:"unique"`
	Password []byte
	Pets     []Pet `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type Pet struct {
	gorm.Model
	TypePet bool
	Name    string
	Age     uint
	BreedID uint
	Breed   Breed
	Sex     bool
	Mating  bool
	UserID  uint
}

type Breed struct {
	ID        uint
	BreedName string
}
