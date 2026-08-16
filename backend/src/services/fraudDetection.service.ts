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

export class FraudDetectionService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async detectSuspiciousActivity(userId: string) {
    try {
      const recentPayments = await this.prisma.payment.findMany({
        where: { userId, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
        select: { amount: true, method: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      });

      const totalAmount = recentPayments.reduce((sum, p) => sum + p.amount, 0);
      const fraudIndicators: string[] = [];

      if (recentPayments.length > 10) {
        fraudIndicators.push('High frequency of payments');
      }

      if (totalAmount > 100000) {
        fraudIndicators.push('High transaction volume');
      }

      const methods = recentPayments.map((p) => p.method);
      const uniqueMethods = new Set(methods).size;
      if (uniqueMethods > 3) {
        fraudIndicators.push('Multiple payment methods used');
      }

      if (fraudIndicators.length > 0) {
        await this.notificationService.sendNotification({
          userId,
          type: 'FRAUD_ALERT',
          title: 'Suspicious Activity Detected',
          message: `We detected suspicious activity on your account: ${fraudIndicators.join(', ')}. Please review your recent transactions.`,
        });

        return {
          success: true,
          isSuspicious: true,
          indicators: fraudIndicators,
        };
      }

      return {
        success: true,
        isSuspicious: false,
        indicators: [],
      };
    } catch (error) {
      logger.error('Fraud detection failed:', error);
      throw new AppError('Fraud detection failed', 500);
    }
  }

  async reportFraud(reportedBy: string, data: { entityType: string; entityId: string; reason: string; details?: string }) {
    try {
      const report = await this.prisma.fraudReport.create({
        data: {
          reportedById: reportedBy,
          entityType: data.entityType,
          entityId: data.entityId,
          reason: data.reason,
          details: data.details,
          status: 'OPEN',
        },
      });

      return {
        success: true,
        data: report,
      };
    } catch (error) {
      logger.error('Failed to report fraud:', error);
      throw new AppError('Failed to report fraud', 500);
    }
  }

  async getFraudReports(filters?: { status?: string; entityType?: string; page?: number; limit?: number }) {
    try {
      const whereClause: any = {};

      if (filters?.status) whereClause.status = filters.status;
      if (filters?.entityType) whereClause.entityType = filters.entityType;

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [reports, total] = await Promise.all([
        this.prisma.fraudReport.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.fraudReport.count({ where: whereClause }),
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
      logger.error('Failed to get fraud reports:', error);
      throw new AppError('Failed to fetch fraud reports', 500);
    }
  }
}
