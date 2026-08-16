import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { SafetyService } from '../services/safety.service';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const safetyService = new SafetyService(prisma, notificationService);

export class SafetyController {
  private safetyService: SafetyService;

  constructor(safetyService?: SafetyService) {
    this.safetyService = safetyService || new SafetyService(prisma, notificationService);
  }

  createSOSAlert = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.safetyService.createSOSAlert(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getSOSAlert = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.safetyService.getSOSAlert(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getMySOSAlerts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.safetyService.getMySOSAlerts(userId, req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  resolveSOSAlert = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.safetyService.resolveSOSAlert(req.params.id as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  createSafetyReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.safetyService.createSafetyReport(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getSafetyReports = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.safetyService.getSafetyReports(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  assignSafetyReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.safetyService.assignSafetyReport(req.params.id as string, req.body.assignedToId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  resolveSafetyReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.safetyService.resolveSafetyReport(req.params.id as string, req.body.resolution);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
