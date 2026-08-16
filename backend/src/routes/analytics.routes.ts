import { Request, Response, NextFunction } from 'express';
import { body, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validation.middleware';
import { AnalyticsController } from '../controllers/analytics.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const analyticsService = new (require('../services/analytics.service').AnalyticsService)(prisma, notificationService);
const controller = new AnalyticsController(analyticsService);

const router = require('express').Router();

router.post('/events', authenticate, validateBody([
  body('eventType').notEmpty().withMessage('Event type is required'),
  body('entityType').optional().isString(),
  body('entityId').optional().isString(),
]), controller.recordEvent);

router.get('/property/:propertyId', authenticate, controller.getPropertyAnalytics);

router.get('/platform', authenticate, requireRole(['ADMIN', 'ADMIN']), validateQuery([
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
]), controller.getPlatformAnalytics);

router.get('/user/activity', authenticate, validateQuery([
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getUserActivity);

router.get('/revenue', authenticate, requireRole(['ADMIN', 'ADMIN']), validateQuery([
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
]), controller.getRevenueAnalytics);

export default router;
