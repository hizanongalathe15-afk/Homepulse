import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { CommunityService } from '../services/community.service';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const communityService = new CommunityService(prisma, notificationService);

export class CommunityController {
  private communityService: CommunityService;

  constructor(communityService?: CommunityService) {
    this.communityService = communityService || new CommunityService(prisma, notificationService);
  }

  createCommunity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.communityService.createCommunity(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getCommunities = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.communityService.getCommunities(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getCommunity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.communityService.getCommunity(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  joinCommunity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.communityService.joinCommunity(req.params.id as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  leaveCommunity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.communityService.leaveCommunity(req.params.id as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.communityService.createPost(req.params.communityId as string, userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.communityService.getPosts(req.params.communityId as string, req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.communityService.createEvent(req.params.communityId as string, userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.communityService.getEvents(req.params.communityId as string, req.query.upcoming !== 'false');
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  rsvpEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.communityService.rsvpEvent(req.params.eventId as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  cancelRsvp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.communityService.cancelRsvp(req.params.eventId as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
