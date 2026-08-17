import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';

export interface LeaseResponse {
  success: boolean;
  data?: any;
  total?: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
  error?: string;
}

export class LeaseService {
  private prisma: any;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async getTenantLeases(tenantId: string, filters?: { status?: string; page?: number; limit?: number }) {
    try {
      const whereClause: any = { tenantId };

      if (filters?.status) {
        whereClause.status = filters.status;
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [leases, total] = await Promise.all([
        this.prisma.lease.findMany({
          where: whereClause,
          include: {
            property: {
              include: {
                landlord: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.lease.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: leases,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get tenant leases:', error);
      throw new AppError('Failed to fetch leases', 500);
    }
  }

  async getLandlordLeases(landlordId: string, filters?: { status?: string; page?: number; limit?: number }) {
    try {
      const whereClause: any = { landlordId };

      if (filters?.status) {
        whereClause.status = filters.status;
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [leases, total] = await Promise.all([
        this.prisma.lease.findMany({
          where: whereClause,
          include: {
            property: true,
            tenant: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.lease.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: leases,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get landlord leases:', error);
      throw new AppError('Failed to fetch leases', 500);
    }
  }

  async getLease(id: string) {
    try {
      const lease = await this.prisma.lease.findUnique({
        where: { id },
        include: {
          property: true,
          tenant: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          landlord: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      if (!lease) {
        throw new AppError('Lease not found', 404);
      }

      return {
        success: true,
        data: lease,
      };
    } catch (error) {
      logger.error(`Failed to get lease ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch lease', 500);
    }
  }

  async createLease(tenantId: string, landlordId: string, data: {
    propertyId: string;
    startDate: string;
    endDate: string;
    amount: number;
    depositAmount?: number;
    paymentFrequency?: string;
    terms?: string;
  }) {
    try {
      const lease = await this.prisma.lease.create({
        data: {
          propertyId: data.propertyId,
          tenantId,
          landlordId,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          amount: data.amount,
          currency: 'KES',
          depositAmount: data.depositAmount,
          paymentFrequency: data.paymentFrequency || 'monthly',
          terms: data.terms,
        },
        include: {
          property: true,
          tenant: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          landlord: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      logger.info(`Lease created: ${lease.id} for property ${data.propertyId}`);

      return {
        success: true,
        data: lease,
      };
    } catch (error) {
      logger.error('Failed to create lease:', error);
      throw new AppError('Failed to create lease', 500);
    }
  }

  async updateLease(id: string, userId: string, data: {
    status?: string;
    endDate?: string;
    amount?: number;
    depositStatus?: string;
    terms?: string;
    documentUrl?: string;
    signedAt?: string;
    terminatedAt?: string;
  }) {
    try {
      const lease = await this.prisma.lease.findUnique({
        where: { id },
        select: { id: true, tenantId: true, landlordId: true },
      });

      if (!lease) {
        throw new AppError('Lease not found', 404);
      }

      if (lease.tenantId !== userId && lease.landlordId !== userId) {
        throw new AppError('Not authorized to update this lease', 403);
      }

      const updateData: any = {};
      if (data.status) updateData.status = data.status;
      if (data.endDate) updateData.endDate = new Date(data.endDate);
      if (data.amount) updateData.amount = data.amount;
      if (data.depositStatus) updateData.depositStatus = data.depositStatus;
      if (data.terms) updateData.terms = data.terms;
      if (data.documentUrl) updateData.documentUrl = data.documentUrl;
      if (data.signedAt) updateData.signedAt = new Date(data.signedAt);
      if (data.terminatedAt) updateData.terminatedAt = new Date(data.terminatedAt);

      const updatedLease = await this.prisma.lease.update({
        where: { id },
        data: updateData,
        include: {
          property: true,
          tenant: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          landlord: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return {
        success: true,
        data: updatedLease,
      };
    } catch (error) {
      logger.error(`Failed to update lease ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update lease', 500);
    }
  }

  async terminateLease(id: string, userId: string) {
    try {
      const lease = await this.prisma.lease.findUnique({
        where: { id },
        select: { id: true, tenantId: true, landlordId: true },
      });

      if (!lease) {
        throw new AppError('Lease not found', 404);
      }

      if (lease.tenantId !== userId && lease.landlordId !== userId) {
        throw new AppError('Not authorized to terminate this lease', 403);
      }

      const updatedLease = await this.prisma.lease.update({
        where: { id },
        data: {
          status: 'terminated',
          terminatedAt: new Date(),
        },
      });

      return {
        success: true,
        data: updatedLease,
      };
    } catch (error) {
      logger.error(`Failed to terminate lease ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to terminate lease', 500);
    }
  }
}
