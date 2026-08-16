import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { NotificationService } from '../services/notification.service';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);

export class NotificationController {
  private notificationService: NotificationService;

  constructor(notificationService?: NotificationService) {
    this.notificationService = notificationService || new NotificationService(prisma, emailService, smsService);
  }

  getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.notificationService.getNotifications(userId, req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.notificationService.getUnreadCount(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.notificationService.markAsRead(req.params.id as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.notificationService.markAllAsRead(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.notificationService.deleteNotification(req.params.id as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  clearNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.notificationService.clearNotifications(userId, req.body.olderThan);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getPreferences = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.notificationService.getPreferences(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  updatePreferences = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.notificationService.updatePreferences(userId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  sendTestNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.notificationService.sendNotification({
        userId,
        type: 'TEST',
        title: req.body.title,
        message: req.body.message,
        channel: req.body.channel,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
