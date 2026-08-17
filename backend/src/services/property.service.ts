import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { ValidationUtils } from '../utils/validators';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { body, param, query } from 'express-validator';
import { PropertyFilters, CreatePropertyData, PropertyImageType, PropertyVideoType, PropertyViewType } from '../types/property.types';
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
          currency: data.currency || 'KES',
          city: data.city,
          neighborhood: data.neighborhood,
          address: data.address,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          squareMeters: data.squareMeters,
          yearBuilt: data.yearBuilt,
          furnishedLevel: data.furnishedLevel as any,
          floorNumber: data.floorNumber,
          totalFloors: data.totalFloors,
          parkingSpaces: data.parkingSpaces ?? 0,
          isPetFriendly: data.isPetFriendly ?? false,
          isWheelchairAccessible: data.isWheelchairAccessible ?? false,
          airConditioning: data.airConditioning ?? false,
          balcony: data.balcony ?? false,
          terrace: data.terrace ?? false,
          garden: data.garden ?? false,
          pool: data.pool ?? false,
          gym: data.gym ?? false,
          elevator: data.elevator ?? false,
          laundry: data.laundry ?? false,
          dishwasher: data.dishwasher ?? false,
          wifi: data.wifi ?? false,
          security: data.security ?? false,
          fencing: data.fencing ?? false,
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
      if (filters?.squareMeters) whereClause.squareMeters = { gte: filters.squareMeters };
      if (filters?.furnishedLevel) whereClause.furnishedLevel = filters.furnishedLevel;

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [properties, total] = await Promise.all([
        this.prisma.property.findMany({
          where: { ...whereClause, status: 'ACTIVE' },
          include: {
            landlord: { select: { firstName: true, lastName: true, email: true } },
            reviews: { select: { rating: true } },
            propertyImages: { where: { isPrimary: true } },
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
          propertyImages: { orderBy: { order: 'asc' } },
          propertyVideos: true,
        },
      });

      if (!property) {
        throw new AppError('Property not found', 404);
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

      const allowedFields = [
        'title', 'description', 'type', 'price', 'city', 'neighborhood', 'address',
        'bedrooms', 'bathrooms', 'squareMeters', 'yearBuilt', 'furnishedLevel',
        'floorNumber', 'totalFloors', 'parkingSpaces', 'isPetFriendly',
        'isWheelchairAccessible', 'airConditioning', 'balcony', 'terrace',
        'garden', 'pool', 'gym', 'elevator', 'laundry', 'dishwasher',
        'wifi', 'security', 'fencing', 'images', 'amenities',
        'latitude', 'longitude',
      ];
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

  async addPropertyImage(propertyId: string, landlordId: string, data: { url: string; caption?: string; isPrimary?: boolean; order?: number }) {
    try {
      const property = await this.prisma.property.findUnique({
        where: { id: propertyId },
        select: { id: true, landlordId: true },
      });

      if (!property || property.landlordId !== landlordId) {
        throw new AppError('Property not found or not authorized', 404);
      }

      const image = await this.prisma.propertyImage.create({
        data: {
          propertyId,
          url: data.url,
          caption: data.caption,
          isPrimary: data.isPrimary ?? false,
          order: data.order ?? 0,
        },
      });

      return { success: true, data: image };
    } catch (error) {
      logger.error(`Failed to add image to property ${propertyId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to add image', 500);
    }
  }

  async getPropertyImages(propertyId: string) {
    try {
      const images = await this.prisma.propertyImage.findMany({
        where: { propertyId },
        orderBy: { order: 'asc' },
      });
      return { success: true, data: images };
    } catch (error) {
      logger.error(`Failed to get images for property ${propertyId}:`, error);
      throw new AppError('Failed to fetch images', 500);
    }
  }

  async deletePropertyImage(id: string, landlordId: string) {
    try {
      const image = await this.prisma.propertyImage.findUnique({
        where: { id },
        include: { property: { select: { landlordId: true } } },
      });

      if (!image || image.property.landlordId !== landlordId) {
        throw new AppError('Image not found or not authorized', 404);
      }

      await this.prisma.propertyImage.delete({ where: { id } });
      return { success: true, message: 'Image deleted' };
    } catch (error) {
      logger.error(`Failed to delete image ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete image', 500);
    }
  }

  async addPropertyVideo(propertyId: string, landlordId: string, data: { url: string; thumbnailUrl?: string; caption?: string }) {
    try {
      const property = await this.prisma.property.findUnique({
        where: { id: propertyId },
        select: { id: true, landlordId: true },
      });

      if (!property || property.landlordId !== landlordId) {
        throw new AppError('Property not found or not authorized', 404);
      }

      const video = await this.prisma.propertyVideo.create({
        data: {
          propertyId,
          url: data.url,
          thumbnailUrl: data.thumbnailUrl,
          caption: data.caption,
        },
      });

      return { success: true, data: video };
    } catch (error) {
      logger.error(`Failed to add video to property ${propertyId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to add video', 500);
    }
  }

  async getPropertyVideos(propertyId: string) {
    try {
      const videos = await this.prisma.propertyVideo.findMany({
        where: { propertyId },
        orderBy: { createdAt: 'desc' },
      });
      return { success: true, data: videos };
    } catch (error) {
      logger.error(`Failed to get videos for property ${propertyId}:`, error);
      throw new AppError('Failed to fetch videos', 500);
    }
  }

  async deletePropertyVideo(id: string, landlordId: string) {
    try {
      const video = await this.prisma.propertyVideo.findUnique({
        where: { id },
        include: { property: { select: { landlordId: true } } },
      });

      if (!video || video.property.landlordId !== landlordId) {
        throw new AppError('Video not found or not authorized', 404);
      }

      await this.prisma.propertyVideo.delete({ where: { id } });
      return { success: true, message: 'Video deleted' };
    } catch (error) {
      logger.error(`Failed to delete video ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete video', 500);
    }
  }

  async trackPropertyView(propertyId: string, userId?: string, ipAddress?: string, userAgent?: string) {
    try {
      const view = await this.prisma.propertyView.create({
        data: {
          propertyId,
          userId,
          ipAddress,
          userAgent,
        },
      });

      await this.prisma.property.update({
        where: { id: propertyId },
        data: { views: { increment: 1 } },
      });

      return { success: true, data: view };
    } catch (error) {
      logger.error(`Failed to track view for property ${propertyId}:`, error);
      throw new AppError('Failed to track view', 500);
    }
  }

  async getPropertyViews(propertyId: string, landlordId: string) {
    try {
      const property = await this.prisma.property.findUnique({
        where: { id: propertyId },
        select: { id: true, landlordId: true },
      });

      if (!property || property.landlordId !== landlordId) {
        throw new AppError('Property not found or not authorized', 404);
      }

      const views = await this.prisma.propertyView.findMany({
        where: { propertyId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });

      return { success: true, data: views };
    } catch (error) {
      logger.error(`Failed to get views for property ${propertyId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch views', 500);
    }
  }

  async getLandlordPublicProfile(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId, role: 'LANDLORD', deletedAt: null },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          profileImage: true,
          bio: true,
          isVerified: true,
          isOnline: true,
          lastSeen: true,
          responseTimeMinutes: true,
          totalProperties: true,
          rating: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new AppError('Landlord not found', 404);
      }

      const propertyCount = await this.prisma.property.count({
        where: { landlordId: userId, status: { in: ['ACTIVE', 'PUBLISHED'] }, deletedAt: null },
      });

      const reviews = await this.prisma.review.findMany({
        where: { targetType: 'landlord', targetId: userId, status: 'APPROVED' },
        select: { rating: true },
      });

      const averageRating = reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
        : 0;

      return {
        success: true,
        data: {
          ...user,
          propertyCount,
          averageRating: Math.round(averageRating * 100) / 100,
        },
      };
    } catch (error) {
      logger.error(`Failed to get landlord profile ${userId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch landlord profile', 500);
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

    if (errors.length > 0) {
      throw new AppError(errors.join(', '), 400);
    }
  }
}
