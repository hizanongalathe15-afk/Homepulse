import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';

export class PrivacyService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getPrivacySettings(userId: string) {
    try {
      let settings = await this.prisma.privacySettings.findUnique({
        where: { userId },
      });
      if (!settings) {
        settings = await this.prisma.privacySettings.create({
          data: { userId },
        });
      }
      return settings;
    } catch (error) {
      logger.error('Failed to get privacy settings:', error);
      throw new AppError('Failed to get privacy settings', 500);
    }
  }

  async updatePrivacySettings(userId: string, data: Record<string, unknown>) {
    try {
      const settings = await this.prisma.privacySettings.upsert({
        where: { userId },
        update: data as any,
        create: { userId, ...(data as any) },
      });
      logger.info(`Privacy settings updated for user: ${userId}`);
      return settings;
    } catch (error) {
      logger.error('Failed to update privacy settings:', error);
      throw new AppError('Failed to update privacy settings', 500);
    }
  }
}
