import { Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateQuery } from '../middleware/validation.middleware';
import { RecommendationService } from '../services/recommendation.service';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const recommendationService = new RecommendationService(prisma, notificationService);

export class RecommendationController {
  private recommendationService: RecommendationService;

  constructor(recommendationService?: RecommendationService) {
    this.recommendationService = recommendationService || new RecommendationService(prisma, notificationService);
  }

  getRecommendations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.recommendationService.getRecommendations(userId, req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getSimilarProperties = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.recommendationService.getSimilarProperties(req.params.id as string, Number(req.query.limit as string) || 5);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getTrendingProperties = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.recommendationService.getTrendingProperties(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
