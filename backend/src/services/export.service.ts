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
}
