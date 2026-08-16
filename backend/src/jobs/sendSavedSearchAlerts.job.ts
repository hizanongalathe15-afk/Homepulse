import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.config';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

export class SendSavedSearchAlertsJob {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async execute() {
    try {
      const savedSearches = await this.prisma.savedSearch.findMany({
        include: {
          user: { select: { id: true, firstName: true, email: true } },
          property: { select: { id: true, title: true, city: true, price: true } },
        },
      });

      let alertsSent = 0;

      for (const savedSearch of savedSearches) {
        try {
          const matchingProperties = await this.findMatchingProperties(savedSearch);

          if (matchingProperties.length > 0) {
            const propertyTitles = matchingProperties.map((p) => p.title).join(', ');

            await this.notificationService.sendNotification({
              userId: savedSearch.userId,
              type: 'SAVED_SEARCH_ALERT',
              title: 'New Properties Match Your Search',
              message: `${matchingProperties.length} new properties match your saved search "${savedSearch.name || 'Untitled'}": ${propertyTitles}`,
              data: { savedSearchId: savedSearch.id, propertyIds: matchingProperties.map((p) => p.id) },
            });

            alertsSent++;
          }
        } catch (error) {
          logger.error(`Failed to process saved search ${savedSearch.id}:`, error);
        }
      }

      logger.info(`Saved search alerts job completed: ${alertsSent} alerts sent`);

      return {
        success: true,
        alertsSent,
      };
    } catch (error) {
      logger.error('Send saved search alerts job failed:', error);
      return { success: false, error };
    }
  }

  private async findMatchingProperties(savedSearch: any) {
    const filters = savedSearch.filters || {};
    const whereClause: Record<string, unknown> = { status: 'ACTIVE' };

    if (filters.city) whereClause.city = { contains: filters.city, mode: 'insensitive' };
    if (filters.type) whereClause.type = filters.type;
    if (filters.minPrice || filters.maxPrice) {
      whereClause.price = {};
      if (filters.minPrice) (whereClause.price as { gte?: number }).gte = filters.minPrice;
      if (filters.maxPrice) (whereClause.price as { lte?: number }).lte = filters.maxPrice;
    }

    return this.prisma.property.findMany({
      where: whereClause,
      select: { id: true, title: true, city: true, price: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  }
}
