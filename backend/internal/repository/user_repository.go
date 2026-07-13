package repository

import (
	"database/sql"
	"errors"
	"expense-backend/internal/logging"
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
	logging.Debug("user repository find by email email=%s", email)
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
		logging.Error("user repository find by email failed email=%s err=%v", email, err)
		return nil, err
	}

	logging.Debug("user repository find by email success email=%s user_id=%s", email, user.ID)

	return &user, nil
}

func (ur *User) FindById(id string) (*models.User, error) {
	logging.Debug("user repository find by id user_id=%s", id)
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
		logging.Error("user repository find by id failed user_id=%s err=%v", id, err)
		return nil, err
	}

	logging.Debug("user repository find by id success user_id=%s email=%s", id, user.Email)

	return &user, nil
}

func (ur *User) AddUser(user *models.User) error {
	logging.Debug("user repository add user email=%s name=%s", user.Email, user.Name)
	err := ur.db.QueryRow(`INSERT INTO users(
    name,
    email,
    hashed_password
	) VALUES ( $1, $2,$3)
	`, user.Name, user.Email, user.PasswordHash).Err()

	if err != nil {
		logging.Error("user repository add user failed email=%s err=%v", user.Email, err)
		return err
	}

	logging.Info("user repository add user success email=%s", user.Email)

	return nil

}

func (ur *User) RevokeUser(hashedToken string) error {
	logging.Debug("user repository revoke user refresh_token=%s", logging.Redacted("refresh_token"))

	result, err := ur.db.Exec(
		`UPDATE refresh_tokens
		SET revoked_at = NOW()
		WHERE token_hash = $1 AND revoked_at IS NULL
		`, hashedToken)
	if err != nil {
		logging.Error("user repository revoke user exec failed err=%v", err)
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		logging.Error("user repository revoke user rows failed err=%v", err)
		return err
	}

	if rowsAffected == 0 {
		logging.Error("user repository revoke user no rows affected")
		return errors.New("refresh token not found or already revoked")
	}

	logging.Info("user repository revoke user success")

	return nil
}
