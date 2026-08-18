import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { NetworkService } from '../services/network.service';

const prisma = new PrismaClient();
const networkService = new NetworkService(prisma);

export class NetworkController {
  private networkService: NetworkService;

  constructor(prisma?: PrismaClient, networkService?: NetworkService) {
    this.networkService = networkService || new NetworkService(prisma as PrismaClient);
  }

  logNetworkSpeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.networkService.logNetworkSpeed(userId, req.body);
      res.status(200).json({ success: true, isLowBandwidth: result });
    } catch (error) {
      next(error);
    }
  };

  getNetworkStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.networkService.getUserNetworkStatus(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
