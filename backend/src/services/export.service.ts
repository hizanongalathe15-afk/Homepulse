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

export class ExportService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async exportProperties(filters?: { city?: string; type?: string; status?: string; startDate?: Date; endDate?: Date }) {
    try {
      const whereClause: any = {};

      if (filters?.city) whereClause.city = { contains: filters.city, mode: 'insensitive' };
      if (filters?.type) whereClause.type = filters.type;
      if (filters?.status) whereClause.status = filters.status;
      if (filters?.startDate || filters?.endDate) {
        whereClause.createdAt = {};
        if (filters.startDate) (whereClause.createdAt as { gte?: Date }).gte = filters.startDate;
        if (filters.endDate) (whereClause.createdAt as { lte?: Date }).lte = filters.endDate;
      }

      const properties = await this.prisma.property.findMany({
        where: whereClause,
        include: {
          landlord: { select: { firstName: true, lastName: true, email: true } },
          reviews: { select: { rating: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      const csvData = properties.map((p) => ({
        id: p.id,
        title: p.title,
        type: p.type,
        status: p.status,
        price: p.price,
        currency: p.currency,
        city: p.city,
        neighborhood: p.neighborhood,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        landlord: `${p.landlord.firstName} ${p.landlord.lastName}`,
        createdAt: p.createdAt,
      }));

      return {
        success: true,
        data: csvData,
        count: csvData.length,
      };
    } catch (error) {
      logger.error('Failed to export properties:', error);
      throw new AppError('Failed to export properties', 500);
    }
  }

  async exportPayments(filters?: { userId?: string; method?: string; status?: string; startDate?: Date; endDate?: Date }) {
    try {
      const whereClause: any = {};

      if (filters?.userId) whereClause.userId = filters.userId;
      if (filters?.method) whereClause.method = filters.method;
      if (filters?.status) whereClause.status = filters.status;
      if (filters?.startDate || filters?.endDate) {
        whereClause.createdAt = {};
        if (filters.startDate) (whereClause.createdAt as { gte?: Date }).gte = filters.startDate;
        if (filters.endDate) (whereClause.createdAt as { lte?: Date }).lte = filters.endDate;
      }

      const payments = await this.prisma.payment.findMany({
        where: whereClause,
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      });

      const csvData = payments.map((p) => ({
        id: p.id,
        user: `${p.user.firstName} ${p.user.lastName}`,
        email: p.user.email,
        amount: p.amount,
        currency: p.currency,
        method: p.method,
        status: p.status,
        type: p.type,
        transactionId: p.transactionId,
        createdAt: p.createdAt,
      }));

      return {
        success: true,
        data: csvData,
        count: csvData.length,
      };
    } catch (error) {
      logger.error('Failed to export payments:', error);
      throw new AppError('Failed to export payments', 500);
    }
  }

  async exportMaintenanceReports(filters?: { propertyId?: string; status?: string; startDate?: Date; endDate?: Date }) {
    try {
      const whereClause: any = {};

      if (filters?.propertyId) whereClause.propertyId = filters.propertyId;
      if (filters?.status) whereClause.status = filters.status;
      if (filters?.startDate || filters?.endDate) {
        whereClause.createdAt = {};
        if (filters.startDate) (whereClause.createdAt as { gte?: Date }).gte = filters.startDate;
        if (filters.endDate) (whereClause.createdAt as { lte?: Date }).lte = filters.endDate;
      }

      const requests = await this.prisma.maintenanceRequest.findMany({
        where: whereClause,
        include: {
          property: { select: { title: true, address: true } },
          requestedBy: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      const csvData = requests.map((r) => ({
        id: r.id,
        property: r.property.title,
        address: r.property.address,
        title: r.title,
        description: r.description,
        priority: r.priority,
        status: r.status,
        requestedBy: `${r.requestedBy.firstName} ${r.requestedBy.lastName}`,
        createdAt: r.createdAt,
        completedAt: r.completedAt,
      }));

      return {
        success: true,
        data: csvData,
        count: csvData.length,
      };
    } catch (error) {
      logger.error('Failed to export maintenance reports:', error);
      throw new AppError('Failed to export maintenance reports', 500);
    }
  }

  async requestUserDataExport(userId: string, format: string = 'json') {
    try {
      const exportRequest = await this.prisma.dataExportRequest.create({
        data: {
          userId,
          format,
          status: 'pending',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
      
      await this.processExportRequest(exportRequest.id);
      
      return exportRequest;
    } catch (error) {
      logger.error('Failed to request data export:', error);
      throw new AppError('Failed to request data export', 500);
    }
  }

  async processExportRequest(requestId: string) {
    try {
      const request = await this.prisma.dataExportRequest.findUnique({
        where: { id: requestId },
      });
      if (!request) throw new AppError('Export request not found', 404);
      
      const user = await this.prisma.user.findUnique({
        where: { id: request.userId },
        include: {
          properties: true,
          payments: true,
          reviews: true,
          chatMessages: true,
          notifications: true,
          identityVerifications: true,
          referralsMade: true,
          referralsReceived: true,
          escrowTransactions: true,
          roommateProfile: true,
          savedSearches: true,
          privacySettings: true,
          profileVideo: true,
          profileMusic: true,
          profileCard: true,
          locationFuzzPreference: true,
          settings: true,
        },
      });
      
      const exportData = {
        user: {
          id: user?.id,
          email: user?.email,
          firstName: user?.firstName,
          lastName: user?.lastName,
          phone: user?.phone,
          role: user?.role,
          createdAt: user?.createdAt,
          updatedAt: user?.updatedAt,
        },
        properties: user?.properties,
        payments: user?.payments,
        reviews: user?.reviews,
        chatMessages: user?.chatMessages,
        notifications: user?.notifications,
        identityVerifications: user?.identityVerifications,
        referrals: [...(user?.referralsMade || []), ...(user?.referralsReceived || [])],
        escrowTransactions: user?.escrowTransactions,
        roommateProfile: user?.roommateProfile,
        savedSearches: user?.savedSearches,
        privacySettings: user?.privacySettings,
        profileVideo: user?.profileVideo,
        profileMusic: user?.profileMusic,
        profileCard: user?.profileCard,
        locationFuzzPreference: user?.locationFuzzPreference,
        exportedAt: new Date(),
      };
      
      await this.prisma.dataExportRequest.update({
        where: { id: requestId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          fileUrl: JSON.stringify(exportData),
        },
      });
    } catch (error) {
      logger.error('Failed to process export request:', error);
      await this.prisma.dataExportRequest.update({
        where: { id: requestId },
        data: { status: 'failed' },
      });
      throw error;
    }
  }

  async requestDataDeletion(userId: string, reason?: string) {
    try {
      const deleteRequest = await this.prisma.dataDeleteRequest.create({
        data: {
          userId,
          reason,
          status: 'pending',
        },
      });
      
      await this.processDeleteRequest(deleteRequest.id);
      
      return deleteRequest;
    } catch (error) {
      logger.error('Failed to request data deletion:', error);
      throw new AppError('Failed to request data deletion', 500);
    }
  }

  async processDeleteRequest(requestId: string) {
    try {
      const request = await this.prisma.dataDeleteRequest.findUnique({
        where: { id: requestId },
      });
      if (!request) throw new AppError('Delete request not found', 404);
      
      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: request.userId },
          data: { status: 'INACTIVE', deletedAt: new Date(), email: `deleted_${request.userId}@deleted.com` },
        }),
        this.prisma.chatMessage.deleteMany({
          where: { OR: [{ senderId: request.userId }, { receiverId: request.userId }] },
        }),
        this.prisma.propertyComment.deleteMany({
          where: { userId: request.userId },
        }),
        this.prisma.commentLike.deleteMany({
          where: { userId: request.userId },
        }),
        this.prisma.propertyLike.deleteMany({
          where: { userId: request.userId },
        }),
        this.prisma.userFollow.deleteMany({
          where: { OR: [{ followerId: request.userId }, { followingId: request.userId }] },
        }),
        this.prisma.userBlock.deleteMany({
          where: { OR: [{ blockerId: request.userId }, { blockedId: request.userId }] },
        }),
      ]);
      
      await this.prisma.dataDeleteRequest.update({
        where: { id: requestId },
        data: { status: 'completed', completedAt: new Date() },
      });
    } catch (error) {
      logger.error('Failed to process delete request:', error);
      await this.prisma.dataDeleteRequest.update({
        where: { id: requestId },
        data: { status: 'failed' },
      });
      throw error;
    }
  }

  async getExportStatus(userId: string) {
    try {
      return await this.prisma.dataExportRequest.findFirst({
        where: { userId },
        orderBy: { requestedAt: 'desc' },
      });
    } catch (error) {
      logger.error('Failed to get export status:', error);
      throw new AppError('Failed to get export status', 500);
    }
  }

  async getDeleteStatus(userId: string) {
    try {
      return await this.prisma.dataDeleteRequest.findFirst({
        where: { userId },
        orderBy: { requestedAt: 'desc' },
      });
    } catch (error) {
      logger.error('Failed to get delete status:', error);
      throw new AppError('Failed to get delete status', 500);
    }
  }

  async cancelDeletion(requestId: string) {
    try {
      const request = await this.prisma.dataDeleteRequest.findUnique({
        where: { id: requestId },
      });
      if (!request) throw new AppError('Delete request not found', 404);
      if (request.status !== 'pending') throw new AppError('Cannot cancel a non-pending deletion request', 400);

      await this.prisma.dataDeleteRequest.update({
        where: { id: requestId },
        data: { status: 'cancelled', cancelledAt: new Date() },
      });
      return { success: true, message: 'Deletion request cancelled' };
    } catch (error) {
      logger.error('Failed to cancel deletion:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to cancel deletion', 500);
    }
  }
}
