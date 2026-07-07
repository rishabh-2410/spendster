package models

import "time"

type RegisterUserResponseDTO struct {
	ID        string
	Name      string
	Email     string
	CreatedAt time.Time
	UpdatedAt time.Time
}
