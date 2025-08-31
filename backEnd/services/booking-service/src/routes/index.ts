import express from 'express';
import bookingRouter from './booking.routes';
import roomRouter from './room.routes';

const router = express.Router();

// Import all routes

// Use routes
router.use('/booking', bookingRouter);
router.use('/room', roomRouter);

export default router;
