# 🏨 Hotel Reservation System

A modern, full-stack Hotel Reservation System designed with a **Spring Boot** backend and an **Angular** frontend. This application provides a platform for guests to search for available rooms, book reservations, and view their dashboard, while administrators can manage rooms and oversee all bookings.

---

## 🏗️ Project Architecture

The system is split into two independent modules:
1. **Backend (`/backend`)**: Built using Spring Boot (Java), implementing a clean 3-tier architecture (Controller, Service, Repository) with Spring Data JPA for persistence.
2. **Frontend (`/frontend`)**: Built using Angular (TypeScript), structured with modular components, services, and models for seamless client-side interaction.

---

## 🛠️ Tech Stack & Dependencies

### Backend
* **Language & Framework:** Java 17+, Spring Boot
* **Data Access:** Spring Data JPA
* **Database:** Relational Database (configured for H2 In-Memory / MySQL)
* **Build Tool:** Maven

### Frontend
* **Framework:** Angular 17+
* **Language:** TypeScript
* **Styling:** CSS3 & HTML5 (Vanilla CSS)
* **Package Manager:** npm

---

## 📁 Repository Structure

```directory
Hotel-Reservation/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/hotelreservation/
│   │       │   ├── controller/          # REST Endpoints (User, Room, Reservation)
│   │       │   ├── model/               # JPA Entities (User, Room, Reservation)
│   │       │   ├── repository/          # Spring Data JPA Repositories
│   │       │   ├── service/             # Business Logic Layer
│   │       │   └── HotelReservationApplication.java
│   │       └── resources/
│   │           └── application.properties # Database & App Configuration
│   └── pom.xml                          # Maven dependency configuration
│
└── frontend/
    ├── src/
    │   └── app/
    │       ├── components/              # UI Components (auth, dashboard, admin, room-list)
    │       ├── models/                  # TypeScript Types/Interfaces
    │       ├── services/                # API Services (authentication, rooms, bookings)
    │       ├── app-routing.module.ts    # Application Routing
    │       ├── app.component.ts         # Main App Component
    │       └── app.module.ts            # Angular Module definition
    ├── package.json                     # Node/Angular dependencies
    └── angular.json                     # Angular CLI workspace configurations
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed:
* [Java JDK 17 or higher](https://www.oracle.com/java/technologies/downloads/)
* [Node.js & npm](https://nodejs.org/) (LTS recommended)
* [Angular CLI](https://angular.io/cli) (installed globally via `npm install -g @angular/cli`)
* [Git](https://git-scm.com/)

---

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure the database in `src/main/resources/application.properties` (e.g., set up your H2 Console or MySQL connection string).
3. Build the project using Maven:
   ```bash
   mvn clean install
   ```
4. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *The backend server runs on `http://localhost:8080` by default.*

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

## 🔮 Future Enhancements (Roadmap)
* 🔐 **Authentication & Security:** Integration of Spring Security and JWT tokens to secure endpoints.
* 💳 **Payment Gateway:** Integration of Stripe/PayPal for booking payments.
* 📧 **Email Notifications:** Automatic emails on booking confirmations and updates.
* 📊 **Analytics Dashboard:** Graphical analytics for administrators regarding room bookings and revenue.

---

## 👥 Contributing
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.
