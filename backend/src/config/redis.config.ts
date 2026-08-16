import Redis from 'ioredis';
import { config } from './app.config';

const redisConfig = {
  host: process.env['REDIS_HOST'] || 'localhost',
  port: parseInt(process.env['REDIS_PORT'] || '6379', 10),
  password: process.env['REDIS_PASSWORD'] || undefined,
  db: parseInt(process.env['REDIS_DB'] || '0', 10),
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
};

export const redis = new Redis(redisConfig);

export const connectRedis = async (): Promise<void> => {
  try {
    await redis.connect();
    console.log('Redis connected successfully');
  } catch (error) {
    console.error('Redis connection failed:', error);
    if (config.env === 'production') {
      throw error;
    }
    console.warn('Redis not available, continuing without cache');
  }
};

export const disconnectRedis = async (): Promise<void> => {
  try {
    await redis.disconnect();
    console.log('Redis disconnected');
  } catch (error) {
    console.error('Redis disconnection error:', error);
  }
};

export const cache = {
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },
  set: async (key: string, value: unknown, ttl?: number): Promise<void> => {
    try {
      const serialized = JSON.stringify(value);
      const expiry = ttl || parseInt(process.env['REDIS_CACHE_TTL'] || '3600', 10);
      await redis.setex(key, expiry, serialized);
    } catch (error) {
      console.error('Redis cache set error:', error);
    }
  },
  del: async (key: string): Promise<void> => {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Redis cache del error:', error);
    }
  },
  delPattern: async (pattern: string): Promise<void> => {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Redis cache delPattern error:', error);
    }
  },
};

export default redis;
