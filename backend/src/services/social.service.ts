import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { NotificationService } from './notification.service';

export class SocialService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async likeProperty(propertyId: string, userId: string) {
    try {
      const property = await this.prisma.property.findUnique({
        where: { id: propertyId },
        select: { id: true, title: true, landlordId: true, likes: true },
      });

      if (!property) {
        throw new AppError('Property not found', 404);
      }

      const existingLike = await this.prisma.propertyLike.findUnique({
        where: { propertyId_userId: { propertyId, userId } },
      });

      if (existingLike) {
        throw new AppError('Property already liked', 400);
      }

      await this.prisma.$transaction([
        this.prisma.propertyLike.create({
          data: { propertyId, userId },
        }),
        this.prisma.property.update({
          where: { id: propertyId },
          data: { likes: { increment: 1 } },
        }),
      ]);

      if (property.landlordId !== userId) {
        await this.notificationService.sendNotification({
          userId: property.landlordId,
          type: 'PROPERTY_LIKED',
          title: 'Property Liked',
          message: 'Someone liked your property.',
          data: { propertyId, title: property.title },
        });
      }

      logger.info(`Property liked: ${propertyId} by ${userId}`);
      return { success: true, message: 'Property liked' };
    } catch (error) {
      logger.error(`Failed to like property ${propertyId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to like property', 500);
    }
  }

  async unlikeProperty(propertyId: string, userId: string) {
    try {
      const existingLike = await this.prisma.propertyLike.findUnique({
        where: { propertyId_userId: { propertyId, userId } },
      });

      if (!existingLike) {
        throw new AppError('Property not liked', 400);
      }

      await this.prisma.$transaction([
        this.prisma.propertyLike.delete({
          where: { propertyId_userId: { propertyId, userId } },
        }),
        this.prisma.property.update({
          where: { id: propertyId },
          data: { likes: { decrement: 1 } },
        }),
      ]);

      logger.info(`Property unliked: ${propertyId} by ${userId}`);
      return { success: true, message: 'Property unliked' };
    } catch (error) {
      logger.error(`Failed to unlike property ${propertyId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to unlike property', 500);
    }
  }

  async hasUserLikedProperty(propertyId: string, userId: string): Promise<boolean> {
    const like = await this.prisma.propertyLike.findUnique({
      where: { propertyId_userId: { propertyId, userId } },
      select: { id: true },
    });
    return !!like;
  }

  async getUserLikes(userId: string, page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;
      const [likes, total] = await Promise.all([
        this.prisma.propertyLike.findMany({
          where: { userId },
          include: {
            property: {
              include: {
                propertyImages: { take: 1 },
                landlord: { select: { id: true, firstName: true, lastName: true, profileImage: true, rating: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.propertyLike.count({ where: { userId } }),
      ]);

      return {
        success: true,
        data: likes,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error(`Failed to get likes for user ${userId}:`, error);
      throw new AppError('Failed to fetch likes', 500);
    }
  }

  async followUser(followerId: string, followingId: string) {
    try {
      if (followerId === followingId) {
        throw new AppError('Cannot follow yourself', 400);
      }

      const following = await this.prisma.user.findUnique({
        where: { id: followingId },
        select: { id: true, firstName: true },
      });

      if (!following) {
        throw new AppError('User not found', 404);
      }

      const existingFollow = await this.prisma.userFollow.findUnique({
        where: { followerId_followingId: { followerId, followingId } },
      });

      if (existingFollow) {
        throw new AppError('Already following this user', 400);
      }

      await this.prisma.userFollow.create({
        data: { followerId, followingId },
      });

      await this.notificationService.sendNotification({
        userId: followingId,
        type: 'NEW_FOLLOWER',
        title: 'New Follower',
        message: `${followerId} started following you.`,
        data: { followerId },
      });

      logger.info(`User followed: ${followingId} by ${followerId}`);
      return { success: true, message: 'Followed' };
    } catch (error) {
      logger.error(`Failed to follow user ${followingId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to follow user', 500);
    }
  }

  async unfollowUser(followerId: string, followingId: string) {
    try {
      const existingFollow = await this.prisma.userFollow.findUnique({
        where: { followerId_followingId: { followerId, followingId } },
      });

      if (!existingFollow) {
        throw new AppError('Not following this user', 400);
      }

      await this.prisma.userFollow.delete({
        where: { followerId_followingId: { followerId, followingId } },
      });

      logger.info(`User unfollowed: ${followingId} by ${followerId}`);
      return { success: true, message: 'Unfollowed' };
    } catch (error) {
      logger.error(`Failed to unfollow user ${followingId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to unfollow user', 500);
    }
  }

  async hasUserFollowed(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.prisma.userFollow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
      select: { id: true },
    });
    return !!follow;
  }

  async getFollowers(userId: string, page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;
      const [followers, total] = await Promise.all([
        this.prisma.userFollow.findMany({
          where: { followingId: userId },
          include: {
            follower: { select: { id: true, firstName: true, lastName: true, profileImage: true, role: true, isOnline: true, lastSeen: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.userFollow.count({ where: { followingId: userId } }),
      ]);

      return { success: true, data: followers, total, page, limit, hasMore: total > skip + limit };
    } catch (error) {
      logger.error(`Failed to get followers for ${userId}:`, error);
      throw new AppError('Failed to fetch followers', 500);
    }
  }

  async getFollowing(userId: string, page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;
      const [following, total] = await Promise.all([
        this.prisma.userFollow.findMany({
          where: { followerId: userId },
          include: {
            following: { select: { id: true, firstName: true, lastName: true, profileImage: true, role: true, isOnline: true, lastSeen: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.userFollow.count({ where: { followerId: userId } }),
      ]);

      return { success: true, data: following, total, page, limit, hasMore: total > skip + limit };
    } catch (error) {
      logger.error(`Failed to get following for ${userId}:`, error);
      throw new AppError('Failed to fetch following', 500);
    }
  }

  async blockUser(blockerId: string, blockedId: string) {
    try {
      if (blockerId === blockedId) {
        throw new AppError('Cannot block yourself', 400);
      }

      const blocked = await this.prisma.user.findUnique({
        where: { id: blockedId },
        select: { id: true },
      });

      if (!blocked) {
        throw new AppError('User not found', 404);
      }

      const existingBlock = await this.prisma.userBlock.findUnique({
        where: { blockerId_blockedId: { blockerId, blockedId } },
      });

      if (existingBlock) {
        throw new AppError('User already blocked', 400);
      }

      await this.prisma.userBlock.create({
        data: { blockerId, blockedId },
      });

      await this.prisma.userFollow.deleteMany({
        where: {
          OR: [
            { followerId: blockerId, followingId: blockedId },
            { followerId: blockedId, followingId: blockerId },
          ],
        },
      });

      logger.info(`User blocked: ${blockedId} by ${blockerId}`);
      return { success: true, message: 'User blocked' };
    } catch (error) {
      logger.error(`Failed to block user ${blockedId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to block user', 500);
    }
  }

  async unblockUser(blockerId: string, blockedId: string) {
    try {
      const existingBlock = await this.prisma.userBlock.findUnique({
        where: { blockerId_blockedId: { blockerId, blockedId } },
      });

      if (!existingBlock) {
        throw new AppError('User not blocked', 400);
      }

      await this.prisma.userBlock.delete({
        where: { blockerId_blockedId: { blockerId, blockedId } },
      });

      logger.info(`User unblocked: ${blockedId} by ${blockerId}`);
      return { success: true, message: 'User unblocked' };
    } catch (error) {
      logger.error(`Failed to unblock user ${blockedId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to unblock user', 500);
    }
  }

  async isUserBlocked(blockerId: string, blockedId: string): Promise<boolean> {
    const block = await this.prisma.userBlock.findUnique({
      where: { blockerId_blockedId: { blockerId, blockedId } },
      select: { id: true },
    });
    return !!block;
  }

  async getBlockedUsers(blockerId: string, page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;
      const [blocked, total] = await Promise.all([
        this.prisma.userBlock.findMany({
          where: { blockerId },
          include: {
            blocked: { select: { id: true, firstName: true, lastName: true, profileImage: true, role: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.userBlock.count({ where: { blockerId } }),
      ]);

      return { success: true, data: blocked, total, page, limit, hasMore: total > skip + limit };
    } catch (error) {
      logger.error(`Failed to get blocked users for ${blockerId}:`, error);
      throw new AppError('Failed to fetch blocked users', 500);
    }
  }
}
