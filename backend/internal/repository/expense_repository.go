package repository

import (
	"database/sql"
	dbmodels "expense-backend/internal/models/db_object"
)

type Expense struct {
	db *sql.DB
}

func NewExpenseRepository(db *sql.DB) *Expense {
	return &Expense{
		db: db,
	}
}

func (er *Expense) SaveExpense(expense *dbmodels.Expense) (*dbmodels.Expense, error) {
	newExpense := &dbmodels.Expense{}

	err := er.db.QueryRow(`
	INSERT INTO expenses(
    	user_id,
    	title,
    	amount,
    	date_of_expense,
    	category
  ) VALUES (
   		$1,
    	$2,
    	$3,
   		$4,
    	$5
  )
	RETURNING
	id,
	user_id,
	title,
	amount,
	date_of_expense,
	category,
	created_at,
	updated_at
		
  `,
		expense.UserID,
		expense.Title,
		expense.Amount,
		expense.DateOfExpense,
		expense.Category,
	).Scan(
		&newExpense.ID,
		&newExpense.UserID,
		&newExpense.Title,
		&newExpense.Amount,
		&newExpense.DateOfExpense,
		&newExpense.Category,
		&newExpense.CreatedAt,
		&newExpense.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return newExpense, nil

}
