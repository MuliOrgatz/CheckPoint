/**
 * @openapi
 * /user/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get user data by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User data
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
import { Router, Request, Response, NextFunction } from 'express';
import { getUserData } from '../controllers/user.controller';
import { param } from 'express-validator';
import { validateRequest } from '../utils/validateRequest';

const router = Router();

router.get(
  '/:id',
  [param('id').isInt(), validateRequest],
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const user = await getUserData(id);
      res.json(user);
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
