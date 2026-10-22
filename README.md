# LuxeStay — Hotel Reservation System

A full-stack hotel booking app built with Spring Boot 3 and Angular 17. I built this to practice building a proper layered backend with JWT auth and connect it to an Angular frontend.

## What it does

**For guests:**
- Register and log in with JWT
- Browse available rooms
- Book a room with check-in/check-out dates (overlap conflicts are caught)
- View and cancel your own reservations

**For admins:**
- Dashboard with occupancy stats
- Manage rooms (create, update, delete)
- Review and approve/reject pending bookings
- Manage user accounts

## Tech stack

- **Backend:** Java 17, Spring Boot 3.2, Spring Security 6, Spring Data JPA, H2 (in-memory), JUnit 5 + Mockito
- **Frontend:** Angular 17, TypeScript, Reactive Forms, custom CSS

## Running it locally

**Backend:**
`cd backend
mvn spring-boot:run
`
API runs at http://localhost:8082. H2 console at http://localhost:8082/h2-console (JDBC: jdbc:h2:mem:hoteldb, user: sa, no password).

On startup it seeds 5 rooms and one admin account automatically.

**Frontend:**
`cd frontend
npm install
ng serve
`
Open http://localhost:4200.

**Default credentials:**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hotel.com | admin123 |
| User | test@example.com | password123 |

## Tests

`cd backend
mvn test
`

16 unit tests covering booking logic, date validation, overlap detection, and auth flows.

## Project structure

`
hotel-reservation/
├── backend/
│   └── src/main/java/com/hotelreservation/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── dto/
│       ├── security/
│       └── exception/
├── frontend/
│   └── src/app/
│       ├── components/
│       ├── guards/
│       ├── interceptors/
│       └── services/
└── docs/
`

## Notes

Used H2 in-memory DB to keep setup zero-config. JWT secret in pplication.properties is just a dev placeholder — in a real deployment you'd inject it via environment variable.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
