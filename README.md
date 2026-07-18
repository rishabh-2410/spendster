# Spendster

## 1. Project Overview

Spendster is a mobile-first expense tracking application built as a two-part system:

- An **Expo / React Native** client for authentication, dashboarding, and expense management
- A **Go + PostgreSQL** backend that exposes a small REST API secured with JWT-based authentication

From an engineering perspective, this repository shows a pragmatic full-stack architecture: the frontend keeps local UI state small with Zustand, delegates server state to TanStack Query, and communicates with a backend that is intentionally layered into handlers, services, repositories, and SQL-backed persistence.

This repository documents the design, architecture, and development process to provide a complete view of the project.

| Area | Implementation |
| --- | --- |
| Product thinking | Focused scope around a real user workflow: register, log in, track expenses, review spending |
| Mobile engineering | Expo Router navigation, native storage, mobile UI patterns, and optimistic updates |
| Backend design | Layered Go application structure with validation, auth middleware, and repository abstractions |
| Data modeling | Separate tables for users, expenses, and refresh tokens with ownership boundaries |
| Security awareness | Hashed passwords, short-lived access tokens, hashed refresh tokens, and token revocation |

## 2. Features

| Feature | Status  |
| --- | --- |
| User registration | ✅ |
| User login | ✅ |
| Session restoration via refresh token | ✅ |
| Logout | ✅ |
| Add expense | ✅ |
| Edit expense | ✅ for `amount` and `category` |
| Delete expense | ✅ |
| Dashboard summary | ✅ with total, today, and monthly spends |
| Expense list | ✅ |
| Expense detail screen | ✅ |
| Swipe actions on expense rows | ✅ |
| Secure refresh token storage on device | ✅  |

## 3. Tech Stack

### Frontend

| Category | Technology |
| --- | --- |
| App framework | Expo 54 |
| UI runtime | React 19, React Native 0.81 |
| Navigation | Expo Router |
| Server state | TanStack React Query |
| Client session state | Zustand |
| Validation | Zod |
| Secure token storage | Expo Secure Store |
| UI patterns | Gorhom Bottom Sheet, Reanimated, Gesture Handler |
| Language | TypeScript |

### Backend

| Category | Technology |
| --- | --- |
| Language | Go 1.25 |
| API style | REST over `net/http` |
| Database | PostgreSQL |
| Auth | JWT access tokens + rotating refresh tokens |
| Validation | `go-playground/validator/v10` |
| Password hashing | `bcrypt` |
| DB access | `database/sql` with `lib/pq` |

### Tooling & Delivery

| Area | Technology |
| --- | --- |
| Mobile app build/release | EAS  |
| Package management | npm |
| Local task runner | Makefile |
| Native targets | Android and iOS folders committed |

## 4. Screenshots

Replace these placeholders with exported app images or device frames:

![LoginScreen](assets/screenshots/login.png)
![RegisterScreen](assets/screenshots/register.png)
![Dashboard](assets/screenshots/home.png)
![AddExpense](assets/screenshots/add-expense.png)
![ExpenseDetail](assets/screenshots/expense-details.png)
![SettingsScreen](assets/screenshots/settings.png)

## 5. Architecture

```mermaid
flowchart LR
    User["Mobile User"] --> App["Expo / React Native App"]

    subgraph Frontend["Frontend"]
        Router["Expo Router"]
        Screens["Screens & Bottom Sheets"]
        Query["TanStack Query"]
        AuthStore["Zustand Auth Store"]
        SecureStore["Expo Secure Store"]
        Services["Fetch-based Service Layer"]
    end

    App --> Router
    Router --> Screens
    Screens --> Query
    Screens --> AuthStore
    AuthStore --> SecureStore
    Query --> Services

    Services --> API["Go REST API"]

    subgraph Backend["Backend"]
        Routes["Route Registration"]
        Middleware["JWT Auth Middleware"]
        Handlers["HTTP Handlers"]
        UserService["User Service"]
        ExpenseService["Expense Service"]
        UserRepo["User Repository"]
        TokenRepo["Refresh Token Repository"]
        ExpenseRepo["Expense Repository"]
        DashboardRepo["Dashboard Repository"]
    end

    API --> Routes
    Routes --> Middleware
    Routes --> Handlers
    Handlers --> UserService
    Handlers --> ExpenseService
    UserService --> UserRepo
    UserService --> TokenRepo
    ExpenseService --> UserRepo
    ExpenseService --> ExpenseRepo
    ExpenseService --> DashboardRepo

    UserRepo --> DB[("PostgreSQL")]
    TokenRepo --> DB
    ExpenseRepo --> DB
    DashboardRepo --> DB
```

## 6. Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as Mobile App
    participant S as Secure Store
    participant B as Go Backend
    participant D as PostgreSQL

    U->>A: Log in with email + password
    A->>B: POST /api/v1/auth/login
    B->>D: Find user, verify password, store hashed refresh token
    B-->>A: access_token + refresh_token + user payload
    A->>S: Save refresh_token
    A->>A: Save access_token in Zustand

    Note over A,S: On app launch
    A->>S: Read refresh_token
    A->>B: POST /api/v1/auth/refresh
    B->>D: Revoke previous token, issue new refresh token
    B-->>A: new access_token + new refresh_token
    A->>S: Replace stored refresh_token
    A->>A: Restore authenticated session

    A->>B: GET /api/v1/expenses with Bearer access_token
    B-->>A: Authorized API response
```

## 7. Database Design

```mermaid
erDiagram
    USERS ||--o{ EXPENSES : owns
    USERS ||--o{ REFRESH_TOKENS : receives

    USERS {
        uuid id PK
        text name
        varchar email UNIQUE
        text hashed_password
        timestamptz created_at
        timestamptz updated_at
    }

    EXPENSES {
        uuid id PK
        uuid user_id FK
        text title
        decimal amount
        text category
        timestamptz date_of_expense
        timestamptz created_at
        timestamptz updated_at
    }

    REFRESH_TOKENS {
        uuid id PK
        uuid user_id FK
        text token_hash UNIQUE
        timestamptz created_at
        timestamptz revoked_at
        timestamptz expires_at
    }
```

## 8. Folder Structure

```text
.
├── backend/
│   ├── cmd/                  # API entry point
│   └── internal/
│       ├── auth/             # JWT claims, parsing, middleware
│       ├── context/          # Request-scoped user ID helpers
│       ├── db/
│       │   ├── conn/         # PostgreSQL connection setup
│       │   └── queries/      # SQL reference scripts / schema snippets
│       ├── handlers/         # HTTP transport layer
│       ├── logging/          # Structured logging helpers
│       ├── models/           # DB objects + request/response DTOs
│       ├── repository/       # Database access layer
│       ├── route/            # Route registration
│       ├── services/         # Business logic
│       └── validation/       # Shared validator instance
├── frontend/
│   ├── app/                  # Expo Router screens
│   ├── assets/               # Icons and brand images
│   ├── components/           # Shared UI and sheets
│   ├── hooks/                # Query and mutation hooks
│   ├── lib/                  # Query client setup
│   ├── schemas/              # Zod request/response contracts
│   ├── services/             # API calls and session restore logic
│   ├── store/                # Zustand + Secure Store wrappers
│   ├── styles/               # Shared style objects
│   └── utils/                # Small helpers such as API URL access
├── Makefile
├── app.json
├── eas.json
└── package.json
```

## 9. API Overview

### Authentication

| Method | Route | Auth Required | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/register` | ❌ | Create a user account |
| `POST` | `/api/v1/auth/login` | ❌ | Exchange credentials for access + refresh tokens |
| `POST` | `/api/v1/auth/refresh` | ❌ | Rotate refresh token and restore session |
| `POST` | `/api/v1/auth/logout` | ❌ | Revoke refresh token |

### Expenses & Dashboard

| Method | Route | Auth Required | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/v1/expenses` | ✅ | Fetch all expenses for current user |
| `POST` | `/api/v1/expenses` | ✅ | Create an expense |
| `PATCH` | `/api/v1/expenses/{id}` | ✅ | Update expense amount/category |
| `DELETE` | `/api/v1/expenses/{id}` | ✅ | Delete an expense |
| `GET` | `/api/v1/dashboard` | ✅ | Fetch spending summary cards |

### Representative Payloads

```json
POST /api/v1/auth/login
{
  "email": "you@example.com",
  "password": "strong-password"
}
```

```json
POST /api/v1/expenses
{
  "title": "Uber",
  "amount": 2200,
  "category": "Travel",
  "date_of_expense": "2026-07-18T10:30:00.000Z"
}
```

## 10. State Management

| Concern | Strategy | Why It Fits This Project |
| --- | --- | --- |
| Auth session in memory | Zustand | Small, low-boilerplate global state for current user and access token |
| Refresh token at rest | Expo Secure Store | Better security posture than AsyncStorage for credential-like data |
| Server data | TanStack Query | Clean cache lifecycle for expenses and dashboard stats |
| Input validation | Zod on the client, validator on the server | Shared pattern of validating data at boundaries |
| Mutations | React Query mutations | Centralized async handling and cache invalidation |

Notable implementation details:
- **Session restoration** runs during app bootstrap. 
- The access token is kept in Zustand, while the refresh token is stored separately in **Secure Store**
- Expense creation uses **optimistic UI updates** for both the expense list and dashboard summary

## 11. Important Design Decisions

| Decision | Why |
| --- | --- |
| Split frontend and backend into distinct folders | Keeps mobile and API concerns independently deployable |
| Use Expo Router for navigation | File-based routing reduces navigation boilerplate and scales well for app sections |
| Separate DTOs, services, and repositories in Go | Makes the backend easier to reason about, test, and evolve |
| Use short-lived access tokens plus refresh tokens | Improves mobile session UX without keeping long-lived bearer tokens in memory |
| Hash refresh tokens before storing them | Limits blast radius if the database is exposed |
| Use query caching plus optimistic updates | Reduces perceived latency on common CRUD actions |
| Keep SQL close to repository code | Pragmatic choice for a compact codebase without a full ORM |

## 12. Security

| Practice |  Code |
| --- | --- |
| Password hashing with bcrypt |  ✅ |
| JWT access token validation middleware | ✅ |
| Refresh token hashing before persistence | ✅ |
| Refresh token rotation on session restore | ✅ |
| Token revocation support | ✅ |
| Secure device storage for refresh token | ✅ |


Security note:

- `/api/v1/auth/logout` is not wrapped by the JWT middleware in route registration, so logout currently depends on the refresh token revocation path rather than authenticated route protection alone.

## 13. Performance Optimizations

| Optimization | Code | Benefit |
| --- | --- | --- |
| React Query caching | `frontend/lib/query-client.ts` | Reduces unnecessary refetching |
| One-minute query `staleTime` | `frontend/lib/query-client.ts` | Balances freshness with fewer network calls |
| Optimistic writes | `use-add-expense.ts`, `use-delete-expense.ts` | Faster-feeling CRUD interactions |
| Global validator instance | `backend/internal/validation/validation.go` | Reuses cached validation metadata |
| Layered API design | Backend services/repositories | Keeps handlers lightweight and easier to optimize |
| SQL-side aggregation for dashboard | `dashboard_repository.go` | Avoids computing summary metrics on the client |

## 14. Challenges & Solutions

| Challenge | Solution |
| --- | --- |
| Keeping mobile sessions alive across app launches | Persist refresh token securely and restore session on boot |
| Avoiding insecure token storage | Store refresh token in Secure Store, not generic local storage |
| Making expense CRUD feel responsive | Use optimistic cache updates and invalidate after settlement |
| Preventing cross-user expense access | Scope reads and writes by `user_id` in repository queries |
| Keeping frontend and backend contracts aligned | Validate payloads on both sides using Zod and Go validators |

## 15. Future Improvements

1. Add database migrations instead of manual SQL scripts in `backend/internal/db/queries`.
2. Protect logout with middleware or document the intended threat model more explicitly.
3. Introduce automated backend and frontend tests; the current repository does not include an established test suite.
4. Push notifications / analytics / budgets
5. Add pagination or filtering once the expense list grows.
6. Add budgets, category analytics, charts, and recurring expenses.
7. Replace ad-hoc logging with structured request IDs and log levels if moving to production scale.
8. Add CI for linting, tests, and build verification.

## 16. Local Setup

### Prerequisites

| Tool | Version / Notes |
| --- | --- |
| Node.js | 22.9.0 |
| npm | 11.10.0 |
| Go | 1.25 |
| PostgreSQL | Required |


### Install

```bash
make install
```

### Backend Setup

1. Create a PostgreSQL database.
2. Copy values from `backend/.env.example` into your local environment or shell and add your values.
4. Create the tables on your database from the SQL files under `backend/internal/db/queries/create`.

Example:

```bash
cd backend
export DB_MODE=dev
export DB_DEV="postgres://USER:PASSWORD@HOST:5432/DB_NAME?sslmode=disable"
export DB_PROD="postgres://USER:PASSWORD@HOST:5432/DB_NAME?sslmode=require"
export JWT_SECRET="replace-with-a-long-random-secret"
go run ./cmd/app.go
```

### Frontend Setup

Set the API base URL before starting Expo:

```bash
cd frontend
export EXPO_PUBLIC_API_URL="http://localhost:8080"
npm install
npx expo start
```

### Combined Dev Workflow

```bash
make backend
make frontend
```

Or:

```bash
make dev
```

## 17. Environment Variables (.env.example)

### Backend

Current `backend/.env.example` includes:

```env
DB_MODE=dev
DB_PROD=ENTER_DB_CONNECTION_STRING_HERE
DB_DEV=ENTER_DB_CONNECTION_STRING_HERE
JWT_SECRET=TODO_ADD_TO_BACKEND_ENV_EXAMPLE
PORT=8080
```

### Frontend

Current `frontend/.env.example` includes:

```env
EXPO_PUBLIC_API_URL=http://localhost:8080
```


## 18. Deployment

| Surface | Inferred Deployment Story |
| --- | --- |
| Mobile app | Configured for Expo / EAS builds |
| iOS | Native project committed; bundle identifier present |
| Android | Native project committed; package name present |
| Backend | Deployed on Render |
| Database | PostgreSQL deployed on Neon |

Delivery details:

- `frontend/eas.json` defines `development`, `preview`, and `production` profiles
- `frontend/app.json` contains mobile identifiers and splash/icon configuration
- The backend listens on `PORT`, defaulting to `8080`

## 19. Lessons Learned

- A small product can still benefit from clear architectural boundaries.
- Mobile auth is easier to maintain when access and refresh tokens have different responsibilities.
- Backend validation and frontend validation should both exist; each protects a different boundary.
- Optimistic UI matters for user trust in CRUD-heavy apps.
- For an early-stage product, raw SQL plus repository layering can be a productive middle ground before adopting heavier infrastructure.

## 20. License

`TODO: No LICENSE file is currently present in the repository. Add one before public distribution.`

