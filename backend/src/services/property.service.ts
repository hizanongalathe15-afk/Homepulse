import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { ValidationUtils } from '../utils/validators';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { body, param, query } from 'express-validator';
import { PropertyFilters, CreatePropertyData } from '../types/property.types';
import { PropertyModel } from '../models/Property.model';
import { SearchService } from '../services/search.service';
import { NotificationService } from '../services/notification.service';

export interface PropertyResponse {
  success: boolean;
  data?: any;
  total?: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
  error?: string;
}

export class PropertyService {
  private prisma: PrismaClient;
  private searchService: SearchService;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, searchService: SearchService, notificationService: NotificationService) {
    this.prisma = prisma;
    this.searchService = searchService;
    this.notificationService = notificationService;
  }

  async createProperty(landlordId: string, data: CreatePropertyData) {
    try {
      this.validatePropertyData(data);

      const property = await this.prisma.property.create({
        data: {
          title: data.title,
          description: data.description,
          type: data.type as any,
          price: data.price,
          currency: data.currency || 'USD',
          city: data.city,
          neighborhood: data.neighborhood,
          address: data.address,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          area: data.area,
          images: data.images || [],
          amenities: data.amenities || [],
          latitude: data.latitude,
          longitude: data.longitude,
          landlordId,
          status: 'PENDING',
        },
        include: { landlord: { select: { firstName: true, lastName: true, email: true } } },
      });

      if (process.env['ENABLE_ANALYTICS'] === 'true') {
        await this.prisma.analytics.create({
          data: {
            eventType: 'PROPERTY_CREATED',
            entityType: 'Property',
            entityId: property.id,
            userId: landlordId,
            metadata: { title: property.title, city: property.city },
          },
        });
      }

      logger.info(`Property created: ${property.id} by ${landlordId}`);

      return {
        success: true,
        data: property,
      };
    } catch (error) {
      logger.error('Failed to create property:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create property', 500);
    }
  }

  async getProperties(filters?: PropertyFilters) {
    try {
      const whereClause: any = {};

      if (filters?.city) whereClause.city = { contains: filters.city, mode: 'insensitive' };
      if (filters?.type) whereClause.type = filters.type;
      if (filters?.minPrice) whereClause.price = { ...(whereClause.price as object || {}), gte: filters.minPrice };
      if (filters?.maxPrice) whereClause.price = { ...(whereClause.price as object || {}), lte: filters.maxPrice };
      if (filters?.bedrooms) whereClause.bedrooms = filters.bedrooms;
      if (filters?.bathrooms) whereClause.bathrooms = filters.bathrooms;

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [properties, total] = await Promise.all([
        this.prisma.property.findMany({
          where: { ...whereClause, status: 'ACTIVE' },
          include: {
            landlord: { select: { firstName: true, lastName: true, email: true } },
            reviews: { select: { rating: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.property.count({ where: { ...whereClause, status: 'ACTIVE' } }),
      ]);

      const propertiesWithRating = properties.map((property) => {
        const ratings = property.reviews.map((r: any) => r.rating);
        const averageRating = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0;
        return { ...property, averageRating: Math.round(averageRating * 100) / 100 };
      });

      return {
        success: true,
        data: propertiesWithRating,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get properties:', error);
      throw new AppError('Failed to fetch properties', 500);
    }
  }

  async getProperty(id: string) {
    try {
      const property = await this.prisma.property.findUnique({
        where: { id },
        include: {
          landlord: { select: { firstName: true, lastName: true, email: true, phone: true } },
          reviews: { include: { author: { select: { firstName: true, lastName: true } } } },
          qrCodes: true,
        },
      });

      if (!property) {
        throw new AppError('Property not found', 404);
      }

      if (process.env['ENABLE_ANALYTICS'] === 'true') {
        await this.prisma.analytics.create({
          data: {
            eventType: 'PROPERTY_VIEWED',
            entityType: 'Property',
            entityId: property.id,
            metadata: { title: property.title },
          },
        });
      }

      return {
        success: true,
        data: property,
      };
    } catch (error) {
      logger.error(`Failed to get property ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch property', 500);
    }
  }

  async updateProperty(id: string, landlordId: string, data: Partial<CreatePropertyData>) {
    try {
      const property = await this.prisma.property.findUnique({
        where: { id },
        select: { id: true, landlordId: true },
      });

      if (!property) {
        throw new AppError('Property not found', 404);
      }

      if (property.landlordId !== landlordId) {
        throw new AppError('Not authorized to update this property', 403);
      }

      const allowedFields = ['title', 'description', 'type', 'price', 'city', 'neighborhood', 'address', 'bedrooms', 'bathrooms', 'area', 'images', 'amenities', 'latitude', 'longitude'];
      const updateData: any = {};
      for (const field of allowedFields) {
        if (data[field as keyof CreatePropertyData] !== undefined) {
          updateData[field] = data[field as keyof CreatePropertyData];
        }
      }

      const updatedProperty = await this.prisma.property.update({
        where: { id },
        data: updateData,
        include: { landlord: { select: { firstName: true, lastName: true } } },
      });

      return {
        success: true,
        data: updatedProperty,
      };
    } catch (error) {
      logger.error(`Failed to update property ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update property', 500);
    }
  }

  async deleteProperty(id: string, landlordId: string) {
    try {
      const property = await this.prisma.property.findUnique({
        where: { id },
        select: { id: true, landlordId: true },
      });

      if (!property) {
        throw new AppError('Property not found', 404);
      }

      if (property.landlordId !== landlordId) {
        throw new AppError('Not authorized to delete this property', 403);
      }

      await this.prisma.property.update({
        where: { id },
        data: { status: 'DELETED', deletedAt: new Date() },
      });

      return {
        success: true,
        message: 'Property deleted successfully',
      };
    } catch (error) {
      logger.error(`Failed to delete property ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete property', 500);
    }
  }

  async getMyProperties(userId: string, filters?: { status?: string; page?: number; limit?: number }) {
    try {
      const whereClause: any = { landlordId: userId };

      if (filters?.status) {
        whereClause.status = filters.status;
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [properties, total] = await Promise.all([
        this.prisma.property.findMany({
          where: whereClause,
          include: { reviews: { select: { rating: true } } },
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
      logger.error('Failed to get my properties:', error);
      throw new AppError('Failed to fetch properties', 500);
    }
  }

  private validatePropertyData(data: CreatePropertyData): void {
    const errors: string[] = [];

    if (!data.title || data.title.trim().length < 3) {
      errors.push('Property title must be at least 3 characters');
    }

    if (!data.type || data.type.trim().length < 2) {
      errors.push('Property type is required');
    }

    if (!ValidationUtils.isValidAmount(data.price)) {
      errors.push('Valid price is required');
    }

    if (!data.city || data.city.trim().length < 2) {
      errors.push('City is required');
    }

    if (!ValidationUtils.isUUID(data.landlordId)) {
      errors.push('Invalid landlord ID');
    }

    if (errors.length > 0) {
      throw new AppError(errors.join(', '), 400);
    }
  }
}
