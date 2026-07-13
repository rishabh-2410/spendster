package repository

import (
	"database/sql"
	"errors"
	"expense-backend/internal/logging"
)

type Token struct {
	db *sql.DB
}

func NewTokenRepository(db *sql.DB) *Token {
	return &Token{
		db: db,
	}
}

func (tr *Token) SaveRefreshToken(userID string, refreshToken string) error {
	logging.Debug("token repository save refresh token user_id=%s refresh_token=%s", userID, logging.Redacted("refresh_token"))
	result, err := tr.db.Exec(
		`INSERT INTO refresh_tokens(
    	user_id,
   	 	token_hash,
		expires_at
	) VALUES (
	 	$1,
		$2,
		NOW() + INTERVAL '30 days'
	) 
	`, userID, refreshToken)

	if err != nil {
		logging.Error("token repository save refresh token failed user_id=%s err=%v", userID, err)
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		logging.Error("token repository save refresh token rows failed user_id=%s err=%v", userID, err)
		return err
	}

	if rowsAffected == 0 {
		logging.Error("token repository save refresh token no rows affected user_id=%s", userID)
		return errors.New("user already is already logged in")
	}

	logging.Info("token repository save refresh token success user_id=%s", userID)

	return nil
}

func (tr *Token) MarkTokenExpired(refreshToken string) (string, error) {
	logging.Debug("token repository mark token expired refresh_token=%s", logging.Redacted("refresh_token"))
	var userID string
	err := tr.db.QueryRow(`
		UPDATE refresh_tokens 
		SET revoked_at=NOW()
		WHERE token_hash = $1
			AND expires_at > NOW()
  			AND revoked_at IS NULL
		RETURNING user_id
		`, refreshToken).Scan(&userID)

	if err != nil {
		logging.Error("token repository mark token expired failed err=%v", err)
		return "", err
	}

	logging.Info("token repository mark token expired success user_id=%s", userID)

	return userID, nil
}
