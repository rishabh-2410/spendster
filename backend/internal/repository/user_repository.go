package repository

import (
	"database/sql"
	"errors"
	models "expense-backend/internal/models/db_object"
)

type User struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *User {
	return &User{
		db: db,
	}
}

func (ur *User) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := ur.db.QueryRow(`
		SELECT * FROM users WHERE email=$1
	`, email).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (ur *User) FindById(id string) (*models.User, error) {
	var user models.User
	err := ur.db.QueryRow(`
		SELECT * FROM users WHERE id=$1
	`, id).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (ur *User) AddUser(user *models.User) error {
	err := ur.db.QueryRow(`INSERT INTO users(
    name,
    email,
    hashed_password
	) VALUES ( $1, $2,$3)
	`, user.Name, user.Email, user.PasswordHash).Err()

	if err != nil {
		return err
	}

	return nil

}

func (ur *User) RevokeUser(hashedToken string) error {

	result, err := ur.db.Exec(
		`UPDATE refresh_tokens
		SET revoked_at = NOW()
		WHERE token_hash = $1 AND revoked_at IS NULL
		`, hashedToken)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("refresh token not found or already revoked")
	}

	return nil
}
