package main

import (
	conn "expense-backend/internal/db/conn"
	expenseHandler "expense-backend/internal/handlers/expense"
	userhandler "expense-backend/internal/handlers/user"
	"expense-backend/internal/repository"
	routes "expense-backend/internal/route"
	expenseservice "expense-backend/internal/services/expense"
	userservice "expense-backend/internal/services/user"
	"expense-backend/internal/validation"
	"fmt"
	"log"
	"net/http"
)

func main() {

	// Initialize validation instance
	validation.InitializeValidator()

	db, err := conn.Connect()
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	fmt.Println("Connected successfully")

	userRepository := repository.NewUserRepository(db)
	tokenRepository := repository.NewTokenRepository(db)
	expenseRepository := repository.NewExpenseRepository(db)

	userservice := userservice.New(userRepository, tokenRepository)
	expenseservice := expenseservice.New(userRepository, expenseRepository)

	userHandler := userhandler.New(userservice)
	expenseHandler := expenseHandler.New(expenseservice)

	router := routes.NewRouter(userHandler, expenseHandler)

	router.RegisterRoutes()

	log.Println("Server listening on :8080")

	log.Fatal(http.ListenAndServe(":8080", nil))

}
