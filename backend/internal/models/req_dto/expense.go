package models

import "time"

type AddExpenseRequestDTO struct {
	Title         string    `json:"title" validate:"required"`
	Amount        float64   `json:"amount" validate:"required"`
	Category      string    `json:"category" validate:"required"`
	DateOfExpense time.Time `json:"date_of_expense" validate:"required"`
}

type EditExpenseRequestDTO struct {
	Amount   *float64 `json:"amount" validate:"omitempty,gt=0"`
	Category *string  `json:"category" validate:"gt=3"`
}

type EditExpense struct {
	Amount   float64
	Category string
}
