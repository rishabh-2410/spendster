package route

import (
	"expense-backend/internal/auth"
	expense "expense-backend/internal/handlers/expense"
	notification "expense-backend/internal/handlers/notification"
	user "expense-backend/internal/handlers/user"
	"expense-backend/internal/logging"
	"net/http"
)

type Router struct {
	userHandler         *user.Handler
	expenseHandler      *expense.Handler
	notificationHandler *notification.Handler
}

func NewRouter(userHandler *user.Handler, expenseHandler *expense.Handler, _ *notification.Handler) *Router {
	return &Router{
		userHandler:    userHandler,
		expenseHandler: expenseHandler,
		// notificationHandler: notificationHandler,
	}
}

func (r *Router) RegisterRoutes() {
	logging.Info("registering HTTP routes")

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

	http.HandleFunc(
		"POST /api/v1/auth/refresh",
		r.userHandler.HandleTokenRefresh,
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
		"GET /api/v1/dashboard",
		auth.Middleware(
			http.HandlerFunc(r.expenseHandler.HandleDashboardStats),
		),
	)

	http.Handle(
		"GET /api/v1/expenses",
		auth.Middleware(
			http.HandlerFunc(r.expenseHandler.HandleGetExpenses),
		),
	)

	http.Handle(
		"PUT /api/v1/push-tokens",
		auth.Middleware(
			http.HandlerFunc(r.notificationHandler.HandleRegisterPushToken),
		),
	)

	logging.Info("HTTP routes registered")

	// http.HandleFunc(
	// 	"GET /api/v1/users",
	// 	r.userHandler.GetUserByEmail,
	// )
}
