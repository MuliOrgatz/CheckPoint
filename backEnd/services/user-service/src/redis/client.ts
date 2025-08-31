import Redis from 'ioredis';

export const redis = new Redis(
  process.env.REDIS_URL || 'redis://localhost:6379'
);
export const redisSubscriber = new Redis(
  process.env.REDIS_URL || 'redis://localhost:6379'
);

export async function initRedis() {
  redis.on('error', (e) => console.error('Redis error', e));
  redisSubscriber.on('error', (e) => console.error('Redis sub error', e));
}

export async function publish(channel: string, message: unknown) {
  await redis.publish(channel, JSON.stringify(message));
}

export default redis;
