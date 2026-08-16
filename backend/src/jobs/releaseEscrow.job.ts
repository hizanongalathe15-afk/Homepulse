import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.config';

export class ReleaseEscrowJob {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async execute() {
    try {
      const now = new Date();

      const releasableEscrows = await this.prisma.escrowTransaction.findMany({
        where: {
          status: 'PENDING',
          releaseDate: { lte: now },
        },
        include: {
          property: { select: { title: true } },
          payer: { select: { firstName: true, lastName: true, email: true } },
          payee: { select: { firstName: true, lastName: true, email: true } },
        },
      });

      let releasedCount = 0;

      for (const escrow of releasableEscrows) {
        await this.prisma.escrowTransaction.update({
          where: { id: escrow.id },
          data: { status: 'RELEASED', releasedAt: now },
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

        releasedCount++;
        logger.info(`Escrow released: ${escrow.id} for property ${escrow.property.title}`);
      }

      return {
        success: true,
        releasedCount,
        message: `Released ${releasedCount} escrows`,
      };
    } catch (error) {
      logger.error('Release escrow job failed:', error);
      return { success: false, error };
    }
  }
}
