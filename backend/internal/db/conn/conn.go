package conn

import (
	"database/sql"
	"expense-backend/internal/logging"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

func Connect() (*sql.DB, error) {

	// // Load env
	// err := godotenv.Load()
	// if err != nil {
	// 	return nil, fmt.Errorf("failed to load .env file: %w", err)
	// }

	// Initialize string parameters
	// host := os.Getenv("DB_HOST")
	// port := os.Getenv("DB_PORT")
	// user := os.Getenv("DB_USER")
	// password := os.Getenv("DB_PASSWORD")
	// dbName := os.Getenv("DB_NAME")
	// sslMode := os.Getenv("DB_SSLMODE")

	// Connection string for DB (DSN: Data Source Name)
	connectEnv := os.Getenv("DB_MODE")
	logging.Info("database connection requested mode=%s", connectEnv)
	var connectionString string
	switch connectEnv {
	case "dev":
		connectionString = os.Getenv("DB_DEV")
	case "prod":
		connectionString = os.Getenv("DB_PROD")
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
