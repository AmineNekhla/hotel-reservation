# Changelog

All notable changes to **LuxeStay Hotel Reservation System** are documented here.

This project adheres to [Semantic Versioning](https://semver.org/) and [Conventional Commits](https://www.conventionalcommits.org/).

---

## [Unreleased]

### Planned
- 💳 Stripe/PayPal payment gateway integration
- 📧 Email confirmation on booking (Spring Mail)
- 🐳 Docker + Docker Compose for full-stack containerization
- ☁️ AWS EC2 / Railway deployment
- 🔄 JWT refresh token support
- 📊 Advanced analytics dashboard for admins
- 🌍 Multi-language support (i18n)

---

## [1.0.0] — 2026-06-30

### ✨ Features — Initial Release

#### Backend (Spring Boot 3 / Java 17)
- `feat(auth)`: JWT-based stateless authentication with HS256 signing
- `feat(auth)`: Role-based access control — `ADMIN` and `USER` roles
- `feat(rooms)`: Full CRUD for room management (Admin only for write ops)
- `feat(reservations)`: Reservation creation with date validation
- `feat(reservations)`: Reservation cancellation by owner
- `feat(admin)`: Admin dashboard API with real-time stats (users, rooms, reservations)
- `feat(admin)`: Admin reservation status management (PENDING → CONFIRMED → CANCELLED)
- `feat(security)`: Spring Security filter chain with `JwtAuthFilter`
- `feat(security)`: CORS configuration for Angular frontend
- `feat(data)`: Automatic database seeding (rooms + admin user) on startup
- `feat(dto)`: Clean DTO/Mapper pattern for all API payloads
- `feat(exception)`: Global exception handler with structured error responses
- `feat(validation)`: Bean Validation on all request DTOs

#### Frontend (Angular 17 / TypeScript)
- `feat(ui)`: Responsive design system with CSS custom properties
- `feat(ui)`: Premium home page with hero section and feature cards
- `feat(ui)`: Room listing page with availability badges
- `feat(ui)`: Reservation booking form with date validation
- `feat(auth)`: Login and Registration forms with reactive validation
- `feat(dashboard)`: User booking history dashboard
- `feat(admin)`: Full admin panel (room management, user management, reservation oversight)
- `feat(security)`: JWT interceptor attaches Bearer tokens to all API requests
- `feat(security)`: Auth guard and Admin guard for route protection
- `feat(security)`: Error interceptor handles 401/403 responses gracefully

#### Repository
- `docs`: Complete README with architecture, API reference, installation guide
- `docs`: API documentation (`docs/API.md`)
- `docs`: Architecture documentation (`docs/ARCHITECTURE.md`)
- `chore`: MIT License
- `chore`: CONTRIBUTING.md with coding standards and PR process
- `chore`: CODE_OF_CONDUCT.md
- `chore`: SECURITY.md vulnerability reporting policy
- `chore`: Professional `.gitignore` for Java/Maven + Angular/Node

---

[Unreleased]: https://github.com/AmineNekhla/hotel-reservation/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/AmineNekhla/hotel-reservation/releases/tag/v1.0.0
