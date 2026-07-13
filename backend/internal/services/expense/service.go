package services

import (
	"expense-backend/internal/logging"
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
	logging.Debug("add expense service start user_id=%s title=%s amount=%.2f category=%s", userID, req.Title, req.Amount, req.Category)
	expense := &dbmodels.Expense{
		UserID:        userID,
		Title:         req.Title,
		Amount:        req.Amount,
		Category:      req.Category,
		DateOfExpense: req.DateOfExpense,
	}

	newExpense, err := es.ExpenseRepo.SaveExpense(expense)
	if err != nil {
		logging.Error("add expense service failed user_id=%s title=%s err=%v", userID, req.Title, err)
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

	logging.Info("add expense service success user_id=%s expense_id=%s", userID, response.ID)

	return response, nil

}

func (es *Service) EditExpense(userID string, docID string, req *reqmodels.EditExpenseRequestDTO) (*resmodels.ExpenseResponseDTO, error) {
	logging.Debug("edit expense service start user_id=%s expense_id=%s amount=%v category=%v", userID, docID, req.Amount, req.Category)
	updatedExpense, err := es.ExpenseRepo.UpdateExpense(docID, userID, req)
	if err != nil {
		logging.Error("edit expense service failed user_id=%s expense_id=%s err=%v", userID, docID, err)
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

	logging.Info("edit expense service success user_id=%s expense_id=%s", userID, response.ID)

	return response, nil
}

func (es *Service) DeleteExpense(userID string, docID string) error {
	logging.Debug("delete expense service start user_id=%s expense_id=%s", userID, docID)
	err := es.ExpenseRepo.DeleteExpense(docID, userID)
	if err != nil {
		logging.Error("delete expense service failed user_id=%s expense_id=%s err=%v", userID, docID, err)
		return err
	}

	logging.Info("delete expense service success user_id=%s expense_id=%s", userID, docID)

	return nil
}

func (es *Service) GetUserStats(userID string) (*resmodels.StatsResponseDTO, error) {
	logging.Debug("get user stats service start user_id=%s", userID)
	dashboardStats, err := es.DashboardRepo.GetStats(userID)
	if err != nil {
		logging.Error("get user stats service failed user_id=%s err=%v", userID, err)
		return nil, err
	}

	stats := &resmodels.StatsResponseDTO{
		TodaySpent:    dashboardStats.TodaySpent,
		MonthlySpent:  dashboardStats.MonthSpent,
		TotalExpenses: dashboardStats.TotalExpense,
	}

	logging.Info("get user stats service success user_id=%s total_expenses=%d", userID, stats.TotalExpenses)

	return stats, nil
}

func (es *Service) GetExpenses(userID string) ([]resmodels.ExpenseResponseDTO, error) {
	logging.Debug("get expenses service start user_id=%s", userID)
	expenses, err := es.ExpenseRepo.FetchExpenses(userID)
	if err != nil {
		logging.Error("get expenses service failed user_id=%s err=%v", userID, err)
		return nil, err
	}

	response := make([]resmodels.ExpenseResponseDTO, 0, len(expenses))

	for _, expense := range expenses {
		transformedExpense := resmodels.ExpenseResponseDTO{
			ID:            expense.ID,
			Amount:        expense.Amount,
			Title:         expense.Title,
			Category:      expense.Category,
			CreatedAt:     expense.CreatedAt,
			DateOfExpense: expense.DateOfExpense,
			UpdatedAt:     expense.UpdatedAt,
		}

		response = append(response, transformedExpense)
	}

	logging.Info("get expenses service success user_id=%s count=%d", userID, len(response))

	return response, nil
}
