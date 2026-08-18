import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { OfflineService } from '../services/offline.service';

const prisma = new PrismaClient();
const offlineService = new OfflineService(prisma);

export class OfflineController {
  private offlineService: OfflineService;

  constructor(prisma?: PrismaClient, offlineService?: OfflineService) {
    this.offlineService = offlineService || new OfflineService(prisma as PrismaClient);
  }

  cacheData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { entityType, entityId, data, ttlHours } = req.body;
      const result = await this.offlineService.cacheData(userId, entityType, entityId, data, ttlHours);
      res.status(200).json({ success: true, message: 'Data cached successfully' });
    } catch (error) {
      next(error);
    }
  };

  getCachedData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { entityType, entityId } = req.params;
      const result = await this.offlineService.getCachedData(userId, entityType as string, entityId as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  syncData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { entityType, data } = req.body;
      const result = await this.offlineService.syncData(userId, entityType, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
