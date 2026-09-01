package handlers

import (
	"encoding/json"
	requestcontext "expense-backend/internal/context"
	"expense-backend/internal/logging"
	models "expense-backend/internal/models/req_dto"
	reqmodels "expense-backend/internal/models/req_dto"
	user "expense-backend/internal/services/user"
	"expense-backend/internal/validation"
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

func (userHandler *Handler) HandleRegisterUser(w http.ResponseWriter, r *http.Request) {

	var request reqmodels.RegisterUserRequestDTO

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&request); err != nil {
		logging.Error("register request decode failed path=%s err=%v", r.URL.Path, err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	logging.Request(r.Method, r.URL.Path, map[string]any{
		"name":     request.Name,
		"email":    request.Email,
		"password": logging.Redacted("password"),
	})

	err := validation.Validate.Struct(request)
	if err != nil {
		logging.Error("register request validation failed path=%s email=%s err=%v", r.URL.Path, request.Email, err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	err = userHandler.userService.RegisterUser(&request)
	if err != nil {
		if err.Error() == "Email already exists" {
			logging.Error("register request conflict path=%s email=%s err=%v", r.URL.Path, request.Email, err)
			http.Error(w, "User is already registered", http.StatusConflict)
		} else {
			logging.Error("register request failed path=%s email=%s err=%v", r.URL.Path, request.Email, err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		}
		return
	}

	logging.Response(r.Method, r.URL.Path, http.StatusOK, map[string]any{
		"email": request.Email,
		"name":  request.Name,
	})
	w.WriteHeader(http.StatusOK)
}

func (userHandler *Handler) HandleUserLogin(w http.ResponseWriter, r *http.Request) {
	var request reqmodels.LoginUserRequestDTO

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&request); err != nil {
		logging.Error("login request decode failed path=%s err=%v", r.URL.Path, err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	logging.Request(r.Method, r.URL.Path, map[string]any{
		"email":    request.Email,
		"password": logging.Redacted("password"),
	})

	err := validation.Validate.Struct(request)
	if err != nil {
		logging.Error("login request validation failed path=%s email=%s err=%v", r.URL.Path, request.Email, err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	loggedUser, err := userHandler.userService.LoginUser(&request)
	if err != nil {
		logging.Error("login request failed path=%s email=%s err=%v", r.URL.Path, request.Email, err)
		http.Error(w, "Invalid Credentials", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	logging.Response(r.Method, r.URL.Path, http.StatusOK, map[string]any{
		"id":         loggedUser.ID,
		"name":       loggedUser.Name,
		"email":      loggedUser.Email,
		"created_at": loggedUser.CreatedAt,
	})

	if err = json.NewEncoder(w).Encode(loggedUser); err != nil {
		logging.Error("login response encode failed path=%s email=%s err=%v", r.URL.Path, request.Email, err)
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
		logging.Error("logout request decode failed path=%s err=%v", r.URL.Path, err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	logging.Request(r.Method, r.URL.Path, map[string]any{
		"refresh_token": logging.Redacted("refresh_token"),
	})

	if err = validation.Validate.Struct(request); err != nil {
		logging.Error("logout request validation failed path=%s err=%v", r.URL.Path, err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	err = userHandler.userService.LogoutUser(request.RefreshToken)
	if err != nil {
		logging.Error("logout request failed path=%s err=%v", r.URL.Path, err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	logging.Response(r.Method, r.URL.Path, http.StatusOK, nil)
	w.WriteHeader(http.StatusOK)
}

func (userHandler *Handler) HandleTokenRefresh(w http.ResponseWriter, r *http.Request) {
	var request *models.RefreshTokenRequestDTO

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	err := decoder.Decode(&request)
	if err != nil {
		logging.Error("refresh request decode failed path=%s err=%v", r.URL.Path, err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	logging.Request(r.Method, r.URL.Path, map[string]any{
		"refresh_token": logging.Redacted("refresh_token"),
	})

	if err = validation.Validate.Struct(request); err != nil {
		logging.Error("refresh request validation failed path=%s err=%v", r.URL.Path, err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	response, err := userHandler.userService.RefreshToken(request.RefreshToken)
	if err != nil {
		logging.Error("refresh request failed path=%s err=%v", r.URL.Path, err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	logging.Response(r.Method, r.URL.Path, http.StatusOK, map[string]any{
		"id":         response.ID,
		"name":       response.Name,
		"email":      response.Email,
		"created_at": response.CreatedAt,
	})

	if err = json.NewEncoder(w).Encode(response); err != nil {
		logging.Error("refresh response encode failed path=%s user_id=%s err=%v", r.URL.Path, response.ID, err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}

func (userHandler *Handler) HandleDeleteUser(w http.ResponseWriter, r *http.Request) {
	userID, ok := requestcontext.GetUserID(r.Context())
	if !ok {
		logging.Error("delete request missing user id path=%s", r.URL.Path)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	err := userHandler.userService.DeleteUser(userID)
	if err != nil {
		logging.Error("delete request failed path=%s user_id=%s err=%v", r.URL.Path, userID, err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	logging.Response(r.Method, r.URL.Path, http.StatusOK, userID)
	w.WriteHeader(http.StatusNoContent)
}
