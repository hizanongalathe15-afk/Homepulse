import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.config';

export class BannerSchedulerJob {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async execute() {
    try {
      const now = new Date();

      const expiredBanners = await this.prisma.banner.findMany({
        where: {
          status: 'ACTIVE',
          endDate: { lte: now },
        },
        select: { id: true, title: true },
      });

      for (const banner of expiredBanners) {
        await this.prisma.banner.update({
          where: { id: banner.id },
          data: { status: 'ENDED' },
        });
        logger.info(`Banner expired: ${banner.id} - ${banner.title}`);
      }

      const activatedBanners = await this.prisma.banner.findMany({
        where: {
          status: 'DRAFT',
          startDate: { lte: now },
          endDate: { gt: now },
        },
        select: { id: true, title: true },
      });

      for (const banner of activatedBanners) {
        await this.prisma.banner.update({
          where: { id: banner.id },
          data: { status: 'ACTIVE' },
        });
        logger.info(`Banner activated: ${banner.id} - ${banner.title}`);
      }

      return {
        success: true,
        expiredCount: expiredBanners.length,
        activatedCount: activatedBanners.length,
      };
    } catch (error) {
      logger.error('Banner scheduler job failed:', error);
      return { success: false, error };
    }
  }
}
