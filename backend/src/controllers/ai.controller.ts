import { Request, Response, NextFunction } from 'express';
import { body, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validation.middleware';
import { AiService } from '../services/ai.service';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const aiService = new AiService(prisma, notificationService);

export class AiController {
  private aiService: AiService;

  constructor(aiService?: AiService) {
    this.aiService = aiService || new AiService(prisma, notificationService);
  }

  generatePropertyDescription = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.aiService.generatePropertyDescription(req.body.title, req.body.type, req.body.features);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  suggestPropertyPrice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.aiService.suggestPropertyPrice(req.body.city, req.body.type, req.body.bedrooms, req.body.bathrooms, req.body.area);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  predictMaintenancePriority = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.aiService.predictMaintenancePriority(req.params.propertyId as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getChatbotResponse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.aiService.getChatbotResponse(req.body.query, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
