import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from '../redis/client';

const limiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'rlflx',
  points: 100,
  duration: 60,
});

export default async function rateLimiterMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const key = req.ip === '::1' ? '127.0.0.1' : req.ip ?? 'unknown-ip';
    await limiter.consume(key);
    return next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    return res.status(429).json({ error: 'Too Many Requests' });
  }
}
