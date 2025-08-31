# Room Booking Platform

A scalable and fault-tolerant Room Booking Platform built with React (TypeScript) for the frontend and Node.js (TypeScript) for the backend.  
Supports user registration, room search, and booking across two microservices.

---

## 1. High-Level Architecture

The platform consists of:

- **Frontend**: React SPA (TypeScript) for user interaction.
- **Backend Microservices**:
  - **User Service**: Handles registration, authentication, and user management.
  - **Booking Service**: Manages room search, booking, and real-time updates.
- **Database**: PostgreSQL for persistent storage (separate DBs for each service).
- **Cache & Locking**: Redis for caching search results and distributed locking for bookings.
- **WebSocket**: Socket.IO for real-time booking updates to the frontend.
- **Load Balancer**: Distributes traffic across backend instances for fault tolerance and scalability.
- **Multi-Region Deployment**: Stateless services and replicated databases/caches allow deployment across multiple regions for high availability.
- **Rate Limiting**: Protects APIs from abuse using Redis-backed rate limiting.

<img width="1347" height="876" alt="image" src="https://github.com/user-attachments/assets/c6c9eb30-be82-45f1-9bcf-575aa7f4926f" />

---

## 2. API Design

### Key Endpoints

#### User Service (`http://localhost:3001`)

- `POST /auth/register`  
  Registers a new user.  
  **Request:** `{ username, email, password }`  
  **Response:** `{ user, accessToken, refreshToken }`
- `POST /auth/login`  
  Authenticates user.  
  **Request:** `{ email, password }`  
  **Response:** `{ user, accessToken, refreshToken }`
- `POST /auth/refresh`  
  Refreshes JWT access token using a valid refresh token.  
  **Request:** `{ refreshToken }`  
  **Response:** `{ accessToken }`
- `GET /users/:id`  
  Retrieves user profile by ID (JWT required).  
  **Request:** URL param `id`  
  **Response:** `{ id, username, email }`

#### Booking Service (`http://localhost:3002`)

- `GET /rooms/search`  
  Search for available rooms.  
  **Request:** Query params for filters (date, text(location,name), limit,offset) (JWT required)  
  **Response:** `[{ roomId, name, location, capacity, pricePerNight }]`
- `POST /bookings`  
  Book a room.  
  **Request:** `{ roomId,  start, end }` (JWT required)  
  **Response:** `{ bookingId, status, start, end, roomObject }`
- `GET /bookings/upcoming/:userId`  
  Retrieve upcoming bookings for a user.  
  **Request:** URL param `userId` (JWT required)  
  **Response:** `[{ bookingId, roomId, start, end, status, roomObject }]`
- **WebSocket (`ws://localhost:3002`)**  
  Real-time updates for booking status and room availability.

### Authentication

- JWT tokens required for protected endpoints.
- Token sent in `Authorization: Bearer <token>` header.

### Rate Limiting

- Per-IP and per-user limits enforced via Redis.

---

## 3. Database Schema

### Users Table

| Field    | Type    | Indexes    |
| -------- | ------- | ---------- |
| id       | UUID    | PK, unique |
| username | VARCHAR | unique     |
| email    | VARCHAR | unique     |
| password | VARCHAR |            |

### Rooms Table

| Field         | Type    | Indexes    |
| ------------- | ------- | ---------- |
| id            | UUID    | PK, unique |
| name          | VARCHAR |            |
| location      | VARCHAR | index      |
| pricePerNight | DECIMAL |            |

### Bookings Table

| Field      | Type                           | Indexes    |
| ---------- | ------------------------------ | ---------- |
| id         | UUID                           | PK, unique |
| user_id    | UUID                           | FK, index  |
| room_id    | UUID                           | FK, index  |
| start_time | DATEONLY                       |            |
| end_time   | DATEONLY                       |            |
| status     | ENUM('confirmed', 'cancelled') |            |

### RefreshTokens Table

| Field      | Type      | Indexes    |
| ---------- | --------- | ---------- |
| id         | UUID      | PK, unique |
| user_id    | UUID      | FK, index  |
| token      | VARCHAR   | unique     |
| expires_at | TIMESTAMP |            |

- **Relationships**: Bookings reference users and rooms.
- **Indexes**: On `room_id`, `date`, and `user_id` for fast lookups.
- **Consistency**: Transactions ensure atomic booking creation.

---

## 4. Concurrency Handling

- **Distributed Locking**: Redis locks per room per time slot prevent double-booking.
- **Transactions**: Booking creation and availability checks are wrapped in DB transactions.
- **Optimistic Concurrency**: If a booking fails due to a race condition, the user receives an error and can retry.

---

## 5. Scalability Strategies

- **Caching**: Room search results cached in Redis for fast repeated queries.
- **Replication**: PostgreSQL and Redis can be replicated for high availability.
- **Load Balancing**: Requests distributed across multiple backend instances.
- **Stateless Services**: Enables horizontal scaling and multi-region deployment.
- **WebSocket Scaling**: Socket.IO can be scaled using Redis pub/sub for real-time updates across instances.

---

## 6. Optional Components

- **Monitoring**: Integrated with tools like Prometheus and Grafana for metrics.
- **Logging**: Centralized logging using Winston or similar libraries.
- **Notifications**: Booking confirmation emails via SMTP with RabbitMQ.
- **Analytics**: Event tracking for user actions and booking trends.
- **API Documentation**: Swagger UI available at `/api-docs` for each service.

---

## Project Structure

```
room-booking-platform/
├── frontend/   # React TypeScript SPA
└── backend/    # Node.js TypeScript API
```

## Features

- User registration & authentication
- Room search & availability
- Room booking (with concurrency control)
- Rate limiting
- Scalable, multi-region ready architecture

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL
- Redis

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/MuliOrgatz/room-booking-platform.git
   cd room-booking-platform
   ```

2. Follow setup instructions in `frontend/README.md` and `backend/README.md`.

## License

MIT
