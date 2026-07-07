package models

import "time"

type LoginUserResponseDTO struct {
	ID          string
	Name        string
	Email       string
	CreatedAt   time.Time
	AccessToken string
}
