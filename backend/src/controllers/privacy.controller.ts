import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrivacyService } from '../services/privacy.service';

const prisma = new PrismaClient();
const privacyService = new PrivacyService(prisma);

export class PrivacyController {
  private privacyService: PrivacyService;

  constructor(prisma?: PrismaClient, privacyService?: PrivacyService) {
    this.privacyService = privacyService || new PrivacyService(prisma as PrismaClient);
  }

  getPrivacySettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.privacyService.getPrivacySettings(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  updatePrivacySettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.privacyService.updatePrivacySettings(userId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
