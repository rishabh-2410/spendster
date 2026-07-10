package repository

import (
	"database/sql"
	"errors"
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
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("user already is already logged in")
	}

	return nil
}

func (tr *Token) MarkTokenExpired(refreshToken string) (string, error) {
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
		return "", err
	}

	return userID, nil
}
