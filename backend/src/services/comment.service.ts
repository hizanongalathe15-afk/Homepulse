import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { NotificationService } from './notification.service';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';

export interface CommentData {
  propertyId: string;
  userId: string;
  content: string;
  parentId?: string;
}

export class CommentService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async createComment(data: CommentData) {
    try {
      const comment = await this.prisma.propertyComment.create({
        data: {
          propertyId: data.propertyId,
          userId: data.userId,
          content: data.content,
          parentId: data.parentId || null,
          status: 'visible',
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              role: true,
            },
          },
        },
      });

      if (!data.parentId) {
        const property = await this.prisma.property.findUnique({
          where: { id: data.propertyId },
          select: { landlordId: true },
        });
        if (property && property.landlordId !== data.userId) {
          await this.notificationService.sendNotification({
            userId: property.landlordId,
            type: 'NEW_COMMENT',
            title: 'New Property Comment',
            message: 'Someone commented on your property.',
            data: { propertyId: data.propertyId, commentId: comment.id },
          });
        }
      }

      logger.info(`Comment created: ${comment.id} by ${data.userId}`);
      return { success: true, data: comment };
    } catch (error) {
      logger.error('Failed to create comment:', error);
      throw new AppError('Failed to create comment', 500);
    }
  }

  async getComments(propertyId: string, page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;
      const whereClause: any = { propertyId, parentId: null, status: 'visible' };

      const [comments, total] = await Promise.all([
        this.prisma.propertyComment.findMany({
          where: whereClause,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
                role: true,
              },
            },
            replies: {
              where: { status: 'visible' },
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profileImage: true,
                    role: true,
                  },
                },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
          take: limit,
          skip,
        }),
        this.prisma.propertyComment.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: comments,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error(`Failed to get comments for property ${propertyId}:`, error);
      throw new AppError('Failed to fetch comments', 500);
    }
  }

  async getReplies(parentId: string, page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;
      const [replies, total] = await Promise.all([
        this.prisma.propertyComment.findMany({
          where: { parentId, status: 'visible' },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
          take: limit,
          skip,
        }),
        this.prisma.propertyComment.count({ where: { parentId, status: 'visible' } }),
      ]);

      return {
        success: true,
        data: replies,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error(`Failed to get replies for comment ${parentId}:`, error);
      throw new AppError('Failed to fetch replies', 500);
    }
  }

  async updateComment(commentId: string, userId: string, content: string) {
    try {
      const comment = await this.prisma.propertyComment.findUnique({
        where: { id: commentId },
        select: { id: true, userId: true },
      });

      if (!comment) {
        throw new AppError('Comment not found', 404);
      }

      if (comment.userId !== userId) {
        throw new AppError('Not authorized to edit this comment', 403);
      }

      const updated = await this.prisma.propertyComment.update({
        where: { id: commentId },
        data: { content, isEdited: true },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              role: true,
            },
          },
        },
      });

      logger.info(`Comment updated: ${commentId}`);
      return { success: true, data: updated };
    } catch (error) {
      logger.error(`Failed to update comment ${commentId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update comment', 500);
    }
  }

  async deleteComment(commentId: string, userId: string, userRole: string) {
    try {
      const comment = await this.prisma.propertyComment.findUnique({
        where: { id: commentId },
        select: { id: true, userId: true, parentId: true },
      });

      if (!comment) {
        throw new AppError('Comment not found', 404);
      }

      const isOwner = comment.userId === userId;
      const isAdmin = userRole === 'ADMIN' || userRole === 'MODERATOR';
      if (!isOwner && !isAdmin) {
        throw new AppError('Not authorized to delete this comment', 403);
      }

      if (comment.parentId) {
        await this.prisma.propertyComment.delete({ where: { id: commentId } });
      } else {
        await this.prisma.propertyComment.update({
          where: { id: commentId },
          data: { status: 'hidden' },
        });
      }

      logger.info(`Comment deleted: ${commentId}`);
      return { success: true, message: 'Comment deleted successfully' };
    } catch (error) {
      logger.error(`Failed to delete comment ${commentId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete comment', 500);
    }
  }

  async likeComment(commentId: string, userId: string) {
    try {
      const comment = await this.prisma.propertyComment.findUnique({
        where: { id: commentId },
        select: { id: true, userId: true },
      });

      if (!comment) {
        throw new AppError('Comment not found', 404);
      }

      const existingLike = await this.prisma.commentLike.findUnique({
        where: { commentId_userId: { commentId, userId } },
      });

      if (existingLike) {
        throw new AppError('Comment already liked', 400);
      }

      await this.prisma.commentLike.create({
        data: { commentId, userId },
      });

      await this.prisma.propertyComment.update({
        where: { id: commentId },
        data: { likesCount: { increment: 1 } },
      });

      if (comment.userId !== userId) {
        await this.notificationService.sendNotification({
          userId: comment.userId,
          type: 'COMMENT_LIKE',
          title: 'Your comment was liked',
          message: 'Someone liked your comment.',
          data: { commentId },
        });
      }

      logger.info(`Comment liked: ${commentId} by ${userId}`);
      return { success: true, message: 'Comment liked' };
    } catch (error) {
      logger.error(`Failed to like comment ${commentId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to like comment', 500);
    }
  }

  async unlikeComment(commentId: string, userId: string) {
    try {
      const existingLike = await this.prisma.commentLike.findUnique({
        where: { commentId_userId: { commentId, userId } },
      });

      if (!existingLike) {
        throw new AppError('Comment not liked', 400);
      }

      await this.prisma.commentLike.delete({
        where: { commentId_userId: { commentId, userId } },
      });

      await this.prisma.propertyComment.update({
        where: { id: commentId },
        data: { likesCount: { decrement: 1 } },
      });

      logger.info(`Comment unliked: ${commentId} by ${userId}`);
      return { success: true, message: 'Comment unliked' };
    } catch (error) {
      logger.error(`Failed to unlike comment ${commentId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to unlike comment', 500);
    }
  }

  async pinComment(commentId: string, userRole: string) {
    try {
      const comment = await this.prisma.propertyComment.findUnique({
        where: { id: commentId },
        select: { id: true, parentId: true },
      });

      if (!comment) {
        throw new AppError('Comment not found', 404);
      }

      if (comment.parentId) {
        throw new AppError('Cannot pin replies', 400);
      }

      const isAdmin = userRole === 'ADMIN' || userRole === 'MODERATOR' || userRole === 'LANDLORD';
      if (!isAdmin) {
        throw new AppError('Not authorized to pin comments', 403);
      }

      const pinned = await this.prisma.propertyComment.update({
        where: { id: commentId },
        data: { isPinned: true },
      });

      logger.info(`Comment pinned: ${commentId}`);
      return { success: true, data: pinned };
    } catch (error) {
      logger.error(`Failed to pin comment ${commentId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to pin comment', 500);
    }
  }

  async hasUserLiked(commentId: string, userId: string): Promise<boolean> {
    const like = await this.prisma.commentLike.findUnique({
      where: { commentId_userId: { commentId, userId } },
      select: { id: true },
    });
    return !!like;
  }
}
