import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.config';

export class UpdateScoresJob {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async execute() {
    try {
      const landlords = await this.prisma.user.findMany({
        where: { role: 'LANDLORD', isActive: true },
        include: {
          properties: {
            include: {
              reviews: { select: { rating: true } },
              qrCodes: { select: { scans: true } },
            },
          },
        },
      });

      const updatedScores: Array<{ userId: string; score: number }> = [];

      for (const landlord of landlords) {
        let score = 0;

        const properties = landlord.properties;
        const activeProperties = properties.filter((p) => p.status === 'ACTIVE').length;
        score += activeProperties * 10;

        for (const property of properties) {
          const ratings = property.reviews.map((r) => r.rating);
          const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
          score += avgRating * 5;

          const totalScans = property.qrCodes.reduce((sum, qr) => sum + qr.scans, 0);
          score += Math.min(totalScans, 50);
        }

        updatedScores.push({ userId: landlord.id, score: Math.min(score, 1000) });
      }

      for (const { userId, score } of updatedScores) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { bio: `Trust Score: ${score}` },
        });
      }

      logger.info(`Update scores job completed: ${updatedScores.length} landlords updated`);

      return {
        success: true,
        updatedCount: updatedScores.length,
        topScores: updatedScores.sort((a, b) => b.score - a.score).slice(0, 10),
      };
    } catch (error) {
      logger.error('Update scores job failed:', error);
      return { success: false, error };
    }
  }
}
