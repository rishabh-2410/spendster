package route

import (
	userHandler "expense-backend/internal/handlers/user"
	"net/http"
)

type Router struct {
	userHandler *userHandler.UserHandler
}

func NewRouter(userHandler *userHandler.UserHandler) *Router {
	return &Router{
		userHandler: userHandler,
	}
}

func (r *Router) RegisterRoutes() {

	http.HandleFunc(
		"POST /api/v1/auth/register",
		r.userHandler.HandleRegisterUser,
	)

	http.HandleFunc(
		"POST /api/v1/auth/login",
		r.userHandler.HandleUserLogin,
	)

	http.HandleFunc(
		"POST /api/v1/auth/logout",
		r.userHandler.HandleUserLogout,
	)

	// http.HandleFunc(
	// 	"GET /api/v1/users",
	// 	r.userHandler.GetUserByEmail,
	// )
}
