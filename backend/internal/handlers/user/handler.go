package handlers

import (
	"encoding/json"
	models "expense-backend/internal/models/req_dto"
	reqmodels "expense-backend/internal/models/req_dto"
	user "expense-backend/internal/services/user"
	"expense-backend/internal/validation"
	"log"
	"net/http"
)

type Handler struct {
	userService *user.Service
}

func New(userService *user.Service) *Handler {
	return &Handler{
		userService: userService,
	}
}

func (userHandler *Handler) HandleRegisterUser(w http.ResponseWriter,
	r *http.Request) {

	var request reqmodels.RegisterUserRequestDTO

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&request); err != nil {
		log.Printf("Error in request body %v", err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	err := validation.Validate.Struct(request)
	if err != nil {
		log.Printf("Error in request body %v", err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
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

func (userHandler *Handler) HandleUserLogin(w http.ResponseWriter, r *http.Request) {
	var request reqmodels.LoginUserRequestDTO

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&request); err != nil {
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	err := validation.Validate.Struct(request)
	if err != nil {
		log.Printf("Error in request body %v", err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	loggedUser, err := userHandler.userService.LoginUser(&request)
	if err != nil {
		log.Printf("Error in request body %v", err)
		http.Error(w, "Invalid Credentials", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err = json.NewEncoder(w).Encode(loggedUser); err != nil {
		log.Print("failed to encode login response")
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}

func (userHandler *Handler) HandleUserLogout(w http.ResponseWriter, r *http.Request) {
	var request *models.RefreshTokenRequestDTO

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	err := decoder.Decode(&request)
	if err != nil {
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	if err = validation.Validate.Struct(request); err != nil {
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	err = userHandler.userService.LogoutUser(request.RefreshToken)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}

func (userHandler *Handler) HandleTokenRefresh(w http.ResponseWriter, r *http.Request) {
	var request *models.RefreshTokenRequestDTO

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	err := decoder.Decode(&request)
	if err != nil {
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	if err = validation.Validate.Struct(request); err != nil {
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	response, err := userHandler.userService.RefreshToken(request.RefreshToken)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(response)
}
