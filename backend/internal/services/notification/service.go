package notification

import (
	"errors"
	"strings"
)

var ErrInvalidPushToken = errors.New("invalid Expo push token")

type PushTokenRepository interface {
	Save(userID string, token string) error
}

type Service struct {
	pushTokenRepository PushTokenRepository
}

func New(pushTokenRepository PushTokenRepository) *Service {
	return &Service{pushTokenRepository: pushTokenRepository}
}

func (s *Service) RegisterPushToken(userID string, token string) error {
	if !isExpoPushToken(token) {
		return ErrInvalidPushToken
	}

	return s.pushTokenRepository.Save(userID, token)
}

func isExpoPushToken(token string) bool {
	for _, prefix := range []string{"ExpoPushToken[", "ExponentPushToken["} {
		if strings.HasPrefix(token, prefix) && strings.HasSuffix(token, "]") {
			return len(token) > len(prefix)+1
		}
	}

	return false
}
