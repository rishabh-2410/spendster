package main

import (
	conn "expense-backend/internal/db/conn"
	expenseHandler "expense-backend/internal/handlers/expense"
	userhandler "expense-backend/internal/handlers/user"
	"expense-backend/internal/logging"
	"expense-backend/internal/repository"
	routes "expense-backend/internal/route"
	expenseservice "expense-backend/internal/services/expense"
	userservice "expense-backend/internal/services/user"
	"expense-backend/internal/validation"
	"log"
	"net/http"
	"os"
)

func main() {
	logging.Info("backend startup initiated")

	port := os.Getenv("PORT")

	if port == "" {
		port = "8080" // Local development
	}
	logging.Info("backend configured port=%s", port)

	// Initialize validation instance
	validation.InitializeValidator()
	logging.Info("validator initialized")

	db, err := conn.Connect()
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	logging.Info("database connection ready")

	userRepository := repository.NewUserRepository(db)
	tokenRepository := repository.NewTokenRepository(db)
	expenseRepository := repository.NewExpenseRepository(db)
	dashboardRepository := repository.NewDashboardRepository(db)
	logging.Info("repositories initialized")

	userservice := userservice.New(userRepository, tokenRepository)
	expenseservice := expenseservice.New(userRepository, expenseRepository, dashboardRepository)
	logging.Info("services initialized")

	userHandler := userhandler.New(userservice)
	expenseHandler := expenseHandler.New(expenseservice)
	logging.Info("handlers initialized")

	router := routes.NewRouter(userHandler, expenseHandler)

	router.RegisterRoutes()

	logging.Info("server listening address=:%s", port)

	log.Fatal(http.ListenAndServe(":"+port, nil))

}
