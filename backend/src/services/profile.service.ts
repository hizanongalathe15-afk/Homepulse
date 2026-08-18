import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';

export class ProfileService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async uploadProfileVideo(userId: string, data: { url: string; thumbnailUrl?: string; duration: number; fileSize: number }) {
    try {
      const video = await this.prisma.userProfileVideo.upsert({
        where: { userId },
        update: { ...data, status: 'active' },
        create: { userId, ...data },
      });
      logger.info(`Profile video updated for user: ${userId}`);
      return video;
    } catch (error) {
      logger.error('Failed to upload profile video:', error);
      throw new AppError('Failed to upload profile video', 500);
    }
  }

  async getProfileVideo(userId: string) {
    try {
      return await this.prisma.userProfileVideo.findUnique({
        where: { userId },
      });
    } catch (error) {
      logger.error('Failed to get profile video:', error);
      throw new AppError('Failed to get profile video', 500);
    }
  }

  async deleteProfileVideo(userId: string) {
    try {
      await this.prisma.userProfileVideo.delete({
        where: { userId },
      });
      logger.info(`Profile video deleted for user: ${userId}`);
    } catch (error) {
      logger.error('Failed to delete profile video:', error);
      throw new AppError('Failed to delete profile video', 500);
    }
  }

  async uploadProfileMusic(userId: string, data: { title: string; artist?: string; url: string; duration?: number; coverUrl?: string }) {
    try {
      const music = await this.prisma.userProfileMusic.upsert({
        where: { userId },
        update: { ...data, isActive: true },
        create: { userId, ...data },
      });
      logger.info(`Profile music updated for user: ${userId}`);
      return music;
    } catch (error) {
      logger.error('Failed to upload profile music:', error);
      throw new AppError('Failed to upload profile music', 500);
    }
  }

  async getProfileMusic(userId: string) {
    try {
      return await this.prisma.userProfileMusic.findFirst({
        where: { userId, isActive: true },
      });
    } catch (error) {
      logger.error('Failed to get profile music:', error);
      throw new AppError('Failed to get profile music', 500);
    }
  }

  async deleteProfileMusic(userId: string) {
    try {
      await this.prisma.userProfileMusic.deleteMany({
        where: { userId },
      });
      logger.info(`Profile music deleted for user: ${userId}`);
    } catch (error) {
      logger.error('Failed to delete profile music:', error);
      throw new AppError('Failed to delete profile music', 500);
    }
  }

  async getUserProfile(userId: string, privacySettings: any) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: privacySettings?.shareEmail || false,
          phone: privacySettings?.sharePhone || false,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          profileImage: true,
          bio: true,
          instagram: true,
          twitter: true,
          facebook: true,
          linkedin: true,
          tiktok: true,
          youtube: true,
          website: true,
          city: privacySettings?.shareLocation || false,
          isOnline: privacySettings?.shareOnlineStatus || false,
          lastSeen: privacySettings?.shareLastSeen || false,
          rating: true,
          totalProperties: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      logger.error('Failed to get user profile:', error);
      throw new AppError('Failed to get user profile', 500);
    }
  }
}
