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

export class RoommateMatchingService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async createProfile(userId: string, data: { preferences?: any; budgetMin?: number; budgetMax?: number; moveInDate?: Date; duration?: string; lifestyle?: string[]; bio?: string }) {
    try {
      const profile = await this.prisma.roommateProfile.upsert({
        where: { userId },
        update: {
          preferences: data.preferences,
          budgetMin: data.budgetMin,
          budgetMax: data.budgetMax,
          moveInDate: data.moveInDate,
          duration: data.duration,
          lifestyle: data.lifestyle || [],
          bio: data.bio,
        },
        create: {
          userId,
          preferences: data.preferences,
          budgetMin: data.budgetMin,
          budgetMax: data.budgetMax,
          moveInDate: data.moveInDate,
          duration: data.duration,
          lifestyle: data.lifestyle || [],
          bio: data.bio,
        },
      });

      return {
        success: true,
        data: profile,
      };
    } catch (error) {
      logger.error('Failed to create roommate profile:', error);
      throw new AppError('Failed to create roommate profile', 500);
    }
  }

  async getProfile(userId: string) {
    try {
      const profile = await this.prisma.roommateProfile.findUnique({
        where: { userId },
      });

      if (!profile) {
        throw new AppError('Roommate profile not found', 404);
      }

      return {
        success: true,
        data: profile,
      };
    } catch (error) {
      logger.error(`Failed to get roommate profile for ${userId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch roommate profile', 500);
    }
  }

  async findMatches(userId: string, filters?: { city?: string; minBudget?: number; maxBudget?: number; moveInDate?: Date; page?: number; limit?: number }) {
    try {
      const myProfile = await this.prisma.roommateProfile.findUnique({
        where: { userId },
      });

      if (!myProfile) {
        throw new AppError('Please create a roommate profile first', 404);
      }

      const whereClause: any = {
        userId: { not: userId },
      };

      if (filters?.city) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { city: true },
        });
        whereClause.user = { city: filters.city };
      }

      if (filters?.minBudget) {
        whereClause.budgetMax = { gte: filters.minBudget };
      }

      if (filters?.maxBudget) {
        whereClause.budgetMin = { lte: filters.maxBudget };
      }

      if (filters?.moveInDate) {
        whereClause.moveInDate = { lte: filters.moveInDate };
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [profiles, total] = await Promise.all([
        this.prisma.roommateProfile.findMany({
          where: whereClause,
          include: { user: { select: { firstName: true, lastName: true, email: true, profileImage: true, city: true } } },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.roommateProfile.count({ where: whereClause }),
      ]);

      const matches = profiles.map((profile) => {
        let matchScore = 0;

        if (myProfile.budgetMin && profile.budgetMax && myProfile.budgetMin <= profile.budgetMax) {
          matchScore += 25;
        }

        if (myProfile.budgetMax && profile.budgetMin && myProfile.budgetMax >= profile.budgetMin) {
          matchScore += 25;
        }

        if (myProfile.lifestyle && profile.lifestyle) {
          const commonLifestyle = myProfile.lifestyle.filter((l: string) => profile.lifestyle?.includes(l)).length;
          matchScore += commonLifestyle * 10;
        }

        if (myProfile.duration && profile.duration && myProfile.duration === profile.duration) {
          matchScore += 15;
        }

        if (myProfile.moveInDate && profile.moveInDate) {
          const daysDiff = Math.abs(new Date(myProfile.moveInDate).getTime() - new Date(profile.moveInDate).getTime());
          if (daysDiff < 30 * 24 * 60 * 60 * 1000) {
            matchScore += 10;
          }
        }

        return {
          ...profile,
          matchScore: Math.min(matchScore, 100),
        };
      });

      matches.sort((a, b) => b.matchScore - a.matchScore);

      return {
        success: true,
        data: matches,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to find roommate matches:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to find matches', 500);
    }
  }

  async updateProfile(userId: string, data: { preferences?: any; budgetMin?: number; budgetMax?: number; moveInDate?: Date; duration?: string; lifestyle?: string[]; bio?: string }) {
    try {
      const profile = await this.prisma.roommateProfile.update({
        where: { userId },
        data: {
          preferences: data.preferences,
          budgetMin: data.budgetMin,
          budgetMax: data.budgetMax,
          moveInDate: data.moveInDate,
          duration: data.duration,
          lifestyle: data.lifestyle,
          bio: data.bio,
        },
      });

      return {
        success: true,
        data: profile,
      };
    } catch (error) {
      logger.error('Failed to update roommate profile:', error);
      throw new AppError('Failed to update roommate profile', 500);
    }
  }
}
