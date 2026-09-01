package conn

import (
	"database/sql"
	"expense-backend/internal/logging"
	"fmt"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func Connect() (*sql.DB, error) {

	// Connection string for DB (DSN: Data Source Name)
	connectEnv := os.Getenv("DB_MODE")
	logging.Info("database connection requested mode=%s", connectEnv)
	var connectionString string
	switch connectEnv {
	case "dev":
		connectionString = os.Getenv("DB_DEV")
	case "prod":
		connectionString = os.Getenv("DB_PROD")
	case "local":
		connectionString = getConnStringLocal()
	default:
		logging.Error("database connection failed invalid mode=%s", connectEnv)
		return nil, fmt.Errorf("invalid connection mode")
	}

	// Open connection to DB
	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		logging.Error("database open failed mode=%s err=%v", connectEnv, err)
		return nil, fmt.Errorf("failed to connect to DB: %w", err)
	}

	// Verify connection
	err = db.Ping()
	if err != nil {
		logging.Error("database ping failed mode=%s err=%v", connectEnv, err)
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	logging.Info("database connection established mode=%s", connectEnv)

	// Return connection
	return db, nil
}

func getConnStringLocal() string {
	err := godotenv.Load()
	if err != nil {
		logging.Error("failed to load .env file err=%v", err)
		return ""
	}

	// Initialize string parameters
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	sslMode := os.Getenv("DB_SSLMODE")

	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s", host, port, user, password, dbName, sslMode)

}
