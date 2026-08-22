package notification

import (
	"errors"
	"testing"
)

type fakePushTokenRepository struct {
	userID string
	token  string
	err    error
}

func (f *fakePushTokenRepository) Save(userID string, token string) error {
	f.userID = userID
	f.token = token
	return f.err
}

func TestRegisterPushTokenSavesValidExpoToken(t *testing.T) {
	repository := &fakePushTokenRepository{}
	service := New(repository)

	err := service.RegisterPushToken("user-1", "ExponentPushToken[example-token]")

	if err != nil {
		t.Fatalf("RegisterPushToken() error = %v, want nil", err)
	}
	if repository.userID != "user-1" || repository.token != "ExponentPushToken[example-token]" {
		t.Fatalf("Save() received userID=%q token=%q", repository.userID, repository.token)
	}
}

func TestRegisterPushTokenRejectsInvalidToken(t *testing.T) {
	repository := &fakePushTokenRepository{}
	service := New(repository)

	err := service.RegisterPushToken("user-1", "not-an-expo-token")

	if !errors.Is(err, ErrInvalidPushToken) {
		t.Fatalf("RegisterPushToken() error = %v, want %v", err, ErrInvalidPushToken)
	}
	if repository.token != "" {
		t.Fatal("Save() should not be called for an invalid token")
	}
}

func TestRegisterPushTokenReturnsRepositoryError(t *testing.T) {
	repositoryError := errors.New("database unavailable")
	repository := &fakePushTokenRepository{err: repositoryError}
	service := New(repository)

	err := service.RegisterPushToken("user-1", "ExpoPushToken[example-token]")

	if !errors.Is(err, repositoryError) {
		t.Fatalf("RegisterPushToken() error = %v, want %v", err, repositoryError)
	}
}
