package route

import (
	"expense-backend/internal/auth"
	expense "expense-backend/internal/handlers/expense"
	user "expense-backend/internal/handlers/user"
	"net/http"
)

type Router struct {
	userHandler    *user.Handler
	expenseHandler *expense.Handler
}

func NewRouter(userHandler *user.Handler, expenseHandler *expense.Handler) *Router {
	return &Router{
		userHandler:    userHandler,
		expenseHandler: expenseHandler,
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

	http.Handle(
		"POST /api/v1/expenses",
		auth.Middleware(
			http.HandlerFunc(r.expenseHandler.HandleAddExpense),
		),
	)

	http.Handle(
		"PATCH /api/v1/expenses/{id}",
		auth.Middleware(
			http.HandlerFunc(r.expenseHandler.HandleEditExpense),
		),
	)

	http.Handle(
		"DELETE /api/v1/expenses/{id}",
		auth.Middleware(
			http.HandlerFunc(r.expenseHandler.HandleDeleteExpense),
		),
	)

	http.Handle(
		"GET /api/v1/stats",
		auth.Middleware(
			http.HandlerFunc(r.expenseHandler.HandleDashboardStats),
		),
	)

	// http.HandleFunc(
	// 	"GET /api/v1/users",
	// 	r.userHandler.GetUserByEmail,
	// )
}
