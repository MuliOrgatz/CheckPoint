import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { validateRequest } from '../utils/validateRequest';
import { searchRooms } from '../controllers/room.controller';
import redis from '../redis/client';

const router = Router();

router.get(
  '/search',
  [
    query('text').optional().isString(),
    query('start').optional().isISO8601(),
    query('end').optional().isISO8601(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
    validateRequest,
  ],
  /**
   * @openapi
   * /room/search:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     summary: Search for available rooms by text (location or name)
   *     tags:
   *       - Room
   *     parameters:
   *       - in: query
   *         name: text
   *         schema:
   *           type: string
   *         description: Search text for location or name
   *       - in: query
   *         name: start
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: end
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         description: Number of results per page
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           minimum: 0
   *         description: Number of results to skip (for pagination)
   *     responses:
   *       200:
   *         description: List of rooms
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 rooms:
   *                   type: array
   *                   items:
   *                     type: object
   *                 total:
   *                   type: integer
   *       400:
   *         description: Validation error
   */
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text, start, end, limit = 20, offset = 0 } = req.query as any;

      const key = `rooms:search:${JSON.stringify({
        text,
        start,
        end,
        limit,
        offset,
      })}`;
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      const result = await searchRooms({
        text,
        start,
        end,
        limit: limit ? Number(limit) : 20,
        offset: offset ? Number(offset) : 0,
      });

      await redis.set(key, JSON.stringify(result));
      await redis.expire(key, 30);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
