import { Router, Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { validateRequest } from '../utils/validateRequest';
import {
  createBooking,
  getUpcomingBookingsForUser,
} from '../controllers/booking.controller';

const router = Router();

router.post(
  '/',
  [
    body('roomId').isInt(),
    body('start').isISO8601(),
    body('end').isISO8601(),
    validateRequest,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      /**
       * @openapi
       * /booking:
       *   post:
       *     security:
       *       - bearerAuth: []
       *     summary: Create a new booking
       *     tags:
       *       - Booking
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               roomId:
       *                 type: integer
       *               start:
       *                 type: string
       *                 format: date
       *               end:
       *                 type: string
       *                 format: date
       *     responses:
       *       200:
       *         description: Booking created
       *       400:
       *         description: Validation error
       *       401:
       *         description: Unauthorized
       *       409:
       *         description: Room not available
       */
      const { roomId, start, end } = req.body;
      const userId = (req as any).user?.id;
      if (!userId) {
        const err = new Error('Unauthorized');
        (err as any).status = 401;
        return next(err);
      }
      const booking = await createBooking({ userId, roomId, start, end });
      res.json({ booking });
    } catch (err: any) {
      next(err);
    }
  }
);

/**
 * @openapi
 * /booking/upcoming/{userId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all upcoming bookings for a user
 *     tags:
 *       - Booking
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of upcoming bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/upcoming/:userId',
  [param('userId').isInt(), validateRequest],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      const reqUserId = (req as any).user?.id;
      if (reqUserId == null) {
        const err = new Error('Unauthorized');
        (err as any).status = 401;
        return next(err);
      }
      if (Number(reqUserId) !== userId) {
        const err = new Error('Forbidden');
        (err as any).status = 403;
        return next(err);
      }
      const bookings = await getUpcomingBookingsForUser(userId);
      res.json(bookings);
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
