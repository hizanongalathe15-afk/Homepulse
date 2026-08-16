import { Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateQuery } from '../middleware/validation.middleware';
import { AnalyticsService } from '../services/analytics.service';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const analyticsService = new AnalyticsService(prisma, notificationService);

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor(analyticsService?: AnalyticsService) {
    this.analyticsService = analyticsService || new AnalyticsService(prisma, notificationService);
  }

  recordEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      const result = await this.analyticsService.recordEvent(
        req.body.eventType,
        req.body.entityType,
        req.body.entityId,
        userId,
        req.body.metadata
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getPropertyAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.analyticsService.getPropertyAnalytics(req.params.propertyId as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getPlatformAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.analyticsService.getPlatformAnalytics(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getUserActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.analyticsService.getUserActivity(userId, req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getRevenueAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.analyticsService.getRevenueAnalytics(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
