# 🏨 LuxeStay Hotel Reservation System

A modern, full-stack, enterprise-grade Hotel Reservation System designed with a **Spring Boot** backend and an **Angular** frontend. This application provides a platform for guests to search for available rooms, book reservations, and view their dashboard, while administrators can manage rooms and oversee all bookings through a dedicated admin panel.

---

## ✨ Features & Capabilities

- **Secure JWT Authentication:** Stateless JSON Web Tokens securely handle user sessions and role-based access control.
- **Role-Based Access (RBAC):** Distinct `USER` and `ADMIN` flows.
- **Premium UI/UX:** A custom-built, responsive design system utilizing CSS Grid/Flexbox and modern typography (Outfit & Inter fonts).
- **Clean Architecture:** Backend structured using Data Transfer Objects (DTOs), Mappers, and Global Exception Handling.

---

## 🏗️ Project Architecture

The system is split into two independent modules:
1. **Backend (`/backend`)**: Built using Spring Boot (Java 17), implementing Clean Architecture principles:
   - **Controllers:** REST endpoints secured with Spring Security & `JwtAuthFilter`.
   - **Services:** Business logic decoupled from data layers.
   - **Repositories:** Spring Data JPA for H2 persistence.
   - **DTOs & Mappers:** Clean separation between database entities and API payloads.
   - **Global Exception Handler:** Centralized `@ControllerAdvice` for structured error responses.

2. **Frontend (`/frontend`)**: Built using Angular (TypeScript), structured with modular components, services, and interceptors:
   - **Reactive Forms:** Robust client-side validation for auth and booking flows.
   - **Interceptors:** `JwtInterceptor` attaches tokens, and `ErrorInterceptor` gracefully handles 401/403 responses.
   - **Guards:** `AuthGuard` and `AdminGuard` protect client-side routes.

---

## 🛠️ Tech Stack & Dependencies

### Backend
* **Language & Framework:** Java 17+, Spring Boot 3
* **Security:** Spring Security, JWT (io.jsonwebtoken)
* **Data Access:** Spring Data JPA
* **Database:** H2 In-Memory Database (for easy local demonstration)
* **Build Tool:** Maven

### Frontend
* **Framework:** Angular 17+
* **Language:** TypeScript
* **Styling:** Custom Vanilla CSS Design System
* **Auth Management:** jwt-decode, HTTP Interceptors

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed:
* [Java JDK 17 or higher](https://www.oracle.com/java/technologies/downloads/)
* [Node.js & npm](https://nodejs.org/) (LTS recommended)
* [Angular CLI](https://angular.io/cli) (installed globally via `npm install -g @angular/cli`)

---

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build the project using Maven:
   ```bash
   mvn clean install
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *The backend server runs on `http://localhost:8082`.*

---

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install the project dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   ng serve
   ```
4. Open your browser and navigate to `http://localhost:4200`.

---

## 👥 Default Accounts
* **Admin:** `admin@hotel.com` / `admin123`
* **User:** `test@example.com` / `password123`

---

## 🔮 Future Enhancements (Roadmap)
* 💳 **Payment Gateway:** Integration of Stripe/PayPal for booking payments.
* 📧 **Email Notifications:** Automatic emails on booking confirmations and updates.
* ☁️ **Cloud Deployment:** Dockerizing the application and deploying to AWS/GCP.
