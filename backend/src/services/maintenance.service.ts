import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { body, param, query } from 'express-validator';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

export class MaintenanceService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async createRequest(requestedById: string, data: { propertyId: string; title: string; description?: string; priority?: string; images?: string[] }) {
    try {
      const property = await this.prisma.property.findUnique({
        where: { id: data.propertyId },
        select: { id: true, landlordId: true, title: true },
      });

      if (!property) {
        throw new AppError('Property not found', 404);
      }

      const request = await this.prisma.maintenanceRequest.create({
        data: {
          propertyId: data.propertyId,
          requestedById,
          title: data.title,
          description: data.description,
          priority: (data.priority || 'MEDIUM') as any,
          images: data.images || [],
          status: 'PENDING',
        },
        include: {
          property: { select: { title: true, address: true } },
          requestedBy: { select: { firstName: true, lastName: true } },
        },
      });

      await this.notificationService.sendNotification({
        userId: property.landlordId,
        type: 'MAINTENANCE_REQUEST_CREATED',
        title: 'New Maintenance Request',
        message: `A new maintenance request "${data.title}" has been submitted for your property "${property.title}".`,
      });

      logger.info(`Maintenance request created: ${request.id}`);

      return {
        success: true,
        data: request,
      };
    } catch (error) {
      logger.error('Failed to create maintenance request:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create maintenance request', 500);
    }
  }

  async getRequests(userId: string, filters?: { propertyId?: string; status?: string; priority?: string; assignedTo?: string; page?: number; limit?: number }) {
    try {
      const whereClause: any = {
        OR: [{ requestedById: userId }, { assignedToId: userId }],
      };

      if (filters?.propertyId) whereClause.propertyId = filters.propertyId;
      if (filters?.status) whereClause.status = filters.status;
      if (filters?.priority) whereClause.priority = filters.priority;
      if (filters?.assignedTo) whereClause.assignedToId = filters.assignedTo;

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [requests, total] = await Promise.all([
        this.prisma.maintenanceRequest.findMany({
          where: whereClause,
          include: {
            property: { select: { title: true, address: true, images: true } },
            requestedBy: { select: { firstName: true, lastName: true } },
            assignedTo: { select: { firstName: true, lastName: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.maintenanceRequest.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: requests,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get maintenance requests:', error);
      throw new AppError('Failed to fetch maintenance requests', 500);
    }
  }

  async getRequest(id: string) {
    try {
      const request = await this.prisma.maintenanceRequest.findUnique({
        where: { id },
        include: {
          property: { select: { title: true, address: true, images: true } },
          requestedBy: { select: { firstName: true, lastName: true, phone: true } },
          assignedTo: { select: { firstName: true, lastName: true, phone: true } },
        },
      });

      if (!request) {
        throw new AppError('Maintenance request not found', 404);
      }

      return {
        success: true,
        data: request,
      };
    } catch (error) {
      logger.error(`Failed to get maintenance request ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch maintenance request', 500);
    }
  }

  async updateRequest(id: string, data: any) {
    try {
      const request = await this.prisma.maintenanceRequest.update({
        where: { id },
        data,
        include: {
          property: { select: { title: true } },
          requestedBy: { select: { firstName: true, lastName: true } },
        },
      });

      if (data.status) {
        await this.notificationService.sendNotification({
          userId: request.requestedById,
          type: 'MAINTENANCE_STATUS_UPDATED',
          title: 'Maintenance Request Updated',
          message: `Your maintenance request "${request.title}" status has been updated to: ${data.status}`,
        });
      }

      return {
        success: true,
        data: request,
      };
    } catch (error) {
      logger.error(`Failed to update maintenance request ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update maintenance request', 500);
    }
  }

  async assignRequest(id: string, assignedToId: string, notes?: string) {
    try {
      const request = await this.prisma.maintenanceRequest.update({
        where: { id },
        data: { assignedToId, status: 'IN_PROGRESS', notes },
        include: {
          property: { select: { title: true } },
          requestedBy: { select: { firstName: true, lastName: true } },
          assignedTo: { select: { firstName: true, lastName: true } },
        },
      });

      await this.notificationService.sendNotification({
        userId: assignedToId,
        type: 'MAINTENANCE_ASSIGNED',
        title: 'Maintenance Request Assigned',
        message: `You have been assigned a maintenance request: "${request.title}".`,
      });

      return {
        success: true,
        data: request,
      };
    } catch (error) {
      logger.error(`Failed to assign maintenance request ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to assign maintenance request', 500);
    }
  }

  async completeRequest(id: string, completionNotes?: string, completionImages?: string[]) {
    try {
      const request = await this.prisma.maintenanceRequest.update({
        where: { id },
        data: { status: 'COMPLETED', completionNotes, completionImages: completionImages || [], completedAt: new Date() },
        include: {
          property: { select: { title: true } },
          requestedBy: { select: { firstName: true, lastName: true } },
        },
      });

      await this.notificationService.sendNotification({
        userId: request.requestedById,
        type: 'MAINTENANCE_COMPLETED',
        title: 'Maintenance Request Completed',
        message: `Your maintenance request "${request.title}" has been completed.`,
      });

      return {
        success: true,
        data: request,
      };
    } catch (error) {
      logger.error(`Failed to complete maintenance request ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to complete maintenance request', 500);
    }
  }

  async cancelRequest(id: string, userId: string, reason: string) {
    try {
      const request = await this.prisma.maintenanceRequest.findUnique({
        where: { id },
        select: { id: true, requestedById: true },
      });

      if (!request) {
        throw new AppError('Maintenance request not found', 404);
      }

      if (request.requestedById !== userId) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { role: true },
        });
        if (!user || (user.role !== 'ADMIN' && user.role !== 'LANDLORD')) {
          throw new AppError('Not authorized to cancel this request', 403);
        }
      }

      await this.prisma.maintenanceRequest.update({
        where: { id },
        data: { status: 'CANCELLED', cancellationReason: reason },
      });

      return {
        success: true,
        message: 'Maintenance request cancelled',
      };
    } catch (error) {
      logger.error(`Failed to cancel maintenance request ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to cancel maintenance request', 500);
    }
  }

  async getMaintenanceStats(filters?: { propertyId?: string; startDate?: Date; endDate?: Date }) {
    try {
      const whereClause: any = {};

      if (filters?.propertyId) whereClause.propertyId = filters.propertyId;
      if (filters?.startDate || filters?.endDate) {
        whereClause.createdAt = {};
        if (filters.startDate) (whereClause.createdAt as { gte?: Date }).gte = filters.startDate;
        if (filters.endDate) (whereClause.createdAt as { lte?: Date }).lte = filters.endDate;
      }

      const [total, pending, inProgress, completed, cancelled] = await Promise.all([
        this.prisma.maintenanceRequest.count({ where: whereClause }),
        this.prisma.maintenanceRequest.count({ where: { ...whereClause, status: 'PENDING' } }),
        this.prisma.maintenanceRequest.count({ where: { ...whereClause, status: 'IN_PROGRESS' } }),
        this.prisma.maintenanceRequest.count({ where: { ...whereClause, status: 'COMPLETED' } }),
        this.prisma.maintenanceRequest.count({ where: { ...whereClause, status: 'CANCELLED' } }),
      ]);

      return {
        success: true,
        data: { total, pending, inProgress, completed, cancelled },
      };
    } catch (error) {
      logger.error('Failed to get maintenance stats:', error);
      throw new AppError('Failed to fetch maintenance stats', 500);
    }
  }
}
