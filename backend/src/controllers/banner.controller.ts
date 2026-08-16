import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { BannerService } from '../services/banner.service';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const bannerService = new BannerService(prisma, notificationService);

export class BannerController {
  private bannerService: BannerService;

  constructor(bannerService?: BannerService) {
    this.bannerService = bannerService || new BannerService(prisma, notificationService);
  }

  createBanner = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.bannerService.createBanner(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getBanners = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.bannerService.getBanners(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getBanner = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.bannerService.getBanner(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateBanner = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.bannerService.updateBanner(req.params.id as string, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteBanner = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.bannerService.deleteBanner(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  recordView = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const result = await this.bannerService.recordView(req.params.id as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  recordClick = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.bannerService.recordClick(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getBannerStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.bannerService.getBannerStats();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getActiveBanners = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      const result = await this.bannerService.getActiveBannersForUser(userId || 'anonymous');
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
