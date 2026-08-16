import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { body, param, query } from 'express-validator';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

export class NotificationService {
  private prisma: PrismaClient;
  private emailService: EmailService;
  private smsService: SmsService;

  constructor(prisma: PrismaClient, emailService: EmailService, smsService: SmsService) {
    this.prisma = prisma;
    this.emailService = emailService;
    this.smsService = smsService;
  }

  async sendNotification(data: { userId: string; type: string; title: string; message: string; channel?: string; data?: any }) {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          userId: data.userId,
          type: data.type as any,
          title: data.title,
          message: data.message,
          channel: (data.channel || 'IN_APP') as any,
          data: data.data,
        },
      });

      if (data.channel === 'EMAIL' || data.channel === 'ALL') {
        const user = await this.prisma.user.findUnique({
          where: { id: data.userId },
          select: { email: true, firstName: true },
        });

        if (user?.email) {
          await this.emailService.sendEmail({
            to: user.email,
            subject: data.title,
            html: `<p>${data.message}</p>`,
          });
        }
      }

      if (data.channel === 'SMS' || data.channel === 'ALL') {
        const user = await this.prisma.user.findUnique({
          where: { id: data.userId },
          select: { phone: true },
        });

        if (user?.phone) {
          await this.smsService.sendSMS(user.phone, `${data.title}: ${data.message}`);
        }
      }

      return {
        success: true,
        data: notification,
      };
    } catch (error) {
      logger.error('Failed to send notification:', error);
      throw new AppError('Failed to send notification', 500);
    }
  }

  async getNotifications(userId: string, filters?: { isRead?: boolean; type?: string; page?: number; limit?: number }) {
    try {
      const whereClause: any = { userId };

      if (filters?.isRead !== undefined) whereClause.isRead = filters.isRead;
      if (filters?.type) whereClause.type = filters.type;

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [notifications, total] = await Promise.all([
        this.prisma.notification.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.notification.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: notifications,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get notifications:', error);
      throw new AppError('Failed to fetch notifications', 500);
    }
  }

  async getUnreadCount(userId: string) {
    try {
      const count = await this.prisma.notification.count({
        where: { userId, isRead: false },
      });

      return {
        success: true,
        data: { count },
      };
    } catch (error) {
      logger.error('Failed to get unread count:', error);
      throw new AppError('Failed to fetch unread count', 500);
    }
  }

  async markAsRead(id: string, userId: string) {
    try {
      const notification = await this.prisma.notification.findUnique({
        where: { id },
        select: { id: true, userId: true },
      });

      if (!notification) {
        throw new AppError('Notification not found', 404);
      }

      if (notification.userId !== userId) {
        throw new AppError('Not authorized to mark this notification as read', 403);
      }

      await this.prisma.notification.update({
        where: { id },
        data: { isRead: true, readAt: new Date() },
      });

      return {
        success: true,
        message: 'Notification marked as read',
      };
    } catch (error) {
      logger.error(`Failed to mark notification ${id} as read:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to mark notification as read', 500);
    }
  }

  async markAllAsRead(userId: string) {
    try {
      await this.prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true, readAt: new Date() },
      });

      return {
        success: true,
        message: 'All notifications marked as read',
      };
    } catch (error) {
      logger.error('Failed to mark all notifications as read:', error);
      throw new AppError('Failed to mark notifications as read', 500);
    }
  }

  async deleteNotification(id: string, userId: string) {
    try {
      const notification = await this.prisma.notification.findUnique({
        where: { id },
        select: { id: true, userId: true },
      });

      if (!notification) {
        throw new AppError('Notification not found', 404);
      }

      if (notification.userId !== userId) {
        throw new AppError('Not authorized to delete this notification', 403);
      }

      await this.prisma.notification.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Notification deleted successfully',
      };
    } catch (error) {
      logger.error(`Failed to delete notification ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete notification', 500);
    }
  }

  async clearNotifications(userId: string, olderThan?: Date) {
    try {
      const whereClause: any = { userId };

      if (olderThan) {
        whereClause.createdAt = { lt: olderThan };
      }

      const result = await this.prisma.notification.deleteMany({
        where: whereClause,
      });

      return {
        success: true,
        message: `Cleared ${result.count} notifications`,
      };
    } catch (error) {
      logger.error('Failed to clear notifications:', error);
      throw new AppError('Failed to clear notifications', 500);
    }
  }

  async getPreferences(userId: string) {
    try {
      const preferences = await this.prisma.setting.findUnique({
        where: { key: `notification_preferences_${userId}` },
      });

      const defaultPreferences = {
        email: true,
        sms: false,
        push: true,
        marketing: false,
      };

      return {
        success: true,
        data: preferences ? preferences.value : defaultPreferences,
      };
    } catch (error) {
      logger.error('Failed to get notification preferences:', error);
      throw new AppError('Failed to fetch notification preferences', 500);
    }
  }

  async updatePreferences(userId: string, preferences: { email?: boolean; sms?: boolean; push?: boolean; marketing?: boolean }) {
    try {
      await this.prisma.setting.upsert({
        where: { key: `notification_preferences_${userId}` },
        update: { value: preferences },
        create: { key: `notification_preferences_${userId}`, value: preferences },
      });

      return {
        success: true,
        message: 'Notification preferences updated',
      };
    } catch (error) {
      logger.error('Failed to update notification preferences:', error);
      throw new AppError('Failed to update notification preferences', 500);
    }
  }
}
