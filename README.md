# Nexus Inventory

A **full-stack inventory management system** built as a learning project. It demonstrates modern web development practices: a REST API with JWT authentication, a React SPA, and a clear separation between frontend and backend.

---

## 🎯 Project Overview

Nexus Inventory lets users manage product catalog and stock levels, record receiving and transfers, view dashboards and reports, and manage users—all behind a secure login. The backend is a **Spring Boot 3** REST API; the frontend is a **React 19** single-page application that talks to the API and uses **Supabase** for authentication.

---

## ✨ Highlights (What Makes This Project Stand Out)

- **Full-stack** — Backend (Java/Spring) and frontend (React/TypeScript) designed to work together with a clear API contract.
- **Production-style auth** — **Supabase** handles sign-up, login, and JWT issuance; the backend validates JWTs via **OAuth2 Resource Server** and JWKS. No hardcoded passwords; stateless, token-based sessions.
- **RESTful API design** — Versioned endpoints (`/api/v1/...`), DTOs for request/response, validation with meaningful error messages, and **OpenAPI/Swagger** documentation.
- **Structured error handling** — Global exception handler with consistent JSON error payloads (timestamp, status, message, path) for `EntityNotFoundException`, validation errors, and duplicate resource conflicts.
- **Domain modeling** — Products (SKU, price, stock, min level), **auditable stock movements** (receiving, transfer, adjustment) with snapshots so reports stay accurate even if product data changes later.
- **User sync** — When a user logs in via Supabase, the backend creates/updates an `app_users` record so the app has a local user list and last-login tracking.
- **Modern tooling** — Java 21, Spring Boot 3.5, React 19, Vite 7, TypeScript, PostgreSQL (e.g. Supabase Postgres). CORS and dev proxy configured for a smooth local workflow.

---

## 🛠 Tech Stack

| Layer        | Technologies |
|-------------|--------------|
| **Backend** | Java 21, Spring Boot 3.5, Spring Data JPA, Spring Security (OAuth2 Resource Server), Spring Validation, Lombok, PostgreSQL, SpringDoc OpenAPI (Swagger UI) |
| **Frontend**| React 19, TypeScript, Vite 7, React Router 7, Supabase JS (auth) |
| **Auth**    | Supabase Auth (email/password, JWT); backend validates JWT via JWKS (RS256/ES256) |
| **Database**| PostgreSQL (e.g. Supabase); Hibernate `ddl-auto=update` for schema sync |

---

## 📁 Project Structure

```
nexus_inventory/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── api/            # HTTP client, users API, types
│   │   ├── auth/           # AuthContext, AuthGuard, Supabase client, token store
│   │   ├── components/     # Sidebar, TopBar, modals, tables, stats
│   │   ├── data/           # Products, StockMovements, Meta contexts
│   │   ├── routes/         # Dashboard, Inventory, Receiving, Reports, Alerts, Audits, Users, Login
│   │   └── utils/          # Formatting, inventory helpers
│   └── ...
├── server/                 # Spring Boot backend
│   └── src/main/java/com/octavian/server/
│       ├── config/         # Security (CORS, JWT decoder), OpenAPI
│       ├── controller/     # Product, StockMovement, User, Meta
│       ├── dto/            # Request/response DTOs with validation
│       ├── exception/      # GlobalExceptionHandler, custom exceptions
│       ├── model/          # JPA entities (Product, StockMovement, User)
│       ├── repository/     # JPA repositories
│       └── service/        # Business logic
└── README.md
```

---

## 🔌 API Overview

- **Products** — `GET/POST /api/v1/products`, `GET /api/v1/products/{id}`, `PATCH /api/v1/products/{id}/stock` (with `StockAdjustmentDTO`).
- **Stock movements** — `POST /api/v1/stock-movements`, `GET /api/v1/stock-movements?limit=50`.
- **Users** — `GET /api/v1/users/me` (current user), `GET /api/v1/users` (list); user created/updated on login via Supabase.
- **Meta** — `GET /api/v1/meta` (app name, server time); public, no auth.

Protected routes require `Authorization: Bearer <access_token>`. API docs: **Swagger UI** at `/swagger-ui.html` when the server is running.

---

## 🚀 Getting Started

### Prerequisites

- **JDK 21**, **Maven**, **Node.js** (LTS), **npm**
- **PostgreSQL** (or a Supabase project with Postgres)
- **Supabase project** for auth (to get JWT issuer and JWKS URI)

### Backend

1. Go to `server/`.
2. Create a `.env` (or `.env.properties`) in `server/` with at least:
   - `POSTGRES_PASSWORD` — database password (or set in `application.properties`).
   - `auth.jwt.jwks-uri` and optionally `auth.jwt.issuer` (see commented lines in `application.properties`).
3. Point `spring.datasource.url` and credentials in `application.properties` to your Postgres instance.
4. Run:
   ```bash
   mvn spring-boot:run
   ```
   Server runs at `http://localhost:8080`. Open `http://localhost:8080/swagger-ui.html` for the API docs.

### Frontend

1. Go to `client/`.
2. Copy `.env.example` to `.env` (if present) and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for your Supabase project.
3. Run:
   ```bash
   npm install
   npm run dev
   ```
   App runs at `http://localhost:5173`. In dev, requests to `/api` are proxied to `http://localhost:8080` (see `vite.config.ts`).

### First Use

- Open the app, sign up or log in via Supabase.
- The backend will create/update your user on first authenticated request.
- Use Dashboard, Inventory, Receiving, Reports, Alerts, Audits, and Users as intended.

---

## 📄 License

This project is for educational purposes (e.g. portfolio / internship applications). Use and modify as you like.

---

## 👤 Author

Built as a **Year 1 Computer Science** project at **Technical University of Cluj-Napoca**, to practice full-stack development and to support internship applications. Feedback and suggestions are welcome.
