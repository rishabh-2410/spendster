package repository

import (
	"database/sql"
	"expense-backend/internal/logging"
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
	logging.Debug("dashboard repository get stats user_id=%s", userID)
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
		logging.Error("dashboard repository get stats failed user_id=%s err=%v", userID, err)
		return nil, err
	}

	logging.Info("dashboard repository get stats success user_id=%s total_expenses=%d", userID, stats.TotalExpense)
	return stats, nil
}
