import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { body, param, query } from 'express-validator';
import { BannerModel, CreateBannerData, BannerFilters } from '../models/Banner.model';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

export class BannerService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async createBanner(createdById: string, data: CreateBannerData) {
    try {
      const banner = await this.prisma.banner.create({
        data: {
          title: data.title,
          imageUrl: data.imageUrl,
          linkUrl: data.linkUrl,
          targetAudience: data.targetAudience || [],
          priority: data.priority || 0,
          startDate: data.startDate,
          endDate: data.endDate,
          createdById,
          status: 'DRAFT',
        },
        include: { creator: { select: { firstName: true, lastName: true } } },
      });

      logger.info(`Banner created: ${banner.id}`);

      return {
        success: true,
        data: banner,
      };
    } catch (error) {
      logger.error('Failed to create banner:', error);
      throw new AppError('Failed to create banner', 500);
    }
  }

  async getBanners(filters?: BannerFilters) {
    try {
      const whereClause: any = {};

      if (filters?.status) whereClause.status = filters.status;
      if (filters?.targetAudience) {
        whereClause.targetAudience = { has: filters.targetAudience };
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [banners, total] = await Promise.all([
        this.prisma.banner.findMany({
          where: whereClause,
          include: { creator: { select: { firstName: true, lastName: true } } },
          orderBy: { priority: 'desc', createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.banner.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: banners,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get banners:', error);
      throw new AppError('Failed to fetch banners', 500);
    }
  }

  async getBanner(id: string) {
    try {
      const banner = await this.prisma.banner.findUnique({
        where: { id },
        include: { creator: { select: { firstName: true, lastName: true } } },
      });

      if (!banner) {
        throw new AppError('Banner not found', 404);
      }

      return {
        success: true,
        data: banner,
      };
    } catch (error) {
      logger.error(`Failed to get banner ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch banner', 500);
    }
  }

  async updateBanner(id: string, data: Partial<CreateBannerData>) {
    try {
      const banner = await this.prisma.banner.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!banner) {
        throw new AppError('Banner not found', 404);
      }

      const allowedFields = ['title', 'imageUrl', 'linkUrl', 'targetAudience', 'priority', 'startDate', 'endDate', 'status'];
      const updateData: any = {};
      for (const field of allowedFields) {
        if (data[field as keyof CreateBannerData] !== undefined) {
          updateData[field] = data[field as keyof CreateBannerData];
        }
      }

      const updatedBanner = await this.prisma.banner.update({
        where: { id },
        data: updateData,
        include: { creator: { select: { firstName: true, lastName: true } } },
      });

      return {
        success: true,
        data: updatedBanner,
      };
    } catch (error) {
      logger.error(`Failed to update banner ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update banner', 500);
    }
  }

  async deleteBanner(id: string) {
    try {
      const banner = await this.prisma.banner.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!banner) {
        throw new AppError('Banner not found', 404);
      }

      await this.prisma.banner.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Banner deleted successfully',
      };
    } catch (error) {
      logger.error(`Failed to delete banner ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete banner', 500);
    }
  }

  async recordView(bannerId: string, userId: string) {
    try {
      await this.prisma.bannerView.create({
        data: {
          bannerId,
          userId,
        },
      });

      await this.prisma.banner.update({
        where: { id: bannerId },
        data: { views: { increment: 1 } },
      });

      return {
        success: true,
      };
    } catch (error) {
      logger.error(`Failed to record banner view ${bannerId}:`, error);
      return {
        success: false,
      };
    }
  }

  async recordClick(bannerId: string) {
    try {
      await this.prisma.banner.update({
        where: { id: bannerId },
        data: { clicks: { increment: 1 } },
      });

      return {
        success: true,
      };
    } catch (error) {
      logger.error(`Failed to record banner click ${bannerId}:`, error);
      return {
        success: false,
      };
    }
  }

  async getBannerStats() {
    try {
      const [totalBanners, activeBanners, totalViews, totalClicks] = await Promise.all([
        this.prisma.banner.count(),
        this.prisma.banner.count({ where: { status: 'ACTIVE' } }),
        this.prisma.banner.aggregate({ _sum: { views: true } }),
        this.prisma.banner.aggregate({ _sum: { clicks: true } }),
      ]);

      return {
        success: true,
        data: {
          totalBanners,
          activeBanners,
          totalViews: totalViews._sum.views || 0,
          totalClicks: totalClicks._sum.clicks || 0,
          ctr: totalViews._sum.views ? (totalClicks._sum.clicks || 0) / totalViews._sum.views * 100 : 0,
        },
      };
    } catch (error) {
      logger.error('Failed to get banner stats:', error);
      throw new AppError('Failed to fetch banner stats', 500);
    }
  }

  async getActiveBannersForUser(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true, city: true },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const now = new Date();
      const banners = await this.prisma.banner.findMany({
        where: {
          status: 'ACTIVE',
          startDate: { lte: now },
          endDate: { gte: now },
          OR: [
            { targetAudience: { has: user.role } },
            { targetAudience: { has: 'all' } },
            { targetAudience: { has: user.city || '' } },
          ],
        },
        orderBy: { priority: 'desc' },
        take: 10,
      });

      return {
        success: true,
        data: banners,
      };
    } catch (error) {
      logger.error('Failed to get active banners:', error);
      throw new AppError('Failed to fetch active banners', 500);
    }
  }
}
