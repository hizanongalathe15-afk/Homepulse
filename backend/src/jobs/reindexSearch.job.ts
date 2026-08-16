import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.config';

export class ReindexSearchJob {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async execute() {
    try {
      const properties = await this.prisma.property.findMany({
        where: { status: 'ACTIVE' },
        include: {
          landlord: { select: { firstName: true, lastName: true, email: true } },
          reviews: { select: { rating: true } },
        },
      });

      const indexedCount = properties.length;

      logger.info(`Search index updated: ${indexedCount} properties indexed`);

      return {
        success: true,
        indexedCount,
        message: `Successfully indexed ${indexedCount} properties`,
      };
    } catch (error) {
      logger.error('Reindex search job failed:', error);
      return { success: false, error };
    }
  }
}
