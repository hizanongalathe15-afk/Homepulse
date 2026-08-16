import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validation.middleware';
import { body, query } from 'express-validator';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

export class SearchService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async searchProperties(query: string, filters?: { city?: string; minPrice?: number; maxPrice?: number; type?: string; page?: number; limit?: number }) {
    try {
      const whereClause: any = {
        status: 'ACTIVE',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
          { neighborhood: { contains: query, mode: 'insensitive' } },
        ],
      };

      if (filters?.city) whereClause.city = { contains: filters.city, mode: 'insensitive' };
      if (filters?.type) whereClause.type = filters.type;
      if (filters?.minPrice || filters?.maxPrice) {
        whereClause.price = {};
        if (filters.minPrice) (whereClause.price as { gte?: number }).gte = filters.minPrice;
        if (filters.maxPrice) (whereClause.price as { lte?: number }).lte = filters.maxPrice;
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [properties, total] = await Promise.all([
        this.prisma.property.findMany({
          where: whereClause,
          include: {
            landlord: { select: { firstName: true, lastName: true } },
            reviews: { select: { rating: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.property.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: properties,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Search failed:', error);
      throw new AppError('Search failed', 500);
    }
  }

  async advancedSearch(filters: any) {
    try {
      const whereClause: any = { status: 'ACTIVE' };

      if (filters.city) whereClause.city = { contains: filters.city, mode: 'insensitive' };
      if (filters.type) whereClause.type = filters.type;
      if (filters.minPrice || filters.maxPrice) {
        whereClause.price = {};
        if (filters.minPrice) (whereClause.price as { gte?: number }).gte = filters.minPrice;
        if (filters.maxPrice) (whereClause.price as { lte?: number }).lte = filters.maxPrice;
      }
      if (filters.bedrooms) whereClause.bedrooms = { gte: filters.bedrooms };
      if (filters.bathrooms) whereClause.bathrooms = { gte: filters.bathrooms };
      if (filters.neighborhood) whereClause.neighborhood = { contains: filters.neighborhood, mode: 'insensitive' };
      if (filters.amenities && filters.amenities.length > 0) {
        whereClause.amenities = { hasSome: filters.amenities };
      }

      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const skip = (page - 1) * limit;

      const [properties, total] = await Promise.all([
        this.prisma.property.findMany({
          where: whereClause,
          include: {
            landlord: { select: { firstName: true, lastName: true } },
            reviews: { select: { rating: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.property.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: properties,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Advanced search failed:', error);
      throw new AppError('Advanced search failed', 500);
    }
  }

  async getSearchSuggestions(query: string) {
    try {
      if (!query || query.length < 2) {
        return {
          success: true,
          data: [],
        };
      }

      const [cities, neighborhoods, titles] = await Promise.all([
        this.prisma.property.findMany({
          where: { city: { contains: query, mode: 'insensitive' }, status: 'ACTIVE' },
          select: { city: true },
          distinct: ['city'],
          take: 5,
        }),
        this.prisma.property.findMany({
          where: { neighborhood: { contains: query, mode: 'insensitive' }, status: 'ACTIVE' },
          select: { neighborhood: true },
          distinct: ['neighborhood'],
          take: 5,
        }),
        this.prisma.property.findMany({
          where: { title: { contains: query, mode: 'insensitive' }, status: 'ACTIVE' },
          select: { title: true },
          take: 5,
        }),
      ]);

      const suggestions = [
        ...cities.map((c: any) => ({ type: 'city', value: c.city })),
        ...neighborhoods.filter((n: any) => n.neighborhood).map((n: any) => ({ type: 'neighborhood', value: n.neighborhood })),
        ...titles.map((t: any) => ({ type: 'property', value: t.title })),
      ];

      return {
        success: true,
        data: suggestions,
      };
    } catch (error) {
      logger.error('Search suggestions failed:', error);
      throw new AppError('Search suggestions failed', 500);
    }
  }

  async saveSearch(userId: string, data: any) {
    try {
      const savedSearch = await this.prisma.savedSearch.create({
        data: {
          userId,
          propertyId: data.propertyId,
          name: data.name,
          filters: data.filters,
        },
      });

      return {
        success: true,
        data: savedSearch,
      };
    } catch (error) {
      logger.error('Failed to save search:', error);
      throw new AppError('Failed to save search', 500);
    }
  }

  async getSavedSearches(userId: string, filters?: { page?: number; limit?: number }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [searches, total] = await Promise.all([
        this.prisma.savedSearch.findMany({
          where: { userId },
          include: { property: { select: { title: true, images: true } } },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.savedSearch.count({ where: { userId } }),
      ]);

      return {
        success: true,
        data: searches,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get saved searches:', error);
      throw new AppError('Failed to fetch saved searches', 500);
    }
  }

  async deleteSavedSearch(id: string, userId: string) {
    try {
      const savedSearch = await this.prisma.savedSearch.findUnique({
        where: { id },
        select: { id: true, userId: true },
      });

      if (!savedSearch) {
        throw new AppError('Saved search not found', 404);
      }

      if (savedSearch.userId !== userId) {
        throw new AppError('Not authorized to delete this saved search', 403);
      }

      await this.prisma.savedSearch.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Saved search deleted successfully',
      };
    } catch (error) {
      logger.error(`Failed to delete saved search ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete saved search', 500);
    }
  }
}
