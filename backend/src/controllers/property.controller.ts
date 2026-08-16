import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { PropertyService } from '../services/property.service';
import { SearchService } from '../services/search.service';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';
import { NotificationService } from '../services/notification.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const searchService = new SearchService(prisma, notificationService);
const propertyService = new PropertyService(prisma, searchService, notificationService);

export class PropertyController {
  private propertyService: PropertyService;
  private searchService: SearchService;

  constructor(propertyService?: PropertyService, searchService?: SearchService) {
    this.propertyService = propertyService || new PropertyService(prisma, searchService!, notificationService);
    this.searchService = searchService || new SearchService(prisma, notificationService);
  }

  createProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.propertyService.createProperty(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getProperties = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.propertyService.getProperties(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.propertyService.getProperty(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.propertyService.updateProperty(req.params.id as string, userId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.propertyService.deleteProperty(req.params.id as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getMyProperties = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.propertyService.getMyProperties(userId, req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  searchProperties = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.searchService.searchProperties(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
