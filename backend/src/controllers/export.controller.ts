import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { ExportService } from '../services/export.service';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const exportService = new ExportService(prisma, notificationService);

export class ExportController {
  private exportService: ExportService;

  constructor(exportService?: ExportService) {
    this.exportService = exportService || new ExportService(prisma, notificationService);
  }

  exportProperties = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.exportService.exportProperties(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  exportPayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.exportService.exportPayments(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  exportMaintenanceReports = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.exportService.exportMaintenanceReports(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
