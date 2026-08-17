import { Request, Response, NextFunction } from 'express';
import { body, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validation.middleware';
import { AnalyticsController } from '../controllers/analytics.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';
import { pageVisitTracker, getMostVisitedPages, getPageVisitTrends, getMostFollowedProperties } from '../middleware/pageVisitTracker.middleware'

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const analyticsService = new (require('../services/analytics.service').AnalyticsService)(prisma, notificationService);
const controller = new AnalyticsController(analyticsService);

const router = require('express').Router();

router.use(pageVisitTracker);

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

router.get('/most-visited', authenticate, requireRole(['ADMIN']), validateQuery([
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
]), async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await getMostVisitedPages(limit, req.query.startDate as string, req.query.endDate as string);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch most visited pages' });
  }
});

router.get('/visit-trends', authenticate, requireRole(['ADMIN']), validateQuery([
  query('days').optional().isInt({ min: 1, max: 365 }),
]), async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const result = await getPageVisitTrends(days);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch visit trends' });
  }
});

router.get('/most-followed', authenticate, requireRole(['ADMIN']), validateQuery([
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await getMostFollowedProperties(limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch most followed properties' });
  }
});

export default router;
