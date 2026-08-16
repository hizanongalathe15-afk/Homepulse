import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    timestamp: new Date().toISOString(),
    path: req.path,
  });
};

export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Global error:', err);

  if (err instanceof AppError) {
    const response: any = {
      success: false,
      error: err.message,
    };
    if (err.details) {
      response.details = err.details;
    }
    return res.status(err.statusCode).json(response);
  }

  return res.status(500).json({
    success: false,
    error: process.env['NODE_ENV'] === 'production' ? 'Internal server error' : err.message,
  });
};
