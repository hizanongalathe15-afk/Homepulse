import { Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateQuery } from '../middleware/validation.middleware';
import { SearchService } from '../services/search.service';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const searchService = new SearchService(prisma, notificationService);

export class SearchController {
  private searchService: SearchService;

  constructor(searchService?: SearchService) {
    this.searchService = searchService || new SearchService(prisma, notificationService);
  }

  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.searchService.searchProperties(req.query.q as string || '', req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  advancedSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.searchService.advancedSearch(req.query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getSuggestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.searchService.getSearchSuggestions(req.query.q as string || '');
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  saveSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.searchService.saveSearch(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getSavedSearches = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.searchService.getSavedSearches(userId, req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteSavedSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.searchService.deleteSavedSearch(req.params.id as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
