package repository

import (
	"database/sql"
	"errors"
	"expense-backend/internal/logging"
	dbmodels "expense-backend/internal/models/db_object"
	reqmodels "expense-backend/internal/models/req_dto"
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
	logging.Debug("expense repository save expense user_id=%s title=%s amount=%.2f category=%s", expense.UserID, expense.Title, expense.Amount, expense.Category)
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
		logging.Error("expense repository save expense failed user_id=%s title=%s err=%v", expense.UserID, expense.Title, err)
		return nil, err
	}

	logging.Info("expense repository save expense success user_id=%s expense_id=%s", expense.UserID, newExpense.ID)

	return newExpense, nil

}

func (er *Expense) UpdateExpense(docID string, userID string, updateDetails *reqmodels.EditExpenseRequestDTO) (*dbmodels.Expense, error) {
	updatedExpense := &dbmodels.Expense{}
	logging.Debug("expense repository update expense user_id=%s expense_id=%s amount=%v category=%v", userID, docID, updateDetails.Amount, updateDetails.Category)

	err := er.db.QueryRow(`
		UPDATE expenses
		SET 
    		amount=COALESCE($1, amount),
    		category=COALESCE($2, category)
			updated_at=NOW()
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
		logging.Error("expense repository update expense failed user_id=%s expense_id=%s err=%v", userID, docID, err)
		return nil, err
	}

	logging.Info("expense repository update expense success user_id=%s expense_id=%s", userID, updatedExpense.ID)

	return updatedExpense, nil
}

func (er *Expense) DeleteExpense(docID string, userID string) error {
	logging.Debug("expense repository delete expense user_id=%s expense_id=%s", userID, docID)
	result, err := er.db.Exec(
		`
		DELETE FROM expenses
		WHERE id=$1 AND user_id=$2
		`, docID, userID)

	if err != nil {
		logging.Error("expense repository delete expense failed user_id=%s expense_id=%s err=%v", userID, docID, err)
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		logging.Error("expense repository delete expense rows failed user_id=%s expense_id=%s err=%v", userID, docID, err)
		return err
	}

	if rowsAffected == 0 {
		logging.Error("expense repository delete expense no rows affected user_id=%s expense_id=%s", userID, docID)
		return errors.New("expense already deleted or not found")
	}

	logging.Info("expense repository delete expense success user_id=%s expense_id=%s", userID, docID)

	return nil
}

func (er *Expense) FetchExpenses(userID string) ([]dbmodels.Expense, error) {
	logging.Debug("expense repository fetch expenses user_id=%s", userID)
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
		logging.Error("expense repository fetch expenses query failed user_id=%s err=%v", userID, err)
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
			logging.Error("expense repository fetch expenses scan failed user_id=%s err=%v", userID, err)
			return nil, err
		}

		expenses = append(expenses, expense)
	}

	if err := rows.Err(); err != nil {
		logging.Error("expense repository fetch expenses rows failed user_id=%s err=%v", userID, err)
		return nil, err
	}

	logging.Info("expense repository fetch expenses success user_id=%s count=%d", userID, len(expenses))

	return expenses, nil

}
