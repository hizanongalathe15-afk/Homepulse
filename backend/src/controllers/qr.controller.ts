import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { QRCodeService } from '../services/qr.service';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const qrService = new QRCodeService(prisma, notificationService);

export class QRCodeController {
  private qrService: QRCodeService;

  constructor(qrService?: QRCodeService) {
    this.qrService = qrService || new QRCodeService(prisma, notificationService);
  }

  generateQRCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.qrService.generateQRCode(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  scanQRCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      const result = await this.qrService.scanQRCode(req.body.code, userId || 'anonymous');
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getMyQRCodes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.qrService.getMyQRCodes(userId, req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deactivateQRCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.qrService.deactivateQRCode(req.params.id as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getQRCodeStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.qrService.getQRCodeStats(req.params.propertyId as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
