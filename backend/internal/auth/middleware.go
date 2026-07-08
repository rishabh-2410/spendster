package auth

import (
	"context"
	"net/http"
	"strings"

	requestcontext "expense-backend/internal/context"
)

func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// Get header from the request
		authHeader := r.Header.Get("Authorization")

		// If header is empty, unauthorized
		if authHeader == "" {
			http.Error(w, "Missing auth header", http.StatusUnauthorized)
			return
		}

		// log.Printf("Raw auth header: %v", authHeader)

		// Split the header value into 2 parts. Ex: header value -> `Bearer 2xcsfseslkjgsjdf...`
		// Result (stored in parts) -> ["Bearer", "2xcsfseslkjgsjdf..."]
		parts := strings.SplitN(authHeader, " ", 2)

		// log.Printf("Splitted authheader: %v", parts)

		// If header value has more than 2 parts or if the first part is not Bearer, invalid value -> unauthorized
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Invalid authorization header", http.StatusUnauthorized)
			return
		}

		// Get the token value from the header value
		tokenString := parts[1]

		// Parse the token to get the claims
		claims, err := ParseAccessToken(tokenString)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		if claims == nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Create a new context with value and add the user id with a key USERIDKEY
		ctx := context.WithValue(
			r.Context(),
			requestcontext.UserIDKey,
			claims.UserID,
		)

		// Send the next context as part of the request and forward request to next handler
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
