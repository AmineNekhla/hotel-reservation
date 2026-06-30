# API Reference — LuxeStay Hotel Reservation System

Base URL: `http://localhost:8082`

All protected endpoints require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Table of Contents

- [Authentication](#authentication)
- [Rooms](#rooms)
- [Reservations](#reservations)
- [Admin](#admin)
- [Error Responses](#error-responses)

---

## Authentication

### Register a new user

```http
POST /api/auth/register
Content-Type: application/json
```

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 555 123 4567",
  "password": "securePassword123"
}
```

**Response `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER"
}
```

**Error — Email already in use `409 Conflict`:**
```json
{
  "status": 409,
  "error": "Conflict",
  "message": "Email already in use",
  "path": "/api/auth/register"
}
```

---

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

**Request body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER"
}
```

**Error — Invalid credentials `403 Forbidden`**

---

## Rooms

### Get all rooms

```http
GET /api/rooms
```

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "roomNumber": "101",
    "type": "Single",
    "description": "Cozy room for solo travelers.",
    "price": 50.0,
    "capacity": 1,
    "availability": true,
    "imageUrl": "https://images.unsplash.com/..."
  }
]
```

---

### Get room by ID

```http
GET /api/rooms/{id}
```

**Response `200 OK`:** Single room object (same shape as above).

**Error — Not found `404 Not Found`:**
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Room not found with id: 99",
  "path": "/api/rooms/99"
}
```

---

## Reservations

> 🔐 All endpoints require authentication.

### Create a reservation

```http
POST /api/reservations
Authorization: Bearer <token>
Content-Type: application/json
```

**Request body:**
```json
{
  "roomId": 1,
  "startDate": "2025-09-01",
  "endDate": "2025-09-05"
}
```

**Response `200 OK`:**
```json
{
  "id": 1,
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com" },
  "room": { "id": 1, "type": "Single", "roomNumber": "101" },
  "startDate": "2025-09-01",
  "endDate": "2025-09-05",
  "status": "PENDING",
  "createdAt": "2025-06-30T12:00:00"
}
```

**Error — Overlapping booking `409 Conflict`:**
```json
{
  "status": 409,
  "error": "Conflict",
  "message": "Room is already booked for the selected dates",
  "path": "/api/reservations"
}
```

**Error — Invalid dates `400 Bad Request`:**
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Check-in date must be strictly before check-out date",
  "path": "/api/reservations"
}
```

---

### Get my reservations

```http
GET /api/reservations/my
Authorization: Bearer <token>
```

**Response `200 OK`:** Array of reservation objects belonging to the authenticated user.

---

### Cancel a reservation

```http
DELETE /api/reservations/{id}/cancel
Authorization: Bearer <token>
```

**Response `204 No Content`**

**Error — Not authorized `400 Bad Request`:**
```json
{
  "status": 400,
  "message": "You do not have permission to cancel this reservation"
}
```

---

## Admin

> 🔐 All endpoints require `ADMIN` role.

### Get dashboard statistics

```http
GET /api/admin/stats
Authorization: Bearer <admin-token>
```

**Response `200 OK`:**
```json
{
  "totalUsers": 12,
  "totalRooms": 5,
  "availableRooms": 3,
  "occupiedRooms": 2,
  "totalReservations": 24,
  "pendingReservations": 4,
  "confirmedReservations": 18,
  "cancelledReservations": 2
}
```

---

### Get all users

```http
GET /api/admin/users
Authorization: Bearer <admin-token>
```

---

### Delete a user

```http
DELETE /api/admin/users/{id}
Authorization: Bearer <admin-token>
```

**Response `204 No Content`**

---

### Create a room

```http
POST /api/admin/rooms
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request body:**
```json
{
  "roomNumber": "501",
  "type": "Penthouse Suite",
  "description": "The ultimate luxury experience with panoramic city views.",
  "price": 350.0,
  "capacity": 4,
  "imageUrl": "https://images.unsplash.com/..."
}
```

---

### Update a room

```http
PUT /api/admin/rooms/{id}
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request body:** Same shape as Create Room.

---

### Delete a room

```http
DELETE /api/admin/rooms/{id}
Authorization: Bearer <admin-token>
```

**Response `204 No Content`**

---

### Get all reservations

```http
GET /api/admin/reservations
Authorization: Bearer <admin-token>
```

---

### Update reservation status

```http
PUT /api/admin/reservations/{id}/status?status=CONFIRMED
Authorization: Bearer <admin-token>
```

Valid values for `status`: `PENDING`, `CONFIRMED`, `CANCELLED`

**Response `200 OK`:** Updated reservation object.

---

## Error Responses

All errors follow this structure:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Human-readable description of the error",
  "path": "/api/endpoint",
  "timestamp": "2025-06-30T12:00:00"
}
```

| HTTP Status | Meaning |
|-------------|---------|
| `400 Bad Request` | Invalid input or business rule violation |
| `401 Unauthorized` | Missing or expired JWT token |
| `403 Forbidden` | Valid token but insufficient role |
| `404 Not Found` | Resource does not exist |
| `409 Conflict` | Duplicate resource or scheduling conflict |
| `500 Internal Server Error` | Unexpected server-side error |
