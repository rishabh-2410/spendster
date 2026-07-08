package services

import (
	dbmodels "expense-backend/internal/models/db_object"
	reqmodels "expense-backend/internal/models/req_dto"
	resmodels "expense-backend/internal/models/res_dto"
	"expense-backend/internal/repository"
)

type Service struct {
	ExpenseRepo   *repository.Expense
	UserRepo      *repository.User
	DashboardRepo *repository.Dashboard
}

func New(userRepo *repository.User, expenseRepo *repository.Expense, dashboardRepo *repository.Dashboard) *Service {
	return &Service{
		UserRepo:      userRepo,
		ExpenseRepo:   expenseRepo,
		DashboardRepo: dashboardRepo,
	}
}

func (es *Service) AddExpense(userID string, req *reqmodels.AddExpenseRequestDTO) (*resmodels.ExpenseResponseDTO, error) {
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

	response := &resmodels.ExpenseResponseDTO{
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

func (es *Service) EditExpense(userID string, docID string, req *reqmodels.EditExpenseRequestDTO) (*resmodels.ExpenseResponseDTO, error) {
	updatedExpense, err := es.ExpenseRepo.UpdateExpense(docID, userID, req)
	if err != nil {
		return nil, err
	}

	response := &resmodels.ExpenseResponseDTO{
		ID:            updatedExpense.ID,
		Title:         updatedExpense.Title,
		Amount:        updatedExpense.Amount,
		Category:      updatedExpense.Category,
		DateOfExpense: updatedExpense.DateOfExpense,
		CreatedAt:     updatedExpense.CreatedAt,
		UpdatedAt:     updatedExpense.UpdatedAt,
	}

	return response, nil
}

func (es *Service) DeleteExpense(userID string, docID string) error {
	err := es.ExpenseRepo.DeleteExpense(docID, userID)
	if err != nil {
		return err
	}

	return nil
}

func (es *Service) GetUserStats(userID string) (*resmodels.StatsResponseDTO, error) {
	dashboardStats, err := es.DashboardRepo.GetStats(userID)
	if err != nil {
		return nil, err
	}

	stats := &resmodels.StatsResponseDTO{
		TodaySpent:    dashboardStats.TodaySpent,
		MonthlySpent:  dashboardStats.MonthSpent,
		TotalExpenses: dashboardStats.TotalExpense,
	}

	return stats, nil
}
