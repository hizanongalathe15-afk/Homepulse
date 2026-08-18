import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';

export class NetworkService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async logNetworkSpeed(userId: string | null, data: { downloadSpeed: number; uploadSpeed: number; latency: number; connectionType: string; userAgent: string; ipAddress?: string }) {
    try {
      const isLowBandwidth = data.downloadSpeed < 1.5 || data.latency > 500;
      await this.prisma.networkSpeedLog.create({
        data: {
          userId: userId || undefined,
          ...data,
          isLowBandwidth,
        },
      });
      return isLowBandwidth;
    } catch (error) {
      logger.error('Failed to log network speed:', error);
      return false;
    }
  }

  async getUserNetworkStatus(userId: string) {
    try {
      const recentLogs = await this.prisma.networkSpeedLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
      
      if (recentLogs.length === 0) return { isLowBandwidth: false, averageSpeed: 0 };
      
      const avgSpeed = recentLogs.reduce((sum, log) => sum + (log.downloadSpeed || 0), 0) / recentLogs.length;
      const isLowBandwidth = avgSpeed < 1.5 || recentLogs[0].isLowBandwidth;
      
      return { isLowBandwidth, averageSpeed: avgSpeed, recentLogs: recentLogs.slice(0, 5) };
    } catch (error) {
      logger.error('Failed to get user network status:', error);
      return { isLowBandwidth: false, averageSpeed: 0 };
    }
  }
}
