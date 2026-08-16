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

export class ReviewService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async createReview(authorId: string, data: { targetId: string; targetType: string; rating: number; comment?: string; images?: string[] }) {
    try {
      const review = await this.prisma.review.create({
        data: {
          authorId,
          targetId: data.targetId,
          targetType: data.targetType,
          rating: data.rating,
          comment: data.comment,
          images: data.images || [],
        },
        include: { author: { select: { firstName: true, lastName: true, profileImage: true } } },
      });

      await this.notificationService.sendNotification({
        userId: data.targetId,
        type: 'NEW_REVIEW',
        title: 'New Review',
        message: `You received a new ${data.rating}-star review.`,
        data: { reviewId: review.id },
      });

      logger.info(`Review created: ${review.id} by ${authorId}`);

      return {
        success: true,
        data: review,
      };
    } catch (error) {
      logger.error('Failed to create review:', error);
      throw new AppError('Failed to create review', 500);
    }
  }

  async getReviews(filters?: { targetId?: string; targetType?: string; authorId?: string; rating?: number; page?: number; limit?: number; sortBy?: string }) {
    try {
      const whereClause: any = {};

      if (filters?.targetId) whereClause.targetId = filters.targetId;
      if (filters?.targetType) whereClause.targetType = filters.targetType;
      if (filters?.authorId) whereClause.authorId = filters.authorId;
      if (filters?.rating) whereClause.rating = filters.rating;

      let orderBy: Record<string, string> = { createdAt: 'desc' };
      if (filters?.sortBy === 'rating_asc') orderBy = { rating: 'asc' };
      else if (filters?.sortBy === 'rating_desc') orderBy = { rating: 'desc' };
      else if (filters?.sortBy === 'oldest') orderBy = { createdAt: 'asc' };
      else if (filters?.sortBy === 'helpful') orderBy = { helpful: 'desc' };

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [reviews, total] = await Promise.all([
        this.prisma.review.findMany({
          where: whereClause,
          include: { author: { select: { firstName: true, lastName: true, profileImage: true } } },
          orderBy,
          take: limit,
          skip,
        }),
        this.prisma.review.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: reviews,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get reviews:', error);
      throw new AppError('Failed to fetch reviews', 500);
    }
  }

  async getReview(id: string) {
    try {
      const review = await this.prisma.review.findUnique({
        where: { id },
        include: { author: { select: { firstName: true, lastName: true, profileImage: true } } },
      });

      if (!review) {
        throw new AppError('Review not found', 404);
      }

      return {
        success: true,
        data: review,
      };
    } catch (error) {
      logger.error(`Failed to get review ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch review', 500);
    }
  }

  async updateReview(id: string, authorId: string, data: { rating?: number; comment?: string; images?: string[] }) {
    try {
      const review = await this.prisma.review.findUnique({
        where: { id },
        select: { id: true, authorId: true },
      });

      if (!review) {
        throw new AppError('Review not found', 404);
      }

      if (review.authorId !== authorId) {
        throw new AppError('Not authorized to update this review', 403);
      }

      const allowedFields = ['rating', 'comment', 'images'];
      const updateData: any = {};
      for (const field of allowedFields) {
        if (data[field as keyof typeof data] !== undefined) {
          updateData[field] = data[field as keyof typeof data];
        }
      }

      const updatedReview = await this.prisma.review.update({
        where: { id },
        data: updateData,
        include: { author: { select: { firstName: true, lastName: true } } },
      });

      return {
        success: true,
        data: updatedReview,
      };
    } catch (error) {
      logger.error(`Failed to update review ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update review', 500);
    }
  }

  async deleteReview(id: string, authorId: string) {
    try {
      const review = await this.prisma.review.findUnique({
        where: { id },
        select: { id: true, authorId: true },
      });

      if (!review) {
        throw new AppError('Review not found', 404);
      }

      if (review.authorId !== authorId) {
        throw new AppError('Not authorized to delete this review', 403);
      }

      await this.prisma.review.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Review deleted successfully',
      };
    } catch (error) {
      logger.error(`Failed to delete review ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete review', 500);
    }
  }

  async markHelpful(reviewId: string) {
    try {
      const review = await this.prisma.review.update({
        where: { id: reviewId },
        data: { helpful: { increment: 1 } },
        select: { helpful: true },
      });

      return {
        success: true,
        data: { helpful: review.helpful },
      };
    } catch (error) {
      logger.error(`Failed to mark review ${reviewId} as helpful:`, error);
      throw new AppError('Failed to mark review as helpful', 500);
    }
  }

  async unmarkHelpful(reviewId: string) {
    try {
      const review = await this.prisma.review.update({
        where: { id: reviewId },
        data: { helpful: { decrement: 1 } },
        select: { helpful: true },
      });

      return {
        success: true,
        data: { helpful: review.helpful },
      };
    } catch (error) {
      logger.error(`Failed to unmark review ${reviewId}:`, error);
      throw new AppError('Failed to unmark review', 500);
    }
  }

  async reportReview(reviewId: string, reportedBy: string, reason: string, details?: string) {
    try {
      const report = await this.prisma.fraudReport.create({
        data: {
          reportedById: reportedBy,
          entityType: 'REVIEW',
          entityId: reviewId,
          reason: `Review reported: ${reason}${details ? ` - ${details}` : ''}`,
          status: 'OPEN',
        },
        select: { id: true, status: true },
      });

      return {
        success: true,
        data: report,
      };
    } catch (error) {
      logger.error(`Failed to report review ${reviewId}:`, error);
      throw new AppError('Failed to report review', 500);
    }
  }

  async getReviewStats(targetId: string) {
    try {
      const reviews = await this.prisma.review.findMany({
        where: { targetId },
        select: { rating: true },
      });

      const total = reviews.length;
      const averageRating = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
      const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
        rating,
        count: reviews.filter(r => r.rating === rating).length,
      }));

      return {
        success: true,
        data: { total, averageRating: Math.round(averageRating * 100) / 100, ratingDistribution },
      };
    } catch (error) {
      logger.error(`Failed to get review stats for ${targetId}:`, error);
      throw new AppError('Failed to fetch review stats', 500);
    }
  }
}
