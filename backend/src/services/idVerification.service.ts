import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { ValidationUtils } from '../utils/validators';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

export class IdVerificationService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async submitVerification(userId: string, data: { idType: string; idNumber: string; idImage?: string }) {
    try {
      if (!ValidationUtils.isUUID(userId)) {
        throw new AppError('Invalid user ID', 400);
      }

      const existingVerification = await this.prisma.identityVerification.findFirst({
        where: { userId, status: 'PENDING' },
      });

      if (existingVerification) {
        throw new AppError('You already have a pending verification request', 400);
      }

      const verification = await this.prisma.identityVerification.create({
        data: {
          userId,
          idType: data.idType as any,
          idNumber: data.idNumber,
          idImage: data.idImage,
          status: 'PENDING',
        },
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
      });

      await this.notificationService.sendNotification({
        userId,
        type: 'ID_VERIFICATION_SUBMITTED',
        title: 'ID Verification Submitted',
        message: 'Your ID verification request has been submitted and is pending review.',
      });

      logger.info(`ID verification submitted: ${verification.id} for user ${userId}`);

      return {
        success: true,
        data: verification,
      };
    } catch (error) {
      logger.error('Failed to submit ID verification:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to submit ID verification', 500);
    }
  }

  async getVerification(id: string) {
    try {
      const verification = await this.prisma.identityVerification.findUnique({
        where: { id },
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
      });

      if (!verification) {
        throw new AppError('Verification not found', 404);
      }

      return {
        success: true,
        data: verification,
      };
    } catch (error) {
      logger.error(`Failed to get verification ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch verification', 500);
    }
  }

  async getMyVerification(userId: string) {
    try {
      const verification = await this.prisma.identityVerification.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      if (!verification) {
        throw new AppError('No verification found', 404);
      }

      return {
        success: true,
        data: verification,
      };
    } catch (error) {
      logger.error(`Failed to get my verification for ${userId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch verification', 500);
    }
  }

  async approveVerification(id: string, adminId: string) {
    try {
      const verification = await this.prisma.identityVerification.findUnique({
        where: { id },
        include: { user: { select: { id: true, firstName: true, lastName: true } } },
      });

      if (!verification) {
        throw new AppError('Verification not found', 404);
      }

      const updatedVerification = await this.prisma.identityVerification.update({
        where: { id },
        data: { status: 'VERIFIED', verifiedAt: new Date() },
        include: { user: { select: { firstName: true, lastName: true } } },
      });

      await this.prisma.user.update({
        where: { id: verification.userId },
        data: { isVerified: true },
      });

      await this.notificationService.sendNotification({
        userId: verification.userId,
        type: 'ID_VERIFIED',
        title: 'ID Verified',
        message: 'Your ID verification has been approved. You now have full access to the platform.',
      });

      logger.info(`ID verification approved: ${id}`);

      return {
        success: true,
        data: updatedVerification,
      };
    } catch (error) {
      logger.error(`Failed to approve verification ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to approve verification', 500);
    }
  }

  async rejectVerification(id: string, reason: string) {
    try {
      const verification = await this.prisma.identityVerification.findUnique({
        where: { id },
        include: { user: { select: { id: true, firstName: true, lastName: true } } },
      });

      if (!verification) {
        throw new AppError('Verification not found', 404);
      }

      const updatedVerification = await this.prisma.identityVerification.update({
        where: { id },
        data: { status: 'REJECTED', rejectionReason: reason },
        include: { user: { select: { firstName: true, lastName: true } } },
      });

      await this.notificationService.sendNotification({
        userId: verification.userId,
        type: 'ID_VERIFICATION_REJECTED',
        title: 'ID Verification Rejected',
        message: `Your ID verification was rejected. Reason: ${reason}`,
      });

      logger.info(`ID verification rejected: ${id}`);

      return {
        success: true,
        data: updatedVerification,
      };
    } catch (error) {
      logger.error(`Failed to reject verification ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to reject verification', 500);
    }
  }

  async getPendingVerifications(filters?: { page?: number; limit?: number }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [verifications, total] = await Promise.all([
        this.prisma.identityVerification.findMany({
          where: { status: 'PENDING' },
          include: { user: { select: { firstName: true, lastName: true, email: true } } },
          orderBy: { createdAt: 'asc' },
          take: limit,
          skip,
        }),
        this.prisma.identityVerification.count({ where: { status: 'PENDING' } }),
      ]);

      return {
        success: true,
        data: verifications,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get pending verifications:', error);
      throw new AppError('Failed to fetch pending verifications', 500);
    }
  }
}
