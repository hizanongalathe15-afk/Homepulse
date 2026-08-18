import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ExportService } from '../services/export.service';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const exportService = new ExportService(prisma, notificationService);

export class DataPortabilityController {
  private exportService: ExportService;

  constructor(prisma?: PrismaClient, notificationService?: NotificationService, emailService?: EmailService, smsService?: SmsService) {
    this.exportService = exportService;
  }

  requestExport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.exportService.requestUserDataExport(userId, req.body.format);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getExportStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.exportService.getExportStatus(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  requestDeletion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.exportService.requestDataDeletion(userId, req.body.reason);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getDeleteStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.exportService.getDeleteStatus(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  cancelDeletion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.exportService.cancelDeletion(req.body.requestId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
