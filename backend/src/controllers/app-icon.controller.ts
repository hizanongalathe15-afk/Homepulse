import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppIconService } from '../services/app-icon.service';
import { NotificationService } from '../services/notification.service';

const prisma = new PrismaClient();
const notificationService = new (require('../services/notification.service').NotificationService)(prisma, new (require('../services/email.service').EmailService)(), new (require('../services/sms.service').SmsService)());
const appIconService = new AppIconService(prisma);

export class AppIconController {
  private appIconService: AppIconService;

  constructor(prisma?: PrismaClient, notificationService?: NotificationService) {
    this.appIconService = appIconService;
  }

  setAppIconState = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.appIconService.setAppIconState(userId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getAppIconState = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.appIconService.getAppIconState(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
