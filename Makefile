# ==========================
# Expense Tracker Makefile
# ==========================

.PHONY: help install frontend backend dev build test fmt lint clean

# Default target
help:
	@echo "Available commands:"
	@echo ""
	@echo "  make install   - Install frontend dependencies and tidy Go modules"
	@echo "  make frontend  - Start Expo development server"
	@echo "  make backend   - Start Go backend"
	@echo "  make dev       - Start backend in background and Expo frontend"
	@echo "  make build     - Build backend"
	@echo "  make test      - Run frontend and backend tests"
	@echo "  make fmt       - Format Go code"
	@echo "  make lint      - Lint frontend"
	@echo "  make clean     - Remove generated backend binaries"

# Install dependencies
install:
	cd backend && go mod tidy
	cd frontend && npm install

# Start Expo
frontend:
	cd frontend && npx expo start

# Start Go backend
backend:
	cd backend && go run .

# Start both (backend in background)
dev:
	(cd backend && go run .) &
	cd frontend && npx expo start

# Build backend binary
build-app:
	cd backend && go build -o bin/server .

# Run tests
run-test:
	cd backend && go test ./...
	cd frontend && npm test

# Format Go code
fmt:
	cd backend && go fmt ./...

# Lint frontend
lint:
	cd frontend && npm run lint

# Remove generated files
clean:
	rm -rf backend/bin &
	rm -rf frontend/.expo