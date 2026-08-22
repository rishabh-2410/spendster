package notification

import (
	"encoding/json"
	requestcontext "expense-backend/internal/context"
	"expense-backend/internal/logging"
	reqmodels "expense-backend/internal/models/req_dto"
	notification "expense-backend/internal/services/notification"
	"expense-backend/internal/validation"
	"net/http"
)

type Handler struct {
	notificationService *notification.Service
}

func New(notificationService *notification.Service) *Handler {
	return &Handler{notificationService: notificationService}
}

func (h *Handler) HandleRegisterPushToken(w http.ResponseWriter, r *http.Request) {
	var request reqmodels.PushTokenRequestDTO

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&request); err != nil {
		logging.Error("push token request decode failed path=%s err=%v", r.URL.Path, err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	if err := validation.Validate.Struct(request); err != nil {
		logging.Error("push token request validation failed path=%s err=%v", r.URL.Path, err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	userID, ok := requestcontext.GetUserID(r.Context())
	if !ok {
		logging.Error("push token request missing user id path=%s", r.URL.Path)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	if err := h.notificationService.RegisterPushToken(userID, request.Token); err != nil {
		logging.Error("push token registration failed path=%s user_id=%s err=%v", r.URL.Path, userID, err)
		http.Error(w, "Invalid push token", http.StatusBadRequest)
		return
	}

	logging.Response(r.Method, r.URL.Path, http.StatusNoContent, map[string]any{"user_id": userID})
	w.WriteHeader(http.StatusNoContent)
}
