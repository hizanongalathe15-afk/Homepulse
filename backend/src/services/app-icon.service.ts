import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';

export class AppIconService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async setAppIconState(userId: string, data: { state: string; iconUrl?: string; badgeCount?: number; isActive?: boolean }) {
    try {
      const iconState = await this.prisma.appIconState.upsert({
        where: { id: `${userId}_primary` },
        update: data as any,
        create: { userId, id: `${userId}_primary`, state: data.state, iconUrl: data.iconUrl || '', badgeCount: data.badgeCount || 0, isActive: data.isActive || false },
      });
      return iconState;
    } catch (error) {
      logger.error('Failed to set app icon state:', error);
      throw new AppError('Failed to set app icon state', 500);
    }
  }

  async getAppIconState(userId: string) {
    try {
      let iconState = await this.prisma.appIconState.findUnique({
        where: { id: `${userId}_primary` },
      });
      if (!iconState) {
        iconState = await this.prisma.appIconState.create({
          data: { userId, id: `${userId}_primary`, state: 'default', iconUrl: '', badgeCount: 0, isActive: false },
        });
      }
      return iconState;
    } catch (error) {
      logger.error('Failed to get app icon state:', error);
      throw new AppError('Failed to get app icon state', 500);
    }
  }
}
