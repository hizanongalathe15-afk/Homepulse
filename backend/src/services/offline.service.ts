import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';

export class OfflineService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async cacheData(userId: string, entityType: string, entityId: string | null, data: Record<string, unknown>, ttlHours: number = 24) {
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + ttlHours);
      await this.prisma.offlineCache.upsert({
        where: {
          id: `${userId}_${entityType}_${entityId || 'general'}`,
        },
        update: { data: data as any, cachedAt: new Date(), expiresAt, isSynced: true },
        create: {
          userId,
          entityType,
          entityId: entityId || undefined,
          data: data as any,
          expiresAt,
          isSynced: true,
        },
      });
    } catch (error) {
      logger.error('Failed to cache data:', error);
      throw new AppError('Failed to cache data', 500);
    }
  }

  async getCachedData(userId: string, entityType: string, entityId?: string) {
    try {
      const cached = await this.prisma.offlineCache.findFirst({
        where: {
          userId,
          entityType,
          ...(entityId ? { entityId } : {}),
          expiresAt: { gte: new Date() },
        },
        orderBy: { cachedAt: 'desc' },
      });
      return cached?.data || null;
    } catch (error) {
      logger.error('Failed to get cached data:', error);
      return null;
    }
  }

  async syncData(userId: string, entityType: string, data: Record<string, unknown>) {
    try {
      await this.cacheData(userId, entityType, null, data, 24);
      return { success: true, message: 'Data synced successfully' };
    } catch (error) {
      logger.error('Failed to sync data:', error);
      throw new AppError('Failed to sync data', 500);
    }
  }

  async clearExpiredCache() {
    try {
      const result = await this.prisma.offlineCache.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      });
      logger.info(`Cleared ${result.count} expired cache entries`);
    } catch (error) {
      logger.error('Failed to clear expired cache:', error);
    }
  }
}
