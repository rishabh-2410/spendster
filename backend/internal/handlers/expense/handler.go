package handlers

import (
	"encoding/json"
	requestcontext "expense-backend/internal/context"
	reqmodels "expense-backend/internal/models/req_dto"
	expense "expense-backend/internal/services/expense"
	"expense-backend/internal/validation"
	"log"
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

func (eh *Handler) HandleEditExpense(w http.ResponseWriter, r *http.Request) {
	var request reqmodels.EditExpenseRequestDTO

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	err := decoder.Decode(&request)
	if err != nil {
		log.Printf("VALIDATION ERROR: %+v\n", err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	err = validation.Validate.Struct(request)
	if err != nil {
		log.Printf("VALIDATION ERROR: %+v\n", err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	docID := r.PathValue("id")
	if docID == "" {
		http.Error(w, "Expense ID is required", http.StatusBadRequest)
	}

	userID, ok := requestcontext.GetUserID(r.Context())
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	response, err := eh.expenseService.EditExpense(userID, docID, &request)
	if err != nil {
		log.Printf("Error updating expense: %v", err)
		http.Error(w, "Unable to update expense", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(response)
}

func (eh *Handler) HandleDeleteExpense(w http.ResponseWriter, r *http.Request) {
	docID := r.PathValue("id")
	if docID == "" {
		http.Error(w, "expense id is required", http.StatusBadRequest)
		return
	}

	userID, ok := requestcontext.GetUserID(r.Context())
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	err := eh.expenseService.DeleteExpense(userID, docID)
	if err != nil {
		http.Error(w, "Unable to delete expense", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (eh *Handler) HandleDashboardStats(w http.ResponseWriter, r *http.Request) {
	userID, ok := requestcontext.GetUserID(r.Context())
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	stats, err := eh.expenseService.GetUserStats(userID)
	if err != nil {
		log.Printf("error fetching user stats: %v", err)
		http.Error(w, "Unable to process request", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(stats)
}
