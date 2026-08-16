import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { ReviewService } from '../services/review.service';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const reviewService = new ReviewService(prisma, notificationService);

export class ReviewController {
  private reviewService: ReviewService;

  constructor(reviewService?: ReviewService) {
    this.reviewService = reviewService || new ReviewService(prisma, notificationService);
  }

  createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.reviewService.createReview(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.reviewService.getReviews(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.reviewService.getReview(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.reviewService.updateReview(req.params.id as string, userId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.reviewService.deleteReview(req.params.id as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  markHelpful = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.reviewService.markHelpful(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  unmarkHelpful = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.reviewService.unmarkHelpful(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  reportReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.reviewService.reportReview(req.params.id as string, userId, req.body.reason, req.body.details);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getReviewStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.reviewService.getReviewStats(req.params.targetId as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
