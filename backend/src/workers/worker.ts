import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.config';

export class Worker {
  private prisma: PrismaClient;
  private isRunning: boolean = false;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  start() {
    if (this.isRunning) {
      logger.warn('Worker is already running');
      return;
    }

    this.isRunning = true;
    logger.info('Background worker started');

    setInterval(async () => {
      try {
        await this.cleanupExpiredData();
      } catch (error) {
        logger.error('Worker cleanup failed:', error);
      }
    }, 3600000);

    setInterval(async () => {
      try {
        await this.processPendingNotifications();
      } catch (error) {
        logger.error('Worker notification processing failed:', error);
      }
    }, 60000);
  }

  stop() {
    this.isRunning = false;
    logger.info('Background worker stopped');
  }

  private async cleanupExpiredData() {
    try {
      const expiredOTPs = await this.prisma.analytics.deleteMany({
        where: { createdAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      });

      const oldNotifications = await this.prisma.notification.deleteMany({
        where: {
          createdAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          isRead: true,
        },
      });

      logger.info(`Cleanup completed: ${expiredOTPs.count} analytics records, ${oldNotifications.count} notifications deleted`);
    } catch (error) {
      logger.error('Cleanup failed:', error);
    }
  }

  private async processPendingNotifications() {
    try {
      const pendingNotifications = await this.prisma.notification.findMany({
        where: { isRead: false },
        take: 100,
      });

      logger.info(`Processing ${pendingNotifications.length} pending notifications`);
    } catch (error) {
      logger.error('Notification processing failed:', error);
    }
  }
}
