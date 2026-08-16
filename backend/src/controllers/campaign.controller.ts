import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { body, param, query } from 'express-validator';
import { CampaignService } from '../services/campaign.service';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

export class CampaignController {
  private campaignService: CampaignService;
  private notificationService: NotificationService;

  constructor(campaignService: CampaignService, notificationService: NotificationService) {
    this.campaignService = campaignService;
    this.notificationService = notificationService;
  }

  async getCampaigns(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.campaignService.getCampaigns(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async createCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.campaignService.createCampaign(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.campaignService.getCampaign(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.campaignService.updateCampaign(req.params.id as string, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.campaignService.deleteCampaign(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async activateCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.campaignService.activateCampaign(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async pauseCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.campaignService.pauseCampaign(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async recordConversion(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.campaignService.recordConversion(req.params.id as string, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCampaignAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.campaignService.getCampaignAnalytics(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCampaignStats(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.campaignService.getCampaignStats();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getActiveCampaigns(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.campaignService.getActiveCampaigns();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
