import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { ReferralService } from '../services/referral.service';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const referralService = new ReferralService(prisma, notificationService);

export class ReferralController {
  private referralService: ReferralService;

  constructor(referralService?: ReferralService) {
    this.referralService = referralService || new ReferralService(prisma, notificationService);
  }

  createReferral = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.referralService.createReferral(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getReferrals = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.referralService.getReferrals(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getReferral = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.referralService.getReferral(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  redeemReferral = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.referralService.redeemReferral(req.body.code, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getMyReferrals = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.referralService.getMyReferrals(userId, req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getReferralStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.referralService.getReferralStats(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
