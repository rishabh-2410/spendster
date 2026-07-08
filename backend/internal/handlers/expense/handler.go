package handlers

import (
	"encoding/json"
	requestcontext "expense-backend/internal/context"
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
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	err = validation.Validate.Struct(request)
	if err != nil {
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	userID, ok := requestcontext.GetUserID(r.Context())
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	expense, err := eh.expenseService.AddExpense(userID, request)
	if err != nil {
		http.Error(w, "Failed to add expense", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)

	json.NewEncoder(w).Encode(expense)

}
