# Room Booking Platform

A scalable and fault-tolerant Room Booking Platform built with React (TypeScript) for the frontend and Node.js (TypeScript) for the backend.  
Supports user registration, room search, and booking across two microservices.

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

## Architecture

- **Frontend:** React SPA (TypeScript)
- **Backend:** Node.js REST API (TypeScript), split into microservices
- **Database:** PostgreSQL
- **Cache/Locking:** Redis


<img width="1347" height="876" alt="image" src="https://github.com/user-attachments/assets/c6c9eb30-be82-45f1-9bcf-575aa7f4926f" />


## License

MIT
