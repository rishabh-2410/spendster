package logging

import (
	"fmt"
	"log"
)

func Info(format string, args ...any) {
	log.Printf("[INFO] "+format, args...)
}

func Debug(format string, args ...any) {
	log.Printf("[DEBUG] "+format, args...)
}

func Error(format string, args ...any) {
	log.Printf("[ERROR] "+format, args...)
}

func Request(method string, path string, payload any) {
	if payload == nil {
		Info("request method=%s path=%s", method, path)
		return
	}

	Info("request method=%s path=%s payload=%+v", method, path, payload)
}

func Response(method string, path string, status int, payload any) {
	if payload == nil {
		Info("response method=%s path=%s status=%d", method, path, status)
		return
	}

	Info("response method=%s path=%s status=%d payload=%+v", method, path, status, payload)
}

func Redacted(label string) string {
	return fmt.Sprintf("%s_redacted", label)
}
