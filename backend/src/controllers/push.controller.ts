import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { PushService } from '../services/push.service';
import { NotificationService } from '../services/notification.service';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const pushService = new PushService(notificationService);

export class PushController {
  private pushService: PushService;

  constructor(pushService?: PushService) {
    this.pushService = pushService || new PushService(notificationService);
  }

  sendPushNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.pushService.sendPushNotification({
        userId,
        title: req.body.title,
        body: req.body.body,
        data: req.body.data,
      });
      res.status(200).json({ success: result.success, data: result });
    } catch (error) {
      next(error);
    }
  };
}
