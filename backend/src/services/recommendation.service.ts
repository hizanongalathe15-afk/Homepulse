import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

export class RecommendationService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async getRecommendations(userId: string, filters?: { city?: string; type?: string; limit?: number }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { city: true },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const whereClause: any = {
        status: 'ACTIVE',
      };

      if (user.city) {
        whereClause.city = { contains: user.city, mode: 'insensitive' };
      }

      if (filters?.city) {
        whereClause.city = { contains: filters.city, mode: 'insensitive' };
      }

      if (filters?.type) {
        whereClause.type = filters.type;
      }

      const limit = filters?.limit || 10;

      const properties = await this.prisma.property.findMany({
        where: whereClause,
        include: {
          landlord: { select: { firstName: true, lastName: true } },
          reviews: { select: { rating: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit * 2,
      });

      const scoredProperties = properties.map((property) => {
        let score = 0;

        const ratings = property.reviews.map((r) => r.rating);
        const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
        score += avgRating * 10;

        const daysSinceCreated = (Date.now() - new Date(property.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceCreated < 7) {
          score += 20;
        }

        if (property.amenities.length > 5) {
          score += 10;
        }

        if (property.images.length > 3) {
          score += 5;
        }

        return { ...property, recommendationScore: score };
      });

      scoredProperties.sort((a, b) => b.recommendationScore - a.recommendationScore);

      return {
        success: true,
        data: scoredProperties.slice(0, limit),
      };
    } catch (error) {
      logger.error('Failed to get recommendations:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to get recommendations', 500);
    }
  }

  async getSimilarProperties(propertyId: string, limit: number = 5) {
    try {
      const property = await this.prisma.property.findUnique({
        where: { id: propertyId },
        select: { city: true, type: true, price: true, bedrooms: true, bathrooms: true },
      });

      if (!property) {
        throw new AppError('Property not found', 404);
      }

      const similarProperties = await this.prisma.property.findMany({
        where: {
          id: { not: propertyId },
          status: 'ACTIVE',
          city: { contains: property.city, mode: 'insensitive' },
          type: property.type,
          price: { gte: property.price * 0.8, lte: property.price * 1.2 },
          OR: [
            { bedrooms: property.bedrooms },
            { bathrooms: property.bathrooms },
          ],
        },
        include: {
          landlord: { select: { firstName: true, lastName: true } },
          reviews: { select: { rating: true } },
        },
        take: limit,
      });

      return {
        success: true,
        data: similarProperties,
      };
    } catch (error) {
      logger.error('Failed to get similar properties:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to get similar properties', 500);
    }
  }

  async getTrendingProperties(filters?: { city?: string; limit?: number }) {
    try {
      const whereClause: any = { status: 'ACTIVE' };

      if (filters?.city) {
        whereClause.city = { contains: filters.city, mode: 'insensitive' };
      }

      const limit = filters?.limit || 10;

      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const properties = await this.prisma.property.findMany({
        where: whereClause,
        include: {
          landlord: { select: { firstName: true, lastName: true } },
          reviews: { select: { rating: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      const trendingProperties = properties.filter((p) => new Date(p.createdAt) > sevenDaysAgo);

      return {
        success: true,
        data: trendingProperties,
      };
    } catch (error) {
      logger.error('Failed to get trending properties:', error);
      throw new AppError('Failed to get trending properties', 500);
    }
  }
}
