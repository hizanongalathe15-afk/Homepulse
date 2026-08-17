import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { AdService } from '../services/ad.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const adService = new AdService(prisma);

export class AdController {
  private adService: AdService;

  constructor(adService?: AdService) {
    this.adService = adService || new AdService(prisma);
  }

  createAdCampaign = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.adService.createAdCampaign(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getAdCampaigns = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.adService.getAdCampaigns(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getAdCampaign = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.adService.getAdCampaign(req.params.id as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  updateAdCampaign = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.adService.updateAdCampaign(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  deleteAdCampaign = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.adService.deleteAdCampaign(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  recordImpression = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.adService.recordImpression(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  recordClick = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.adService.recordClick(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getActiveAdCampaigns = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.adService.getActiveAdCampaigns();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getAdCampaignStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.adService.getAdCampaignStats();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
