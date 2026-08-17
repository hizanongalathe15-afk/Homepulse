import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.config';

const prisma = new PrismaClient();

const ignorePaths = ['/health', '/favicon.ico', '/favicon', '/_next', '/socket.io'];

export const pageVisitTracker = (req: Request, res: Response, next: NextFunction) => {
  if (ignorePaths.some((p) => req.path.startsWith(p))) {
    next();
    return;
  }

  const ipAddress = req.ip || req.socket.remoteAddress || '';
  const userAgent = req.get('user-agent') || '';
  const referrer = req.get('referer') || req.get('referrer') || '';
  const userId = (req as any).user?.id;

  setImmediate(async () => {
    try {
      await prisma.pageVisit.create({
        data: {
          page: req.path,
          userId,
          ipAddress,
          userAgent,
          referrer,
          metadata: {
            method: req.method,
            query: req.query,
            route: req.route?.path,
          },
        },
      });
    } catch (error) {
      logger.error('Failed to record page visit:', error);
    }
  });

  next();
};

export const getMostVisitedPages = async (limit: number = 20, dateFrom?: string, dateTo?: string) => {
  const where: any = {};
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) where.createdAt.lte = new Date(dateTo);
  }

  try {
    const results = await prisma.pageVisit.groupBy({
      by: ['page'],
      where,
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          page: 'desc',
        },
      },
      take: limit,
    });

    return results.map((r) => ({
      page: r.page,
      visits: r._count._all,
    }));
  } catch (error) {
    logger.error('Failed to get most visited pages:', error);
    return [];
  }
};

export const getPageVisitTrends = async (days: number = 30) => {
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - days);

  try {
    const results = await prisma.$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as visits
      FROM "page_visits"
      WHERE "createdAt" >= ${dateFrom}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    return results as Array<{ date: string; visits: number }>;
  } catch (error) {
    logger.error('Failed to get page visit trends:', error);
    return [];
  }
};

export const getMostFollowedProperties = async (limit: number = 10) => {
  try {
    const results = await prisma.analytics.groupBy({
      by: ['entityId'],
      where: {
        eventType: 'PROPERTY_SAVED',
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          entityId: 'desc',
        },
      },
      take: limit,
    });

    return results.map((r) => ({
      propertyId: r.entityId,
      saves: r._count._all,
    }));
  } catch (error) {
    logger.error('Failed to get most followed properties:', error);
    return [];
  }
};
