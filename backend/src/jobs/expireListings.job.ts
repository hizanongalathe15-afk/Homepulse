import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.config';

export class ExpireListingsJob {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async execute() {
    try {
      const now = new Date();

      const expiredListings = await this.prisma.property.findMany({
        where: {
          status: 'ACTIVE',
          publishedAt: { not: null },
        },
        select: { id: true, title: true, publishedAt: true },
      });

      let expiredCount = 0;

      for (const listing of expiredListings) {
        const daysSincePublished = (now.getTime() - new Date(listing.publishedAt!).getTime()) / (1000 * 60 * 60 * 24);

        if (daysSincePublished > 60) {
          await this.prisma.property.update({
            where: { id: listing.id },
            data: { status: 'EXPIRED' },
          });
          expiredCount++;
          logger.info(`Listing expired: ${listing.id} - ${listing.title}`);
        }
      }

      return {
        success: true,
        expiredCount,
      };
    } catch (error) {
      logger.error('Expire listings job failed:', error);
      return { success: false, error };
    }
  }
}
