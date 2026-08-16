import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { body, param, query } from 'express-validator';
import { CreateEscrowData } from '../types/payment.types';
import { EscrowFilters } from '../models/Escrow.model';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';
import { NotificationService } from '../services/notification.service';

export class EscrowService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async createEscrow(payerId: string, data: CreateEscrowData) {
    try {
      const property = await this.prisma.property.findUnique({
        where: { id: data.propertyId },
        include: { landlord: { select: { id: true, email: true } } },
      });

      if (!property) {
        throw new AppError('Property not found', 404);
      }

      if (property.landlord.id === payerId) {
        throw new AppError('Cannot create escrow for your own property', 400);
      }

      const holdDays = data.holdDays || Number(process.env['ESCROW_HOLD_DAYS']) || 14;
      const releaseDate = new Date();
      releaseDate.setDate(releaseDate.getDate() + holdDays);

      const escrow = await this.prisma.escrowTransaction.create({
        data: {
          propertyId: data.propertyId,
          payerId,
          payeeId: property.landlord.id,
          amount: data.amount,
          currency: data.currency || 'USD',
          holdDays,
          releaseDate,
          status: 'PENDING',
        },
        include: {
          property: { select: { title: true, address: true } },
          payer: { select: { firstName: true, lastName: true } },
          payee: { select: { firstName: true, lastName: true } },
        },
      });

      await this.notificationService.sendNotification({
        userId: property.landlord.id,
        type: 'ESCROW_CREATED',
        title: 'New Escrow Transaction',
        message: `An escrow of ${data.amount} has been initiated for your property "${property.title}".`,
      });

      logger.info(`Escrow created: ${escrow.id}`);

      return {
        success: true,
        data: escrow,
      };
    } catch (error) {
      logger.error('Failed to create escrow:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create escrow', 500);
    }
  }

  async getEscrow(id: string) {
    try {
      const escrow = await this.prisma.escrowTransaction.findUnique({
        where: { id },
        include: {
          property: { select: { title: true, address: true, images: true } },
          payer: { select: { firstName: true, lastName: true, email: true } },
          payee: { select: { firstName: true, lastName: true, email: true } },
        },
      });

      if (!escrow) {
        throw new AppError('Escrow not found', 404);
      }

      return {
        success: true,
        data: escrow,
      };
    } catch (error) {
      logger.error(`Failed to get escrow ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch escrow', 500);
    }
  }

  async getEscrows(filters?: EscrowFilters) {
    try {
      const whereClause: any = {};

      if (filters?.propertyId) whereClause.propertyId = filters.propertyId;
      if (filters?.status) whereClause.status = filters.status;
      if (filters?.payerId) whereClause.payerId = filters.payerId;
      if (filters?.payeeId) whereClause.payeeId = filters.payeeId;

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [escrows, total] = await Promise.all([
        this.prisma.escrowTransaction.findMany({
          where: whereClause,
          include: {
            property: { select: { title: true } },
            payer: { select: { firstName: true, lastName: true } },
            payee: { select: { firstName: true, lastName: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.escrowTransaction.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: escrows,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get escrows:', error);
      throw new AppError('Failed to fetch escrows', 500);
    }
  }

  async releaseEscrow(id: string, releasedBy: string) {
    try {
      const escrow = await this.prisma.escrowTransaction.findUnique({
        where: { id },
        include: { property: true, payer: true, payee: true },
      });

      if (!escrow) {
        throw new AppError('Escrow not found', 404);
      }

      if (escrow.status !== 'PENDING') {
        throw new AppError('Escrow is not in pending status', 400);
      }

      if (escrow.releaseDate && new Date() < escrow.releaseDate) {
        throw new AppError('Escrow hold period has not ended yet', 400);
      }

      if (escrow.payerId !== releasedBy && escrow.payeeId !== releasedBy) {
        const user = await this.prisma.user.findUnique({
          where: { id: releasedBy },
          select: { role: true },
        });
        if (!user || (user.role !== 'ADMIN' && user.role !== 'LANDLORD')) {
          throw new AppError('Not authorized to release this escrow', 403);
        }
      }

      const updatedEscrow = await this.prisma.escrowTransaction.update({
        where: { id },
        data: { status: 'RELEASED', releasedAt: new Date() },
        include: {
          property: { select: { title: true } },
          payer: { select: { firstName: true, lastName: true } },
          payee: { select: { firstName: true, lastName: true } },
        },
      });

      await this.prisma.payment.create({
        data: {
          userId: escrow.payeeId,
          amount: escrow.amount,
          currency: escrow.currency,
          method: 'ESCROW',
          type: 'escrow_release',
          reference: `ESC-${escrow.id}`,
          status: 'COMPLETED',
        },
      });

      await this.notificationService.sendNotification({
        userId: escrow.payerId,
        type: 'ESCROW_RELEASED',
        title: 'Escrow Released',
        message: `The escrow for "${escrow.property.title}" has been released to ${escrow.payee.firstName} ${escrow.payee.lastName}.`,
      });

      await this.notificationService.sendNotification({
        userId: escrow.payeeId,
        type: 'ESCROW_RELEASED',
        title: 'Escrow Released',
        message: `You have received ${escrow.currency} ${escrow.amount} from the escrow for "${escrow.property.title}".`,
      });

      logger.info(`Escrow released: ${escrow.id}`);

      return {
        success: true,
        data: updatedEscrow,
      };
    } catch (error) {
      logger.error(`Failed to release escrow ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to release escrow', 500);
    }
  }

  async cancelEscrow(id: string, userId: string, reason: string) {
    try {
      const escrow = await this.prisma.escrowTransaction.findUnique({
        where: { id },
      });

      if (!escrow) {
        throw new AppError('Escrow not found', 404);
      }

      if (escrow.payerId !== userId && escrow.payeeId !== userId) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { role: true },
        });
        if (!user || (user.role !== 'ADMIN' && user.role !== 'LANDLORD')) {
          throw new AppError('Not authorized to cancel this escrow', 403);
        }
      }

      if (escrow.status !== 'PENDING') {
        throw new AppError('Only pending escrows can be cancelled', 400);
      }

      await this.prisma.escrowTransaction.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });

      logger.info(`Escrow cancelled: ${escrow.id}`);

      return {
        success: true,
        message: 'Escrow cancelled successfully',
      };
    } catch (error) {
      logger.error(`Failed to cancel escrow ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to cancel escrow', 500);
    }
  }

  async getMyEscrows(userId: string, filters?: { role?: string; page?: number; limit?: number }) {
    try {
      const whereClause: any = {
        OR: [{ payerId: userId }, { payeeId: userId }],
      };

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [escrows, total] = await Promise.all([
        this.prisma.escrowTransaction.findMany({
          where: whereClause,
          include: {
            property: { select: { title: true, images: true } },
            payer: { select: { firstName: true, lastName: true } },
            payee: { select: { firstName: true, lastName: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.escrowTransaction.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: escrows,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get my escrows:', error);
      throw new AppError('Failed to fetch escrows', 500);
    }
  }
}
