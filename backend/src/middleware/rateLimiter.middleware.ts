import rateLimit from 'express-rate-limit';
import { logger } from '../config/logger.config';

export const rateLimiter = rateLimit({
  windowMs: Number(process.env['RATE_LIMIT_WINDOW_MS']) || 900000,
  max: Number(process.env['RATE_LIMIT_MAX_REQUESTS']) || 100,
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  windowMs: Number(process.env['RATE_LIMIT_AUTH_WINDOW_MS']) || 900000,
  max: Number(process.env['RATE_LIMIT_AUTH_MAX']) || 10,
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
