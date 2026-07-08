package models

import "time"

type Expense struct {
	ID            string
	UserID        string
	Title         string
	Amount        float64
	Category      string
	DateOfExpense time.Time
	CreatedAt     time.Time
	UpdatedAt     time.Time
}
