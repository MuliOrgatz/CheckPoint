import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../utils/validateRequest';
import {
  login,
  refreshAccessToken,
  register,
} from '../controllers/auth.controller';

const router = Router();
/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */

router.post(
  '/register',
  [
    body('username').isString().isLength({ min: 3 }),
    body('password').isString().isLength({ min: 6 }),
    body('email').isEmail(),
    validateRequest,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, email } = req.body;
    try {
      const user = await register(username, password, email);
      res.json(user);
    } catch (err: any) {
      next(err);
    }
  }
);
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */

router.post(
  '/login',
  [
    body('username').isString().isLength({ min: 3 }),
    body('password').isString().isLength({ min: 6 }),
    validateRequest,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try {
      const user = await login(username, password);
      res.json(user);
    } catch (err: any) {
      next(err);
    }
  }
);
/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid or expired refresh token
 */

router.post(
  '/refresh',
  [body('refreshToken').isString().notEmpty(), validateRequest],
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    try {
      const accessToken = await refreshAccessToken(refreshToken);
      res.json({ accessToken });
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
