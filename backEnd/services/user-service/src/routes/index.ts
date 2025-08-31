import express from 'express';
import authMiddleware from '../middleware/auth';

const router = express.Router();

// Import all routes
import userRouter from './user.routes';
import authRouter from './auth.routes';

// Use routes
router.use('/auth', authRouter);
router.use('/user', authMiddleware, userRouter);

export default router;
