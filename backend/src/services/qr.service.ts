import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { body, param, query } from 'express-validator';
import { CreateQRCodeData } from '../types/qr.types';
import { QRCodeModel } from '../models/QRCode.model';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

export class QRCodeService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async generateQRCode(userId: string, data: CreateQRCodeData) {
    try {
      const property = await this.prisma.property.findUnique({
        where: { id: data.propertyId },
        include: { landlord: { select: { id: true } } },
      });

      if (!property) {
        throw new AppError('Property not found', 404);
      }

      if (property.landlord.id !== userId) {
        throw new AppError('Not authorized to generate QR code for this property', 403);
      }

      const qrData = {
        propertyId: data.propertyId,
        code: Math.random().toString(36).substring(2, 15),
        generatedAt: new Date().toISOString(),
      };

      const qrCodeString = JSON.stringify(qrData);
      const qrCodeImage = await require('../utils/qrGenerator').generateQRCode(qrCodeString);

      const qrCode = await this.prisma.qRCode.create({
        data: {
          propertyId: data.propertyId,
          userId,
          code: qrData.code,
          secretKey: Math.random().toString(36).substring(2, 15),
          expiresAt: new Date(Date.now() + (Number(process.env['QR_DEFAULT_EXPIRY']) || 86400000)),
          maxScans: data.maxScans || 100,
          status: 'ACTIVE',
        },
      });

      await this.notificationService.sendNotification({
        userId,
        type: 'QR_CODE_GENERATED',
        title: 'QR Code Generated',
        message: `A QR code has been generated for your property "${property.title}".`,
      });

      logger.info(`QR code generated: ${qrCode.id} for property ${data.propertyId}`);

      return {
        success: true,
        data: {
          ...qrCode,
          qrCodeImage,
        },
      };
    } catch (error) {
      logger.error('Failed to generate QR code:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to generate QR code', 500);
    }
  }

  async scanQRCode(code: string, scannedBy: string) {
    try {
      const qrCode = await this.prisma.qRCode.findFirst({
        where: { code, status: 'ACTIVE' },
        include: { property: true },
      });

      if (!qrCode) {
        throw new AppError('Invalid or expired QR code', 404);
      }

      if (new Date() > qrCode.expiresAt) {
        await this.prisma.qRCode.update({
          where: { id: qrCode.id },
          data: { status: 'EXPIRED' },
        });
        throw new AppError('QR code has expired', 404);
      }

      if (qrCode.scans >= qrCode.maxScans) {
        await this.prisma.qRCode.update({
          where: { id: qrCode.id },
          data: { status: 'EXHAUSTED' },
        });
        throw new AppError('QR code has reached maximum scans', 404);
      }

      await this.prisma.qRCode.update({
        where: { id: qrCode.id },
        data: { scans: { increment: 1 } },
      });

      if (process.env['ENABLE_ANALYTICS'] === 'true') {
        await this.prisma.analytics.create({
          data: {
            eventType: 'QR_CODE_SCANNED',
            entityType: 'QRCode',
            entityId: qrCode.id,
            userId: scannedBy,
            metadata: { propertyId: qrCode.propertyId },
          },
        });
      }

      return {
        success: true,
        data: {
          property: qrCode.property,
          scansRemaining: qrCode.maxScans - qrCode.scans - 1,
        },
      };
    } catch (error) {
      logger.error('Failed to scan QR code:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to scan QR code', 500);
    }
  }

  async getMyQRCodes(userId: string, filters?: { propertyId?: string; page?: number; limit?: number }) {
    try {
      const whereClause: any = { userId };

      if (filters?.propertyId) whereClause.propertyId = filters.propertyId;

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [qrCodes, total] = await Promise.all([
        this.prisma.qRCode.findMany({
          where: whereClause,
          include: { property: { select: { title: true, address: true } } },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.qRCode.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: qrCodes,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get QR codes:', error);
      throw new AppError('Failed to fetch QR codes', 500);
    }
  }

  async deactivateQRCode(id: string, userId: string) {
    try {
      const qrCode = await this.prisma.qRCode.findUnique({
        where: { id },
        select: { id: true, userId: true },
      });

      if (!qrCode) {
        throw new AppError('QR code not found', 404);
      }

      if (qrCode.userId !== userId) {
        throw new AppError('Not authorized to deactivate this QR code', 403);
      }

      await this.prisma.qRCode.update({
        where: { id },
        data: { status: 'REVOKED' },
      });

      return {
        success: true,
        message: 'QR code deactivated successfully',
      };
    } catch (error) {
      logger.error(`Failed to deactivate QR code ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to deactivate QR code', 500);
    }
  }

  async getQRCodeStats(propertyId: string) {
    try {
      const qrCode = await this.prisma.qRCode.findFirst({
        where: { propertyId },
        select: { scans: true, maxScans: true, createdAt: true },
      });

      if (!qrCode) {
        throw new AppError('QR code not found for this property', 404);
      }

      return {
        success: true,
        data: {
          totalScans: qrCode.scans,
          maxScans: qrCode.maxScans,
          remainingScans: qrCode.maxScans - qrCode.scans,
          createdAt: qrCode.createdAt,
        },
      };
    } catch (error) {
      logger.error('Failed to get QR code stats:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch QR code stats', 500);
    }
  }
}
