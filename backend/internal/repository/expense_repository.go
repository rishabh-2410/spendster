package repository

import (
	"database/sql"
	"errors"
	dbmodels "expense-backend/internal/models/db_object"
	reqmodels "expense-backend/internal/models/req_dto"
	"log"
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

func (er *Expense) UpdateExpense(docID string, userID string, updateDetails *reqmodels.EditExpenseRequestDTO) (*dbmodels.Expense, error) {
	updatedExpense := &dbmodels.Expense{}
	log.Printf("Updated expense db object: %v", updatedExpense)

	err := er.db.QueryRow(`
		UPDATE expenses
		SET 
    		amount=COALESCE($1, amount),
    		category=COALESCE($2, category)
		WHERE id=$3 AND user_id=$4
		RETURNING id, user_id, title, amount, date_of_expense, category, created_at, updated_at		
	`, updateDetails.Amount, updateDetails.Category, docID, userID).Scan(
		&updatedExpense.ID,
		&updatedExpense.UserID,
		&updatedExpense.Title,
		&updatedExpense.Amount,
		&updatedExpense.DateOfExpense,
		&updatedExpense.Category,
		&updatedExpense.CreatedAt,
		&updatedExpense.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return updatedExpense, nil
}

func (er *Expense) DeleteExpense(docID string, userID string) error {
	result, err := er.db.Exec(
		`
		DELETE FROM expenses
		WHERE id=$1 AND user_id=$2
		`, docID, userID)

	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("expense already deleted or not found")
	}

	return nil
}

func (er *Expense) FetchExpenses(userID string) ([]dbmodels.Expense, error) {
	expenses := make([]dbmodels.Expense, 0)

	rows, err := er.db.Query(`
		SELECT 
			id,
			user_id,
			title,
			amount,
			date_of_expense,
			category,
			created_at,
			updated_at
		FROM expenses
		WHERE user_id=$1
		ORDER BY date_of_expense DESC, created_at DESC
	`, userID)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var expense dbmodels.Expense

		err := rows.Scan(
			&expense.ID,
			&expense.UserID,
			&expense.Title,
			&expense.Amount,
			&expense.DateOfExpense,
			&expense.Category,
			&expense.CreatedAt,
			&expense.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

		expenses = append(expenses, expense)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return expenses, nil

}
