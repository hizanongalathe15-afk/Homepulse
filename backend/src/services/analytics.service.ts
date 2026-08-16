import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateQuery } from '../middleware/validation.middleware';
import { query } from 'express-validator';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

export class AnalyticsService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async recordEvent(eventType: string, entityType?: string, entityId?: string, userId?: string, metadata?: any) {
    try {
      await this.prisma.analytics.create({
        data: {
          eventType,
          entityType,
          entityId,
          userId,
          metadata,
        },
      });

      return {
        success: true,
      };
    } catch (error) {
      logger.error('Failed to record analytics event:', error);
      return {
        success: false,
      };
    }
  }

  async getPropertyAnalytics(propertyId: string) {
    try {
      const [totalViews, totalInquiries, viewsToday, viewsThisWeek, viewsThisMonth] = await Promise.all([
        this.prisma.analytics.count({ where: { eventType: 'PROPERTY_VIEWED', entityId: propertyId } }),
        this.prisma.analytics.count({ where: { eventType: 'PROPERTY_INQUIRY', entityId: propertyId } }),
        this.prisma.analytics.count({
          where: {
            eventType: 'PROPERTY_VIEWED',
            entityId: propertyId,
            createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
          },
        }),
        this.prisma.analytics.count({
          where: {
            eventType: 'PROPERTY_VIEWED',
            entityId: propertyId,
            createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        }),
        this.prisma.analytics.count({
          where: {
            eventType: 'PROPERTY_VIEWED',
            entityId: propertyId,
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          },
        }),
      ]);

      return {
        success: true,
        data: {
          totalViews,
          totalInquiries,
          totalViewsToday: viewsToday,
          totalViewsThisWeek: viewsThisWeek,
          totalViewsThisMonth: viewsThisMonth,
        },
      };
    } catch (error) {
      logger.error(`Failed to get analytics for property ${propertyId}:`, error);
      throw new AppError('Failed to fetch property analytics', 500);
    }
  }

  async getPlatformAnalytics(filters?: { startDate?: Date; endDate?: Date }) {
    try {
      const whereClause: any = {};

      if (filters?.startDate || filters?.endDate) {
        whereClause.createdAt = {};
        if (filters.startDate) (whereClause.createdAt as { gte?: Date }).gte = filters.startDate;
        if (filters.endDate) (whereClause.createdAt as { lte?: Date }).lte = filters.endDate;
      }

      const [
        totalUsers,
        totalProperties,
        totalListings,
        totalPayments,
        totalReviews,
        totalCommunities,
        eventBreakdown,
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.property.count(),
        this.prisma.property.count({ where: { status: 'ACTIVE' } }),
        this.prisma.payment.count({ where: { status: 'COMPLETED' } }),
        this.prisma.review.count(),
        this.prisma.community.count(),
        this.prisma.analytics.groupBy({
          by: ['eventType'],
          where: whereClause,
          _count: { id: true },
        }),
      ]);

      return {
        success: true,
        data: {
          totalUsers,
          totalProperties,
          totalListings,
          totalPayments,
          totalReviews,
          totalCommunities,
          eventBreakdown,
        },
      };
    } catch (error) {
      logger.error('Failed to get platform analytics:', error);
      throw new AppError('Failed to fetch platform analytics', 500);
    }
  }

  async getUserActivity(userId: string, filters?: { startDate?: Date; endDate?: Date; page?: number; limit?: number }) {
    try {
      const whereClause: any = { userId };

      if (filters?.startDate || filters?.endDate) {
        whereClause.createdAt = {};
        if (filters.startDate) (whereClause.createdAt as { gte?: Date }).gte = filters.startDate;
        if (filters.endDate) (whereClause.createdAt as { lte?: Date }).lte = filters.endDate;
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [activities, total] = await Promise.all([
        this.prisma.analytics.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.analytics.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: activities,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get user activity:', error);
      throw new AppError('Failed to fetch user activity', 500);
    }
  }

  async getRevenueAnalytics(filters?: { startDate?: Date; endDate?: Date; groupBy?: string }) {
    try {
      const whereClause: any = { status: 'COMPLETED' };

      if (filters?.startDate || filters?.endDate) {
        whereClause.createdAt = {};
        if (filters.startDate) (whereClause.createdAt as { gte?: Date }).gte = filters.startDate;
        if (filters.endDate) (whereClause.createdAt as { lte?: Date }).lte = filters.endDate;
      }

      const payments = await this.prisma.payment.findMany({
        where: whereClause,
        select: { amount: true, currency: true, method: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      });

      const revenueByMethod = payments.reduce((acc, payment) => {
        if (!acc[payment.method]) {
          acc[payment.method] = { amount: 0, count: 0 };
        }
        acc[payment.method].amount += payment.amount;
        acc[payment.method].count += 1;
        return acc;
      }, {} as Record<string, { amount: number; count: number }>);

      return {
        success: true,
        data: {
          totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
          totalTransactions: payments.length,
          revenueByMethod,
        },
      };
    } catch (error) {
      logger.error('Failed to get revenue analytics:', error);
      throw new AppError('Failed to fetch revenue analytics', 500);
    }
  }
}
