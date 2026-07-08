package models

import "time"

type AddExpenseResponseDTO struct {
	ID            string
	Title         string
	Amount        float64
	Category      string
	DateOfExpense time.Time
	CreatedAt     time.Time
	UpdatedAt     time.Time
}
