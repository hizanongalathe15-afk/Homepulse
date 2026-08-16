import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { AnalyticsService } from './analytics.service';
import { NotificationService } from './notification.service';

export interface DashboardStats {
  totalUsers: number;
  totalProperties: number;
  totalListings: number;
  totalRevenue: number;
  activeListings: number;
  pendingApprovals: number;
  totalPayments: number;
  recentActivity: Array<{ id: string; type: string; message: string; timestamp: Date }>;
}

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  city?: string;
  page?: number;
  limit?: number;
  offset?: number;
}

export interface AdminPropertyFilters {
  status?: string;
  city?: string;
  landlordId?: string;
  page?: number;
  limit?: number;
  offset?: number;
}

export class AdminService {
  private prisma: PrismaClient;
  private analyticsService: AnalyticsService;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, analyticsService: AnalyticsService, notificationService: NotificationService) {
    this.prisma = prisma;
    this.analyticsService = analyticsService;
    this.notificationService = notificationService;
  }

  async getDashboard(): Promise<DashboardStats> {
    try {
      const [
        totalUsers,
        totalProperties,
        totalListings,
        totalRevenue,
        activeListings,
        pendingApprovals,
        totalPayments,
        recentActivity,
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.property.count(),
        this.prisma.property.count({ where: { status: 'ACTIVE' } }),
        this.prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
        this.prisma.property.count({ where: { status: 'ACTIVE' } }),
        this.prisma.property.count({ where: { status: 'PENDING' } }),
        this.prisma.payment.count({ where: { status: 'COMPLETED' } }),
        this.getRecentActivity(),
      ]);

      return {
        totalUsers,
        totalProperties,
        totalListings,
        totalRevenue: totalRevenue._sum.amount || 0,
        activeListings,
        pendingApprovals,
        totalPayments,
        recentActivity,
      };
    } catch (error) {
      logger.error('Failed to get admin dashboard:', error);
      throw new AppError('Failed to fetch dashboard', 500);
    }
  }

  async getUsers(filters?: UserFilters): Promise<{ users: any[]; total: number; hasMore: boolean }> {
    try {
      const whereClause: any = {};

      if (filters?.role) whereClause.role = filters.role;
      if (filters?.status) whereClause.status = filters.status;
      if (filters?.city) whereClause.city = filters.city;
      if (filters?.search) {
        whereClause.OR = [
          { firstName: { contains: filters.search, mode: 'insensitive' } },
          { lastName: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const limit = filters?.limit || 20;
      const offset = filters?.offset || 0;

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            status: true,
            isVerified: true,
            city: true,
            createdAt: true,
          },
        }),
        this.prisma.user.count({ where: whereClause }),
      ]);

      return { users, total, hasMore: total > offset + limit };
    } catch (error) {
      logger.error('Failed to get users:', error);
      throw new AppError('Failed to fetch users', 500);
    }
  }

  async getUser(id: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          isVerified: true,
          city: true,
          createdAt: true,
        },
      });
      if (!user) throw new AppError('User not found', 404);
      return user;
    } catch (error) {
      logger.error(`Failed to get user ${id}:`, error);
      throw new AppError('Failed to fetch user', 500);
    }
  }

  async updateUser(id: string, data: any): Promise<any> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          isVerified: true,
        },
      });
      return user;
    } catch (error) {
      logger.error(`Failed to update user ${id}:`, error);
      throw new AppError('Failed to update user', 500);
    }
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.user.update({
        where: { id },
        data: { status: 'INACTIVE', deletedAt: new Date() },
      });
      return { message: 'User deactivated successfully' };
    } catch (error) {
      logger.error(`Failed to delete user ${id}:`, error);
      throw new AppError('Failed to delete user', 500);
    }
  }

  async getProperties(filters?: AdminPropertyFilters): Promise<{ properties: any[]; total: number; hasMore: boolean }> {
    try {
      const whereClause: any = {};
      if (filters?.status) whereClause.status = filters.status;
      if (filters?.city) whereClause.city = filters.city;
      if (filters?.landlordId) whereClause.landlordId = filters.landlordId;

      const limit = filters?.limit || 20;
      const offset = filters?.offset || 0;

      const [properties, total] = await Promise.all([
        this.prisma.property.findMany({
          where: whereClause,
          include: { landlord: { select: { firstName: true, lastName: true, email: true } } },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        this.prisma.property.count({ where: whereClause }),
      ]);

      return { properties, total, hasMore: total > offset + limit };
    } catch (error) {
      logger.error('Failed to get properties:', error);
      throw new AppError('Failed to fetch properties', 500);
    }
  }

  async approveProperty(id: string, approved: boolean, reason?: string, adminId?: string): Promise<{ id: string; status: string }> {
    try {
      const status = approved ? 'ACTIVE' : 'REJECTED';
      const property = await this.prisma.property.update({
        where: { id },
        data: { status: status as any, rejectionReason: reason, approvedById: adminId },
        select: { id: true, status: true },
      });
      return property;
    } catch (error) {
      logger.error(`Failed to approve property ${id}:`, error);
      throw new AppError('Failed to approve property', 500);
    }
  }

  async getPayments(filters?: any): Promise<{ payments: any[]; total: number; hasMore: boolean }> {
    try {
      const whereClause: any = {};
      if (filters?.method) whereClause.method = filters.method;
      if (filters?.status) whereClause.status = filters.status;
      if (filters?.startDate || filters?.endDate) {
        whereClause.createdAt = {};
        if (filters.startDate) (whereClause.createdAt as { gte?: Date }).gte = filters.startDate as Date;
        if (filters.endDate) (whereClause.createdAt as { lte?: Date }).lte = filters.endDate as Date;
      }

      const limit = (filters?.limit as number) || 20;
      const offset = (filters?.offset as number) || 0;

      const [payments, total] = await Promise.all([
        this.prisma.payment.findMany({
          where: whereClause,
          include: { user: { select: { firstName: true, lastName: true, email: true } } },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        this.prisma.payment.count({ where: whereClause }),
      ]);

      return { payments, total, hasMore: total > offset + limit };
    } catch (error) {
      logger.error('Failed to get payments:', error);
      throw new AppError('Failed to fetch payments', 500);
    }
  }

  async getSettings(): Promise<any> {
    try {
      const settings = await this.prisma.setting.findMany();
      const settingsMap: any = {};
      for (const setting of settings) {
        settingsMap[setting.key] = setting.value;
      }
      return settingsMap;
    } catch (error) {
      logger.error('Failed to get settings:', error);
      throw new AppError('Failed to fetch settings', 500);
    }
  }

  async updateSettings(data: any): Promise<any> {
    try {
      for (const [key, value] of Object.entries(data)) {
        await this.prisma.setting.upsert({
          where: { key },
          update: { value: value as any },
          create: { key, value: value as any },
        });
      }
      return data;
    } catch (error) {
      logger.error('Failed to update settings:', error);
      throw new AppError('Failed to update settings', 500);
    }
  }

  async broadcastMessage(data: { title: string; message: string; channels: string[]; targetRoles?: string[]; senderId: string }): Promise<{ sent: number; failed: number }> {
    try {
      let sent = 0;
      let failed = 0;

      const whereClause: any = { isActive: true };
      if (data.targetRoles && data.targetRoles.length > 0) {
        whereClause.role = { in: data.targetRoles };
      }

      const users = await this.prisma.user.findMany({
        where: whereClause,
        select: { id: true },
      });

      for (const user of users) {
        try {
          await this.notificationService.sendNotification({
            userId: user.id,
            type: 'ADMIN_BROADCAST',
            title: data.title,
            message: data.message,
             channel: data.channels as any,
          });
          sent++;
        } catch (error) {
          failed++;
        }
      }

      return { sent, failed };
    } catch (error) {
      logger.error('Failed to broadcast message:', error);
      throw new AppError('Failed to broadcast message', 500);
    }
  }

  private async getRecentActivity(): Promise<Array<{ id: string; type: string; message: string; timestamp: Date }>> {
    try {
      const activities: Array<{ id: string; type: string; message: string; timestamp: Date }> = [];

      const recentUsers = await this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, firstName: true, createdAt: true },
      });

      for (const user of recentUsers) {
        activities.push({
          id: user.id,
          type: 'user_registered',
          message: `New user registered: ${user.firstName}`,
          timestamp: user.createdAt,
        });
      }

      return activities.slice(0, 10);
    } catch (error) {
      logger.error('Failed to get recent activity:', error);
      return [];
    }
  }
}
