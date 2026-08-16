import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.config';

export class GenerateAnalyticsJob {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async execute() {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const analytics = await this.prisma.analytics.findMany({
        where: {
          createdAt: { gte: oneDayAgo },
        },
        select: {
          eventType: true,
          entityType: true,
          userId: true,
        },
      });

      const eventCounts: Record<string, number> = {};
      const userActivity: Record<string, number> = {};

      for (const event of analytics) {
        eventCounts[event.eventType] = (eventCounts[event.eventType] || 0) + 1;
        if (event.userId) {
          userActivity[event.userId] = (userActivity[event.userId] || 0) + 1;
        }
      }

      const topUsers = Object.entries(userActivity)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([userId, activityCount]) => ({ userId, activityCount }));

      logger.info(`Analytics generated: ${analytics.length} events processed`);

      return {
        success: true,
        data: {
          totalEvents: analytics.length,
          eventCounts,
          topUsers,
          generatedAt: new Date(),
        },
      };
    } catch (error) {
      logger.error('Generate analytics job failed:', error);
      return { success: false, error };
    }
  }
}
