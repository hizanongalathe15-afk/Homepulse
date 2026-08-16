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

export class SafetyService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async createSOSAlert(userId: string, data: { type: string; location?: string; latitude?: number; longitude?: number; message?: string }) {
    try {
      const alert = await this.prisma.sOSAlert.create({
        data: {
          userId,
          type: data.type as any,
          location: data.location,
          latitude: data.latitude,
          longitude: data.longitude,
          message: data.message,
          status: 'ACTIVE',
        },
        include: { user: { select: { firstName: true, lastName: true, phone: true } } },
      });

      await this.notificationService.sendNotification({
        userId,
        type: 'SOS_ALERT_CREATED',
        title: 'SOS Alert Created',
        message: `Your SOS alert has been created and emergency services have been notified.`,
      });

      logger.info(`SOS alert created: ${alert.id} by user ${userId}`);

      return {
        success: true,
        data: alert,
      };
    } catch (error) {
      logger.error('Failed to create SOS alert:', error);
      throw new AppError('Failed to create SOS alert', 500);
    }
  }

  async getSOSAlert(id: string) {
    try {
      const alert = await this.prisma.sOSAlert.findUnique({
        where: { id },
        include: { user: { select: { firstName: true, lastName: true, phone: true } } },
      });

      if (!alert) {
        throw new AppError('SOS alert not found', 404);
      }

      return {
        success: true,
        data: alert,
      };
    } catch (error) {
      logger.error(`Failed to get SOS alert ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch SOS alert', 500);
    }
  }

  async getMySOSAlerts(userId: string, filters?: { status?: string; page?: number; limit?: number }) {
    try {
      const whereClause: any = { userId };

      if (filters?.status) whereClause.status = filters.status;

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [alerts, total] = await Promise.all([
        this.prisma.sOSAlert.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.sOSAlert.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: alerts,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get SOS alerts:', error);
      throw new AppError('Failed to fetch SOS alerts', 500);
    }
  }

  async resolveSOSAlert(id: string, userId: string) {
    try {
      const alert = await this.prisma.sOSAlert.findUnique({
        where: { id },
        select: { id: true, userId: true, status: true },
      });

      if (!alert) {
        throw new AppError('SOS alert not found', 404);
      }

      if (alert.userId !== userId) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { role: true },
        });
        if (!user || (user.role !== 'ADMIN' && user.role !== 'LANDLORD')) {
          throw new AppError('Not authorized to resolve this SOS alert', 403);
        }
      }

      if (alert.status === 'RESOLVED') {
        throw new AppError('SOS alert is already resolved', 400);
      }

      const resolvedAlert = await this.prisma.sOSAlert.update({
        where: { id },
        data: { status: 'RESOLVED', resolvedAt: new Date() },
      });

      await this.notificationService.sendNotification({
        userId: alert.userId,
        type: 'SOS_ALERT_RESOLVED',
        title: 'SOS Alert Resolved',
        message: 'Your SOS alert has been resolved. Emergency services have been notified.',
      });

      logger.info(`SOS alert resolved: ${id}`);

      return {
        success: true,
        data: resolvedAlert,
      };
    } catch (error) {
      logger.error(`Failed to resolve SOS alert ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to resolve SOS alert', 500);
    }
  }

  async createSafetyReport(userId: string, data: { type: string; title: string; description?: string; location?: string; images?: string[] }) {
    try {
      const report = await this.prisma.safetyReport.create({
        data: {
          userId,
          type: data.type as any,
          title: data.title,
          description: data.description,
          location: data.location,
          images: data.images || [],
          status: 'OPEN',
        },
        include: { user: { select: { firstName: true, lastName: true } } },
      });

      await this.notificationService.sendNotification({
        userId,
        type: 'SAFETY_REPORT_CREATED',
        title: 'Safety Report Submitted',
        message: `Your safety report "${data.title}" has been submitted and will be reviewed.`,
      });

      logger.info(`Safety report created: ${report.id} by user ${userId}`);

      return {
        success: true,
        data: report,
      };
    } catch (error) {
      logger.error('Failed to create safety report:', error);
      throw new AppError('Failed to create safety report', 500);
    }
  }

  async getSafetyReports(filters?: { type?: string; status?: string; userId?: string; page?: number; limit?: number }) {
    try {
      const whereClause: any = {};

      if (filters?.type) whereClause.type = filters.type;
      if (filters?.status) whereClause.status = filters.status;
      if (filters?.userId) whereClause.userId = filters.userId;

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [reports, total] = await Promise.all([
        this.prisma.safetyReport.findMany({
          where: whereClause,
          include: { user: { select: { firstName: true, lastName: true, email: true } } },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.safetyReport.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: reports,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get safety reports:', error);
      throw new AppError('Failed to fetch safety reports', 500);
    }
  }

  async assignSafetyReport(id: string, assignedToId: string) {
    try {
      const report = await this.prisma.safetyReport.update({
        where: { id },
        data: { assignedToId, status: 'IN_REVIEW' },
        include: { user: { select: { firstName: true, lastName: true } } },
      });

      await this.notificationService.sendNotification({
        userId: assignedToId,
        type: 'SAFETY_REPORT_ASSIGNED',
        title: 'Safety Report Assigned',
        message: `You have been assigned a safety report: "${report.title}".`,
      });

      return {
        success: true,
        data: report,
      };
    } catch (error) {
      logger.error(`Failed to assign safety report ${id}:`, error);
      throw new AppError('Failed to assign safety report', 500);
    }
  }

  async resolveSafetyReport(id: string, resolution: string) {
    try {
      const report = await this.prisma.safetyReport.update({
        where: { id },
        data: { status: 'RESOLVED', resolution, resolvedAt: new Date() },
        include: { user: { select: { firstName: true, lastName: true } } },
      });

      await this.notificationService.sendNotification({
        userId: report.userId,
        type: 'SAFETY_REPORT_RESOLVED',
        title: 'Safety Report Resolved',
        message: `Your safety report "${report.title}" has been resolved.`,
      });

      return {
        success: true,
        data: report,
      };
    } catch (error) {
      logger.error(`Failed to resolve safety report ${id}:`, error);
      throw new AppError('Failed to resolve safety report', 500);
    }
  }
}
