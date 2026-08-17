import express, { Request, Response, NextFunction } from 'express';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { body, param, query } from 'express-validator';
import { PropertyService } from '../services/property.service';
import { SearchService } from '../services/search.service';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';
import { NotificationService } from '../services/notification.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const searchService = new SearchService(prisma, notificationService);
const propertyService = new PropertyService(prisma, searchService, notificationService);

const router = express.Router();

router.get('/', optionalAuthenticate, validateQuery([
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role').optional().isString().withMessage('Role must be a string'),
  query('search').optional().isString().withMessage('Search must be a string'),
]), (req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({
    success: false,
    error: 'Users routes not yet implemented',
    timestamp: new Date().toISOString(),
    path: req.path,
  });
});

router.get('/:id', optionalAuthenticate, validateParams([
  param('id').isString().withMessage('User ID is required'),
]), (req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({
    success: false,
    error: 'Users routes not yet implemented',
    timestamp: new Date().toISOString(),
    path: req.path,
  });
});

router.get('/:id/profile', optionalAuthenticate, validateParams([
  param('id').isString().withMessage('User ID is required'),
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await propertyService.getLandlordPublicProfile(req.params.id as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, validateParams([
  param('id').isString().withMessage('User ID is required'),
]), (req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({
    success: false,
    error: 'Users routes not yet implemented',
    timestamp: new Date().toISOString(),
    path: req.path,
  });
});

router.post('/:id/verify', authenticate, validateParams([
  param('id').isString().withMessage('User ID is required'),
]), (req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({
    success: false,
    error: 'Users routes not yet implemented',
    timestamp: new Date().toISOString(),
    path: req.path,
  });
});

export default router;
