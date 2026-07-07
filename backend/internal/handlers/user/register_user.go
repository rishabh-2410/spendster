package user

import (
	"encoding/json"
	reqmodels "expense-backend/internal/models/req_dto"
	user "expense-backend/internal/services/user"
	"expense-backend/internal/validation"
	"log"
	"net/http"
)

type UserHandler struct {
	userService *user.UserService
}

func NewUserHandler(userService *user.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

func (userHandler *UserHandler) HandleRegisterUser(w http.ResponseWriter,
	r *http.Request) {

	var request reqmodels.RegisterUserRequestDTO

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&request); err != nil {
		http.Error(w, "Invalid Request Body", http.StatusBadRequest)
		return
	}

	err := validation.Validate.Struct(request)
	if err != nil {
		http.Error(w, "Invalid Request Body", http.StatusBadRequest)
		return
	}

	err = userHandler.userService.RegisterUser(&request)
	if err != nil {
		if err.Error() == "Email already exists" {
			http.Error(w, "User is already registered", http.StatusConflict)
		} else {
			log.Printf("error occured during registering user: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		}
		return
	}
	w.WriteHeader(http.StatusOK)
}
