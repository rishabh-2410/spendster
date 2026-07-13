package handlers

import (
	"encoding/json"
	requestcontext "expense-backend/internal/context"
	"expense-backend/internal/logging"
	reqmodels "expense-backend/internal/models/req_dto"
	expense "expense-backend/internal/services/expense"
	"expense-backend/internal/validation"
	"net/http"
)

type Handler struct {
	expenseService *expense.Service
}

func New(expenseservice *expense.Service) *Handler {
	return &Handler{
		expenseService: expenseservice,
	}
}

func (eh *Handler) HandleAddExpense(w http.ResponseWriter, r *http.Request) {
	var request *reqmodels.AddExpenseRequestDTO

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	err := decoder.Decode(&request)
	if err != nil {
		logging.Error("add expense request decode failed path=%s err=%v", r.URL.Path, err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	logging.Request(r.Method, r.URL.Path, request)

	err = validation.Validate.Struct(request)
	if err != nil {
		logging.Error("add expense request validation failed path=%s err=%v", r.URL.Path, err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	userID, ok := requestcontext.GetUserID(r.Context())
	if !ok {
		logging.Error("add expense unauthorized path=%s", r.URL.Path)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	expense, err := eh.expenseService.AddExpense(userID, request)
	if err != nil {
		logging.Error("add expense failed path=%s user_id=%s err=%v", r.URL.Path, userID, err)
		http.Error(w, "Failed to add expense", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)

	logging.Response(r.Method, r.URL.Path, http.StatusAccepted, expense)

	if err = json.NewEncoder(w).Encode(expense); err != nil {
		logging.Error("add expense response encode failed path=%s user_id=%s err=%v", r.URL.Path, userID, err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

}

func (eh *Handler) HandleEditExpense(w http.ResponseWriter, r *http.Request) {
	var request reqmodels.EditExpenseRequestDTO

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	err := decoder.Decode(&request)
	if err != nil {
		logging.Error("edit expense request decode failed path=%s err=%v", r.URL.Path, err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	logging.Request(r.Method, r.URL.Path, map[string]any{
		"id":       r.PathValue("id"),
		"amount":   request.Amount,
		"category": request.Category,
	})

	err = validation.Validate.Struct(request)
	if err != nil {
		logging.Error("edit expense request validation failed path=%s expense_id=%s err=%v", r.URL.Path, r.PathValue("id"), err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	docID := r.PathValue("id")
	if docID == "" {
		logging.Error("edit expense missing id path=%s", r.URL.Path)
		http.Error(w, "Expense ID is required", http.StatusBadRequest)
	}

	userID, ok := requestcontext.GetUserID(r.Context())
	if !ok {
		logging.Error("edit expense unauthorized path=%s expense_id=%s", r.URL.Path, docID)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	response, err := eh.expenseService.EditExpense(userID, docID, &request)
	if err != nil {
		logging.Error("edit expense failed path=%s user_id=%s expense_id=%s err=%v", r.URL.Path, userID, docID, err)
		http.Error(w, "Unable to update expense", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	logging.Response(r.Method, r.URL.Path, http.StatusOK, response)

	if err = json.NewEncoder(w).Encode(response); err != nil {
		logging.Error("edit expense response encode failed path=%s user_id=%s expense_id=%s err=%v", r.URL.Path, userID, docID, err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}

func (eh *Handler) HandleDeleteExpense(w http.ResponseWriter, r *http.Request) {
	docID := r.PathValue("id")
	logging.Request(r.Method, r.URL.Path, map[string]any{"id": docID})
	if docID == "" {
		logging.Error("delete expense missing id path=%s", r.URL.Path)
		http.Error(w, "expense id is required", http.StatusBadRequest)
		return
	}

	userID, ok := requestcontext.GetUserID(r.Context())
	if !ok {
		logging.Error("delete expense unauthorized path=%s expense_id=%s", r.URL.Path, docID)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	err := eh.expenseService.DeleteExpense(userID, docID)
	if err != nil {
		logging.Error("delete expense failed path=%s user_id=%s expense_id=%s err=%v", r.URL.Path, userID, docID, err)
		http.Error(w, "Unable to delete expense", http.StatusInternalServerError)
		return
	}

	logging.Response(r.Method, r.URL.Path, http.StatusOK, map[string]any{
		"id":      docID,
		"user_id": userID,
	})
	w.WriteHeader(http.StatusOK)
}

func (eh *Handler) HandleDashboardStats(w http.ResponseWriter, r *http.Request) {
	userID, ok := requestcontext.GetUserID(r.Context())
	if !ok {
		logging.Error("dashboard stats unauthorized path=%s", r.URL.Path)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	logging.Request(r.Method, r.URL.Path, map[string]any{"user_id": userID})

	stats, err := eh.expenseService.GetUserStats(userID)
	if err != nil {
		logging.Error("dashboard stats failed path=%s user_id=%s err=%v", r.URL.Path, userID, err)
		http.Error(w, "Unable to process request", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	logging.Response(r.Method, r.URL.Path, http.StatusOK, stats)

	if err = json.NewEncoder(w).Encode(stats); err != nil {
		logging.Error("dashboard stats response encode failed path=%s user_id=%s err=%v", r.URL.Path, userID, err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}

func (eh *Handler) HandleGetExpenses(w http.ResponseWriter, r *http.Request) {
	userID, ok := requestcontext.GetUserID(r.Context())
	if !ok {
		logging.Error("get expenses unauthorized path=%s", r.URL.Path)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	logging.Request(r.Method, r.URL.Path, map[string]any{"user_id": userID})

	expenses, err := eh.expenseService.GetExpenses(userID)
	if err != nil {
		logging.Error("get expenses failed path=%s user_id=%s err=%v", r.URL.Path, userID, err)
		http.Error(w, "Unable to fetch expenses", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	logging.Response(r.Method, r.URL.Path, http.StatusOK, map[string]any{
		"user_id": userID,
		"count":   len(expenses),
	})

	if err = json.NewEncoder(w).Encode(expenses); err != nil {
		logging.Error("get expenses response encode failed path=%s user_id=%s err=%v", r.URL.Path, userID, err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}
