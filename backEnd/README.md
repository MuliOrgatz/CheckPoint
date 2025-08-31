# Room Booking Platform Backend

Node.js TypeScript backend for the Room Booking Platform.  
Handles user registration, authentication, room search, and booking.

## Features

- RESTful API
- JWT authentication
- Rate limiting
- Room booking with concurrency control
- PostgreSQL & Redis integration

## Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL
- Redis

## Install PostgreSQL

```sh
brew install postgresql
brew services start postgresql
```

Create the databases:

```sh
createdb user_service_db
createdb booking_service_db
```

## Install Redis

```sh
brew install redis
brew services start redis
```

Default Redis URL:  
`redis://localhost:6379`

## Connect to PostgreSQL

```sh
psql user_service_db
psql booking_service_db
```

## Setup

1. Install dependencies:

```sh
npm install
```

2. Configure environment variables:

- Copy `.env.example` to `.env` and fill in your DB/Redis credentials.
- Example Redis URL: `REDIS_URL=redis://localhost:6379`

3. Run database migrations (if using an ORM):

```sh
npm run migrate
```

4. Start the servers:

- User Service:
  ```sh
  npm run start:user
  ```
- Booking Service:
  ```sh
  npm run start:booking
  ```

## API Endpoints

- **User Service:** http://localhost:3001
- **Booking Service:** http://localhost:3002
- **Web socket:** http://localhost:3002

## API Documentation

- Swagger UI available at `/docs` endpoint for each service.

## Scripts

- `npm run start:user` — Start User Service
- `npm run start:booking` — Start Booking Service
- `npm run build` — Build for production
- `npm run test` — Run tests

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Redis
