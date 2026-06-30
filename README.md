<div align="center">

# 🏨 LuxeStay — Hotel Reservation System

**A production-quality, full-stack Hotel Reservation System built with Spring Boot 3 & Angular 17.**

*Designed to demonstrate enterprise software engineering principles for technical internship portfolios.*

---

[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/17/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Why This Project?](#-why-this-project)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Default Accounts](#-default-accounts)
- [Testing](#-testing)
- [Security](#-security)
- [Skills Demonstrated](#-skills-demonstrated)
- [Roadmap](#-roadmap)
- [Author](#-author)
- [License](#-license)

---

## 💡 Why This Project?

Most hotel booking tutorials produce CRUD apps with no security, no architecture, and no tests. I built LuxeStay differently — as if it were going into a real production environment.

**The goal:** demonstrate that I understand the practices that actually matter in enterprise software:
clean layered architecture, stateless JWT security, DTO-based API design, global error handling,
input validation, unit testing, and a premium user experience.

---

## 🎬 Live Demo

> The application runs fully locally with a single command per service.
> No external accounts or API keys required.

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:4200 |
| **Backend API** | http://localhost:8082 |
| **H2 Console** | http://localhost:8082/h2-console |

**Demo credentials:**

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@hotel.com` | `admin123` |
| User | `test@example.com` | `password123` |

---

## ✨ Features

### Guest / User
- 🔐 **JWT Authentication** — Register and sign in securely; tokens persist across sessions.
- 🛏️ **Room Browsing** — Browse all available rooms with images, pricing, and capacity.
- 📅 **Smart Booking** — Book a room with check-in/check-out dates; overlap conflicts are detected and rejected.
- 📊 **Personal Dashboard** — View all your bookings and cancel pending/confirmed reservations.

### Administrator
- 📈 **Live Dashboard** — Real-time metrics: total users, occupancy rate, pending bookings.
- 🏨 **Room Management** — Create, update, and delete rooms with full CRUD.
- 👥 **User Management** — View and delete registered accounts.
- ✅ **Booking Approval** — Review pending reservations and approve or reject them.

---

## 🛠️ Tech Stack

### Backend

| Technology | Role |
|-----------|------|
| Java 17 | Language |
| Spring Boot 3.2 | Application framework |
| Spring Security 6 | Authentication & authorization |
| JJWT 0.11 | JWT generation and validation |
| Spring Data JPA | ORM and database access |
| H2 Database | In-memory database (zero-config demo) |
| Maven | Build tool & dependency management |
| JUnit 5 + Mockito | Unit testing |
| AssertJ | Fluent test assertions |

### Frontend

| Technology | Role |
|-----------|------|
| Angular 17 | SPA framework |
| TypeScript 5 | Language |
| Angular Router | Client-side routing with guards |
| ReactiveFormsModule | Form validation |
| HttpClientModule + Interceptors | API communication + JWT injection |
| Custom CSS Design System | Responsive, premium styling |

---

## 🏗️ Architecture

The application is built on a classic **layered architecture** with strict dependency rules:
Controllers → Services → Repositories. No layer may access a lower layer out of order.

```
┌──────────────────────────────────────────────────────────────┐
│                      Angular Frontend                        │
│  Components  →  Services  →  JwtInterceptor  →  API         │
└──────────────────────────┬───────────────────────────────────┘
                           │ HTTP + Bearer JWT
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                   Spring Boot API (8082)                     │
│                                                              │
│  Spring Security Filter (JwtAuthFilter)                      │
│       ↓                                                      │
│  Controllers  (request/response mapping only)                │
│       ↓                                                      │
│  Services     (all business logic + @Transactional)          │
│       ↓                                                      │
│  Repositories (Spring Data JPA + custom @Query)              │
│       ↓                                                      │
│  H2 In-Memory Database                                       │
└──────────────────────────────────────────────────────────────┘
```

**Key architectural decisions:**
- **DTOs everywhere** — Entities are never exposed in API responses. Dedicated request/response DTOs control the API contract.
- **Global Exception Handler** — A single `@ControllerAdvice` converts all domain exceptions into structured JSON error responses.
- **Stateless JWT** — No sessions, no cookies. Every request is independently authenticated via the `Authorization` header.
- **Transactional services** — `@Transactional(readOnly = true)` at the class level; `@Transactional` overrides on write methods.

> 📐 See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed diagrams of the JWT flow and booking state machine.

---

## 📁 Project Structure

```
hotel-reservation/
│
├── backend/                             # Spring Boot application
│   └── src/
│       ├── main/java/com/hotelreservation/
│       │   ├── config/                  # SecurityConfig (filter chain, CORS, BCrypt)
│       │   ├── controller/              # REST endpoints — no business logic here
│       │   │   ├── AuthController.java
│       │   │   ├── RoomController.java
│       │   │   ├── ReservationController.java
│       │   │   └── AdminController.java
│       │   ├── dto/
│       │   │   ├── request/             # Input DTOs with @Valid annotations
│       │   │   └── response/            # Output DTOs — shape the API contract
│       │   ├── exception/               # Typed exceptions + GlobalExceptionHandler
│       │   ├── mapper/                  # Entity ↔ DTO mapping classes
│       │   ├── model/                   # JPA entities (User, Room, Reservation)
│       │   ├── repository/              # Spring Data JPA repositories
│       │   ├── security/                # JwtUtil, JwtAuthFilter, UserDetailsServiceImpl
│       │   ├── service/                 # Business logic — AuthService, RoomService, etc.
│       │   └── HotelReservationApplication.java  # Entry point + data seeding
│       ├── test/                        # Unit tests (JUnit 5 + Mockito)
│       └── resources/
│           └── application.properties   # Configuration (DB, JWT, server port)
│
├── frontend/                            # Angular application
│   └── src/app/
│       ├── components/
│       │   ├── auth/                    # LoginComponent, SignupComponent
│       │   ├── home/                    # HomeComponent (landing page)
│       │   ├── room-list/               # RoomListComponent (browse rooms)
│       │   ├── reservation-form/        # ReservationFormComponent (booking)
│       │   ├── dashboard/               # DashboardComponent (user bookings)
│       │   ├── admin/                   # AdminComponent (full admin panel)
│       │   └── not-found/               # 404 page
│       ├── guards/
│       │   ├── auth.guard.ts            # Redirects unauthenticated users
│       │   └── admin.guard.ts           # Blocks non-admin users
│       ├── interceptors/
│       │   ├── jwt.interceptor.ts       # Attaches Bearer token to all requests
│       │   └── error.interceptor.ts     # Handles 401/403 globally
│       ├── models/                      # TypeScript interfaces (User, Room, Reservation)
│       └── services/                    # HttpClient services per domain
│
├── docs/
│   ├── API.md                           # Full API reference with curl examples
│   └── ARCHITECTURE.md                  # Architecture diagrams and decisions
│
├── .github/
│   ├── ISSUE_TEMPLATE/                  # Bug report & feature request templates
│   └── pull_request_template.md         # PR checklist
│
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
└── README.md
```

---

## 📡 API Reference

> Full documentation with request/response examples: [docs/API.md](docs/API.md)

### Quick Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | — | Register a new user |
| `POST` | `/api/auth/login` | — | Login and receive a JWT |
| `GET` | `/api/rooms` | — | List all rooms |
| `GET` | `/api/rooms/{id}` | — | Get room by ID |
| `POST` | `/api/reservations` | User | Create a reservation |
| `GET` | `/api/reservations/my` | User | Get current user's reservations |
| `DELETE` | `/api/reservations/{id}/cancel` | User | Cancel a reservation |
| `GET` | `/api/admin/stats` | Admin | Dashboard statistics |
| `GET` | `/api/admin/users` | Admin | List all users |
| `POST` | `/api/admin/rooms` | Admin | Create a room |
| `PUT` | `/api/admin/rooms/{id}` | Admin | Update a room |
| `DELETE` | `/api/admin/rooms/{id}` | Admin | Delete a room |
| `GET` | `/api/admin/reservations` | Admin | List all reservations |
| `PUT` | `/api/admin/reservations/{id}/status` | Admin | Update reservation status |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| [Java JDK](https://openjdk.org/) | 17 or higher |
| [Maven](https://maven.apache.org/) | 3.8+ |
| [Node.js](https://nodejs.org/) | 18 LTS or higher |
| [Angular CLI](https://angular.io/cli) | 17+ |

### 1. Clone the Repository

```bash
git clone https://github.com/AmineNekhla/hotel-reservation.git
cd hotel-reservation
```

### 2. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The API will be running at **`http://localhost:8082`**.
The H2 console is available at **`http://localhost:8082/h2-console`**
(JDBC URL: `jdbc:h2:mem:hoteldb`, user: `sa`, password: empty).

**On startup, the application automatically seeds:**
- 5 hotel rooms (Single, Double, Suite, Deluxe, Family)
- 1 admin account (`admin@hotel.com` / `admin123`)

### 3. Start the Frontend

```bash
# In a separate terminal
cd frontend
npm install
ng serve
```

Open your browser at **`http://localhost:4200`**.

---

## 🧪 Testing

Unit tests are located in `backend/src/test/` and run with:

```bash
cd backend
mvn test
```

**Test coverage includes:**

| Test Class | What is Tested |
|-----------|----------------|
| `ReservationServiceTest` | Date validation, overlap detection, authorization, cancellation |
| `AuthServiceTest` | Duplicate email detection, password encoding, role assignment |

Tests use **JUnit 5 + Mockito** and run without Spring context (pure unit tests, fast execution).

---

## 🔐 Security

| Mechanism | Implementation |
|-----------|---------------|
| **Authentication** | Stateless JWT (HS256), validated on every request by `JwtAuthFilter` |
| **Authorization** | Spring Security role-based: `ROLE_USER` and `ROLE_ADMIN` |
| **Password Hashing** | BCrypt (strength 10) — passwords never stored in plain text |
| **Input Validation** | Jakarta Bean Validation on all request DTOs |
| **CORS** | Configured to allow only `http://localhost:4200` in development |
| **Error Messages** | Sanitized error responses — internal stack traces never leaked |

> ⚠️ The JWT secret in `application.properties` is a **development placeholder**.
> In production, inject it via `APP_JWT_SECRET` environment variable.
> See [SECURITY.md](SECURITY.md) for the full security policy.

---

## 🎓 Skills Demonstrated

This project was built to showcase the following competencies:

**Backend**
- ✅ Clean layered architecture (Controller → Service → Repository)
- ✅ SOLID principles: SRP, DIP (constructor injection), OCP (typed exceptions)
- ✅ JWT stateless authentication with Spring Security 6
- ✅ DTO pattern with dedicated Request/Response objects and Mapper classes
- ✅ Global exception handling with `@ControllerAdvice`
- ✅ Jakarta Bean Validation on all API inputs
- ✅ Custom `@Query` JPQL for efficient overlap detection and counting
- ✅ `@Transactional` management (readOnly + write overrides)
- ✅ Unit testing with JUnit 5, Mockito, and AssertJ

**Frontend**
- ✅ Angular reactive forms with inline validation
- ✅ JWT interceptor for transparent authentication
- ✅ Error interceptor for global 401/403 handling
- ✅ Route guards (`AuthGuard`, `AdminGuard`)
- ✅ CSS custom properties design system (responsive, accessible)

**Engineering Practices**
- ✅ Conventional commits (`feat:`, `fix:`, `refactor:`, etc.)
- ✅ Semantic Versioning (CHANGELOG.md)
- ✅ Professional GitHub repository (CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, PR templates)
- ✅ Architecture documentation with diagrams
- ✅ Full API documentation with request/response examples

---

## 🔮 Roadmap

| Feature | Status |
|---------|--------|
| JWT Refresh Token | 📋 Planned |
| Email confirmation on booking | 📋 Planned |
| Stripe payment integration | 📋 Planned |
| Docker + Docker Compose | 📋 Planned |
| Cloud deployment (Railway / AWS) | 📋 Planned |
| Advanced analytics dashboard | 📋 Planned |

---

## 👤 Author

**Amine Nekhla**

[![GitHub](https://img.shields.io/badge/GitHub-AmineNekhla-181717?style=flat-square&logo=github)](https://github.com/AmineNekhla)

> 🎓 Software Engineering Student | Seeking internship opportunities at top software companies.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

*Built with ❤️ by Amine Nekhla — feedback and contributions welcome!*

[⭐ Star this repo](https://github.com/AmineNekhla/hotel-reservation) · [🐛 Report a bug](https://github.com/AmineNekhla/hotel-reservation/issues/new?template=bug_report.md) · [💡 Request a feature](https://github.com/AmineNekhla/hotel-reservation/issues/new?template=feature_request.md)

</div>
