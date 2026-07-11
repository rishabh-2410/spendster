package models

import "time"

type ExpenseResponseDTO struct {
	ID            string    `json:"id"`
	Title         string    `json:"title"`
	Amount        float64   `json:"amount"`
	Category      string    `json:"category"`
	DateOfExpense time.Time `json:"date_of_expense"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type StatsResponseDTO struct {
	TodaySpent    float64 `json:"today_spent"`
	MonthlySpent  float64 `json:"monthly_spent"`
	TotalExpenses int64   `json:"total_expenses"`
}
