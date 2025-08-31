# Room Booking Platform Frontend

This is the React + TypeScript frontend for the Room Booking Platform.

## Features

- User registration & login
- Search for available rooms (with filters and pagination)
- Book rooms with real-time availability
- View upcoming bookings
- Responsive UI with Tailwind CSS
- State management via Redux Toolkit

## Setup

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. The app will run at [http://localhost:3000](http://localhost:3000).

## Configuration

- API endpoints are configured in [`src/environment/environment.dev.ts`](src/environment/environment.dev.ts).
- By default, the frontend connects to:
  - User Service: [http://localhost:3001](http://localhost:3001)
  - Booking Service: [http://localhost:3002](http://localhost:3002)
- Update these URLs if your backend runs elsewhere.

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

## Tech Stack

- React
- TypeScript
- Redux Toolkit
- Axios
- Tailwind CSS
- Framer Motion
- Socket.IO (for real-time booking updates)

## Project Structure

```
src/
  components/      # UI and feature components
  pages/           # Route pages
  models/          # TypeScript models
  services/        # API service layer
  store/           # Redux store and slices
  utils/           # Utility functions
  environment/     # Environment configs
```

## Notes

- Make sure the backend services are running on ports 3001 and 3002.
- Real-time booking updates are handled via Socket.IO from the Booking
