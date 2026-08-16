import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.config';

export class ExpireQRCodesJob {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async execute() {
    try {
      const now = new Date();

      const expiredQRCodes = await this.prisma.qRCode.findMany({
        where: {
          status: 'ACTIVE',
          expiresAt: { lte: now },
        },
        select: { id: true, code: true, propertyId: true },
      });

      for (const qrCode of expiredQRCodes) {
        await this.prisma.qRCode.update({
          where: { id: qrCode.id },
          data: { status: 'EXPIRED' },
        });
        logger.info(`QR code expired: ${qrCode.id} for property ${qrCode.propertyId}`);
      }

      return {
        success: true,
        expiredCount: expiredQRCodes.length,
      };
    } catch (error) {
      logger.error('Expire QR codes job failed:', error);
      return { success: false, error };
    }
  }
}
