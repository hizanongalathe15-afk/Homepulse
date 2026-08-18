import express, { Request, Response, NextFunction } from 'express';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { body, param, query } from 'express-validator';
import { AdminController } from '../controllers/admin.controller';
import { AdminService } from '../services/admin.service';
import { AnalyticsService } from '../services/analytics.service';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const analyticsService = new AnalyticsService(prisma);
const adminService = new AdminService(prisma, analyticsService, notificationService);
const adminController = new AdminController(adminService);

const router = express.Router();

router.get('/', optionalAuthenticate, validateQuery([
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role').optional().isString().withMessage('Role must be a string'),
  query('search').optional().isString().withMessage('Search must be a string'),
]), (req: Request, res: Response, next: NextFunction) => {
  adminController.getUsers(req, res, next);
});

router.get('/:id', optionalAuthenticate, validateParams([
  param('id').isString().withMessage('User ID is required'),
]), (req: Request, res: Response, next: NextFunction) => {
  adminController.getUser(req, res, next);
});

router.get('/:id/profile', optionalAuthenticate, validateParams([
  param('id').isString().withMessage('User ID is required'),
]), (req: Request, res: Response, next: NextFunction) => {
  next();
});

router.put('/:id', authenticate, validateParams([
  param('id').isString().withMessage('User ID is required'),
]), (req: Request, res: Response, next: NextFunction) => {
  adminController.updateUser(req, res, next);
});

router.post('/:id/verify', authenticate, validateParams([
  param('id').isString().withMessage('User ID is required'),
]), (req: Request, res: Response, next: NextFunction) => {
  next();
});

export default router;
