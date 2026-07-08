package repository

import (
	"database/sql"
	dbmodels "expense-backend/internal/models/db_object"
)

type Dashboard struct {
	db *sql.DB
}

func NewDashboardRepository(db *sql.DB) *Dashboard {
	return &Dashboard{
		db: db,
	}
}

func (d *Dashboard) GetStats(userID string) (*dbmodels.ExpenseStats, error) {
	stats := &dbmodels.ExpenseStats{}

	err := d.db.QueryRow(
		`
SELECT
    COALESCE(
        SUM(
            CASE
                WHEN date_of_expense = CURRENT_DATE
                THEN amount
                ELSE 0
            END
        ),
        0
    ) AS today_spent,

    COALESCE(
        SUM(
            CASE
                WHEN DATE_TRUNC('month', date_of_expense) = DATE_TRUNC('month', CURRENT_DATE)
                THEN amount
                ELSE 0
            END
        ),
        0
    ) AS month_spent,

    COUNT(*) AS total_expenses

FROM expenses
WHERE user_id=$1
`, userID).Scan(
		&stats.TodaySpent,
		&stats.MonthSpent,
		&stats.TotalExpense,
	)

	if err != nil {
		return nil, err
	}
	return stats, nil
}
