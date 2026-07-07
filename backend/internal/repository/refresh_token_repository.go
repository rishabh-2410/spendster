package repository

import (
	"database/sql"
	"errors"
)

type TokenRepo struct {
	db *sql.DB
}

func NewTokenRepository(db *sql.DB) *TokenRepo {
	return &TokenRepo{
		db: db,
	}
}

func (tr *TokenRepo) SaveRefreshToken(userID string, refreshToken string) error {
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
