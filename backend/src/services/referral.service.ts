import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { body, param, query } from 'express-validator';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

export class ReferralService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async createReferral(referrerId: string, data: { code: string; rewardType?: string; rewardAmount?: number }) {
    try {
      const existingReferral = await this.prisma.referral.findFirst({
        where: { code: data.code },
      });

      if (existingReferral) {
        throw new AppError('Referral code already exists', 409);
      }

      const referral = await this.prisma.referral.create({
        data: {
          referrerId,
          code: data.code,
          rewardType: (data.rewardType || 'CREDITS') as any,
          rewardAmount: data.rewardAmount || 0,
          status: 'PENDING',
        },
        include: { referrer: { select: { firstName: true, lastName: true, email: true } } },
      });

      logger.info(`Referral created: ${referral.id} with code ${data.code}`);

      return {
        success: true,
        data: referral,
      };
    } catch (error) {
      logger.error('Failed to create referral:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create referral', 500);
    }
  }

  async getReferrals(filters?: { referrerId?: string; status?: string; page?: number; limit?: number }) {
    try {
      const whereClause: any = {};

      if (filters?.referrerId) whereClause.referrerId = filters.referrerId;
      if (filters?.status) whereClause.status = filters.status;

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [referrals, total] = await Promise.all([
        this.prisma.referral.findMany({
          where: whereClause,
          include: { referrer: { select: { firstName: true, lastName: true } }, referee: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.referral.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: referrals,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get referrals:', error);
      throw new AppError('Failed to fetch referrals', 500);
    }
  }

  async getReferral(id: string) {
    try {
      const referral = await this.prisma.referral.findUnique({
        where: { id },
        include: { referrer: { select: { firstName: true, lastName: true, email: true } }, referee: { select: { firstName: true, lastName: true, email: true } } },
      });

      if (!referral) {
        throw new AppError('Referral not found', 404);
      }

      return {
        success: true,
        data: referral,
      };
    } catch (error) {
      logger.error(`Failed to get referral ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch referral', 500);
    }
  }

  async redeemReferral(code: string, refereeId: string) {
    try {
      const referral = await this.prisma.referral.findFirst({
        where: { code, status: 'PENDING' },
        include: { referrer: { select: { id: true, firstName: true, lastName: true } } },
      });

      if (!referral) {
        throw new AppError('Invalid or expired referral code', 404);
      }

      if (referral.referrerId === refereeId) {
        throw new AppError('Cannot use your own referral code', 400);
      }

      const updatedReferral = await this.prisma.referral.update({
        where: { id: referral.id },
        data: { refereeId, status: 'REDEEMED', redeemedAt: new Date() },
        include: { referrer: { select: { firstName: true, lastName: true } } },
      });

      await this.notificationService.sendNotification({
        userId: referral.referrerId,
        type: 'REFERRAL_REDEEMED',
        title: 'Referral Redeemed!',
        message: `Your referral code was used. You've earned ${referral.rewardType} ${referral.rewardAmount || 0}!`,
      });

      await this.notificationService.sendNotification({
        userId: refereeId,
        type: 'REFERRAL_USED',
        title: 'Referral Applied',
        message: `You used a referral code and received a reward!`,
      });

      logger.info(`Referral redeemed: ${referral.id} by ${refereeId}`);

      return {
        success: true,
        data: updatedReferral,
      };
    } catch (error) {
      logger.error('Failed to redeem referral:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to redeem referral', 500);
    }
  }

  async getMyReferrals(userId: string, filters?: { page?: number; limit?: number }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [referrals, total] = await Promise.all([
        this.prisma.referral.findMany({
          where: { OR: [{ referrerId: userId }, { refereeId: userId }] },
          include: { referrer: { select: { firstName: true, lastName: true } }, referee: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.referral.count({ where: { OR: [{ referrerId: userId }, { refereeId: userId }] } }),
      ]);

      return {
        success: true,
        data: referrals,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get my referrals:', error);
      throw new AppError('Failed to fetch referrals', 500);
    }
  }

  async getReferralStats(userId: string) {
    try {
      const [totalReferrals, successfulReferrals, totalRewards] = await Promise.all([
        this.prisma.referral.count({ where: { referrerId: userId } }),
        this.prisma.referral.count({ where: { referrerId: userId, status: 'REDEEMED' } }),
        this.prisma.referral.aggregate({
          where: { referrerId: userId, status: 'REDEEMED' },
          _sum: { rewardAmount: true },
        }),
      ]);

      return {
        success: true,
        data: {
          totalReferrals,
          successfulReferrals,
          totalRewards: totalRewards._sum.rewardAmount || 0,
        },
      };
    } catch (error) {
      logger.error('Failed to get referral stats:', error);
      throw new AppError('Failed to fetch referral stats', 500);
    }
  }
}
