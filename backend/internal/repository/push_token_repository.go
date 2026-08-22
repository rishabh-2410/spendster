package repository

import (
	"database/sql"
	"expense-backend/internal/logging"
)

type PushToken struct {
	db *sql.DB
}

func NewPushTokenRepository(db *sql.DB) *PushToken {
	return &PushToken{db: db}
}

func (ptr *PushToken) Save(userID string, token string) error {
	_, err := ptr.db.Exec(`
		INSERT INTO push_tokens (user_id, token)
		VALUES ($1, $2)
		ON CONFLICT (token) DO UPDATE
		SET user_id = EXCLUDED.user_id, updated_at = NOW()
	`, userID, token)
	if err != nil {
		logging.Error("push token repository save failed user_id=%s err=%v", userID, err)
		return err
	}

	logging.Info("push token repository save success user_id=%s", userID)
	return nil
}
