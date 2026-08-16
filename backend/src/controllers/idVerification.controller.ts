import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { IdVerificationService } from '../services/idVerification.service';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const idVerificationService = new IdVerificationService(prisma, notificationService);

export class IdVerificationController {
  private idVerificationService: IdVerificationService;

  constructor(idVerificationService?: IdVerificationService) {
    this.idVerificationService = idVerificationService || new IdVerificationService(prisma, notificationService);
  }

  submitVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.idVerificationService.submitVerification(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.idVerificationService.getVerification(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getMyVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.idVerificationService.getMyVerification(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  approveVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId = (req as any).user.id;
      const result = await this.idVerificationService.approveVerification(req.params.id as string, adminId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  rejectVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.idVerificationService.rejectVerification(req.params.id as string, req.body.reason);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getPendingVerifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.idVerificationService.getPendingVerifications(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
