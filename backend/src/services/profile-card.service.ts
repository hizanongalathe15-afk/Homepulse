import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import QRCode from 'qrcode';

export class ProfileCardService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async generateProfileCard(userId: string, user: { firstName: string; lastName: string; email?: string; profileImage?: string; bio?: string }) {
    try {
      const cardUrl = `https://homepulse.app/profile/${userId}`;
      const qrCodeDataUrl = await QRCode.toDataURL(cardUrl, {
        width: 300,
        margin: 2,
        color: { dark: '#1A5276', light: '#FFFFFF' },
      });
      
      const profileCard = await this.prisma.userProfileCard.upsert({
        where: { userId },
        update: { cardUrl, qrCodeUrl: qrCodeDataUrl },
        create: { userId, cardUrl, qrCodeUrl: qrCodeDataUrl },
      });
      
      return profileCard;
    } catch (error) {
      logger.error('Failed to generate profile card:', error);
      throw new AppError('Failed to generate profile card', 500);
    }
  }

  async getProfileCard(userId: string) {
    try {
      let card = await this.prisma.userProfileCard.findUnique({
        where: { userId },
      });
      if (!card) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { firstName: true, lastName: true, email: true, profileImage: true, bio: true },
        });
        if (!user) throw new AppError('User not found', 404);
        const { profileImage, bio, ...userRest } = user;
        card = await this.generateProfileCard(userId, { ...userRest, profileImage: profileImage ?? undefined, bio: bio ?? undefined });
      }
      return card;
    } catch (error) {
      logger.error('Failed to get profile card:', error);
      throw new AppError('Failed to get profile card', 500);
    }
  }
}
