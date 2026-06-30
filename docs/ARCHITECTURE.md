# Architecture Overview — LuxeStay Hotel Reservation System

## System Architecture

LuxeStay follows a **classic client-server architecture** with a clear separation between
the Angular SPA frontend and the Spring Boot REST API backend.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Browser (Angular SPA)                          │
│  ┌──────────┐  ┌───────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │ Components│  │  Services │  │ Interceptors  │  │ Route Guards    │  │
│  │ (UI/UX)  │→ │ (HTTP)    │→ │ JWT / Error   │  │ Auth / Admin    │  │
│  └──────────┘  └───────────┘  └───────────────┘  └─────────────────┘  │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │ HTTPS  (Bearer JWT)
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     Spring Boot REST API (Port 8082)                   │
│                                                                         │
│  ┌──────────────────┐                                                   │
│  │  Spring Security │ ← JwtAuthFilter validates every request          │
│  │  Filter Chain    │                                                   │
│  └────────┬─────────┘                                                   │
│           │                                                             │
│  ┌────────▼──────────────────────────────────────────────────────────┐  │
│  │                         Controllers                               │  │
│  │  AuthController │ RoomController │ ReservationController │ Admin  │  │
│  └────────┬──────────────────────────────────────────────────────────┘  │
│           │                                                             │
│  ┌────────▼──────────────────────────────────────────────────────────┐  │
│  │                          Services                                 │  │
│  │  AuthService │ RoomService │ ReservationService │ AdminService    │  │
│  └────────┬──────────────────────────────────────────────────────────┘  │
│           │                                                             │
│  ┌────────▼──────────────────────────────────────────────────────────┐  │
│  │                        Repositories                               │  │
│  │      UserRepository │ RoomRepository │ ReservationRepository      │  │
│  └────────┬──────────────────────────────────────────────────────────┘  │
│           │                                                             │
│  ┌────────▼─────────────┐                                               │
│  │   H2 In-Memory DB    │ (swap for PostgreSQL in production)          │
│  └──────────────────────┘                                               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Backend Layer Responsibilities

### Controller Layer
- Accepts HTTP requests and delegates to services.
- Responsible only for: request parsing, validation, and response shaping.
- Never contains business logic or direct repository access.

### Service Layer
- Contains **all** business logic.
- `@Transactional` on write methods ensures atomicity.
- Throws typed exceptions (`ResourceNotFoundException`, `ConflictException`, etc.) that are caught by the global handler.

### Repository Layer
- Spring Data JPA repositories with derived queries and custom `@Query` JPQL where needed.
- No native SQL — all queries are database-agnostic.

### DTO / Mapper Layer
- Entities are **never** exposed directly in API responses.
- Request DTOs carry validation annotations (`@NotBlank`, `@Min`, `@Email`).
- Mapper classes translate between entities and DTOs.

---

## JWT Authentication Flow

```
Client                        Server
  │                              │
  │  POST /api/auth/login        │
  │  { email, password }         │
  │ ───────────────────────────► │
  │                              │ AuthenticationManager.authenticate()
  │                              │ PasswordEncoder.matches()
  │                              │ JwtUtil.generateToken()
  │  { token, role, name }       │
  │ ◄─────────────────────────── │
  │                              │
  │  GET /api/reservations/my    │
  │  Authorization: Bearer <jwt> │
  │ ───────────────────────────► │
  │                              │ JwtAuthFilter.doFilterInternal()
  │                              │ → JwtUtil.validateToken()
  │                              │ → SecurityContextHolder.setAuthentication()
  │                              │ → Controller.getMyReservations()
  │  [ Reservation[] ]           │
  │ ◄─────────────────────────── │
```

---

## Booking State Machine

Reservations follow a strict lifecycle managed by the admin:

```
                ┌─────────┐
     Created →  │ PENDING │
                └────┬────┘
                     │
          ┌──────────┼──────────┐
          ▼                     ▼
    ┌───────────┐         ┌───────────┐
    │ CONFIRMED │         │ CANCELLED │
    └───────────┘         └───────────┘
          │
          ▼
    ┌───────────┐
    │ CANCELLED │  (owner or admin can cancel a CONFIRMED booking)
    └───────────┘
```

---

## Frontend Architecture

```
src/app/
├── components/        # Feature modules (auth, rooms, reservation, dashboard, admin)
├── guards/            # AuthGuard, AdminGuard — protect routes
├── interceptors/      # JwtInterceptor (attach token), ErrorInterceptor (handle 401/403)
├── models/            # TypeScript interfaces matching backend DTOs
└── services/          # HTTP clients for each backend domain
```

### Data Flow (Frontend)
```
User Action → Component → Service (HttpClient) → [JwtInterceptor] → API
                       ←            ← Observable ←                  ←
```

---

## Key Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Auth strategy | Stateless JWT | No session state, scales horizontally |
| Database | H2 in-memory | Zero-config demo; swap to PostgreSQL for prod |
| Password hashing | BCrypt (strength 10) | Industry standard |
| Role storage | DB field + JWT claim | Simple RBAC for two roles |
| ORM | Spring Data JPA | Reduces boilerplate, database-agnostic |
| API style | REST with `ResponseEntity<T>` | Explicit HTTP semantics |
| Validation | Jakarta Bean Validation on DTOs | Fail-fast at the boundary |
| Error handling | Global `@ControllerAdvice` | Single source of truth for error shapes |
