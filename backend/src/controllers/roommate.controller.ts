import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { RoommateMatchingService } from '../services/roommateMatching.service';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const roommateService = new RoommateMatchingService(prisma, notificationService);

export class RoommateController {
  private roommateService: RoommateMatchingService;

  constructor(roommateService?: RoommateMatchingService) {
    this.roommateService = roommateService || new RoommateMatchingService(prisma, notificationService);
  }

  createProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.roommateService.createProfile(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.roommateService.getProfile(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.roommateService.updateProfile(userId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  findMatches = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.roommateService.findMatches(userId, req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
