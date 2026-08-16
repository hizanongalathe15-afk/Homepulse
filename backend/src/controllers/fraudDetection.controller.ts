import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { FraudDetectionService } from '../services/fraudDetection.service';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const fraudService = new FraudDetectionService(prisma, notificationService);

export class FraudDetectionController {
  private fraudService: FraudDetectionService;

  constructor(fraudService?: FraudDetectionService) {
    this.fraudService = fraudService || new FraudDetectionService(prisma, notificationService);
  }

  detectSuspiciousActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.fraudService.detectSuspiciousActivity(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  reportFraud = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.fraudService.reportFraud(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getFraudReports = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.fraudService.getFraudReports(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
