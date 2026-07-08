package models

import "time"

type ExpenseResponseDTO struct {
	ID            string
	Title         string
	Amount        float64
	Category      string
	DateOfExpense time.Time
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

type StatsResponseDTO struct {
	TodaySpent    float64 `json:"today_spent"`
	MonthlySpent  float64 `json:"monthly_spent"`
	TotalExpenses int64   `json:"total_expenses"`
}
