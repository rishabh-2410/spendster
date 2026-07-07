package main

import (
	conn "expense-backend/internal/db/conn"
	userhandler "expense-backend/internal/handlers/user"
	"expense-backend/internal/repository"
	routes "expense-backend/internal/route"
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

	userservice := userservice.NewUserService(userRepository)

	userHandler := userhandler.NewUserHandler(userservice)

	router := routes.NewRouter(userHandler)

	router.RegisterRoutes()

	log.Println("Server listening on :8080")

	log.Fatal(http.ListenAndServe(":8080", nil))

}
