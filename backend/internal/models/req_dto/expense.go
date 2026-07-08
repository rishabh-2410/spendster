package models

import "time"

type AddExpenseRequestDTO struct {
	Title       string    `json:"title" validation:"required"`
	Amount      float64   `json:"amount" validation:"required"`
	Category    string    `json:"category" validation:"required"`
	ExpenseDate time.Time `json:"expense_date" validation:"required"`
}
