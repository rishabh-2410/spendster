package services

import (
	dbmodels "expense-backend/internal/models/db_object"
	reqmodels "expense-backend/internal/models/req_dto"
	resmodels "expense-backend/internal/models/res_dto"
	"expense-backend/internal/repository"
)

type Service struct {
	ExpenseRepo *repository.Expense
	UserRepo    *repository.User
}

func New(userRepo *repository.User, expenseRepo *repository.Expense) *Service {
	return &Service{
		UserRepo:    userRepo,
		ExpenseRepo: expenseRepo,
	}
}

func (es *Service) AddExpense(userID string, req *reqmodels.AddExpenseRequestDTO) (*resmodels.AddExpenseResponseDTO, error) {
	expense := &dbmodels.Expense{
		UserID:        userID,
		Title:         req.Title,
		Amount:        req.Amount,
		Category:      req.Category,
		DateOfExpense: req.ExpenseDate,
	}

	newExpense, err := es.ExpenseRepo.SaveExpense(expense)
	if err != nil {
		return nil, err
	}

	response := &resmodels.AddExpenseResponseDTO{
		ID:            newExpense.ID,
		Title:         newExpense.Title,
		Amount:        newExpense.Amount,
		Category:      newExpense.Category,
		DateOfExpense: newExpense.DateOfExpense,
		CreatedAt:     newExpense.CreatedAt,
		UpdatedAt:     newExpense.UpdatedAt,
	}

	return response, nil

}
