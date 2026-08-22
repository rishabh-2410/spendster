package models

type PushTokenRequestDTO struct {
	Token string `json:"token" validate:"required,max=2048"`
}
