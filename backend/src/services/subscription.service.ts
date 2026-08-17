import { PrismaClient, SubscriptionStatus } from '@prisma/client';
import { logger } from '../config/logger.config';

const prisma = new PrismaClient();

export class SubscriptionService {
  async getPlans(activeOnly: boolean = true) {
    try {
      const plans = await prisma.subscriptionPlan.findMany({
        where: activeOnly ? { isActive: true } : {},
        orderBy: { sortOrder: 'asc' },
      });
      return plans;
    } catch (error) {
      logger.error('Failed to get subscription plans:', error);
      throw error;
    }
  }

  async getPlan(planId: string) {
    return await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
  }

  async createPlan(data: {
    name: string;
    description?: string;
    price: number;
    currency?: string;
    billingCycle: string;
    maxListings?: number;
    features?: string[];
    isFeatured?: boolean;
  }) {
    return await prisma.subscriptionPlan.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency || 'KES',
        billingCycle: data.billingCycle,
        maxListings: data.maxListings,
        features: data.features || [],
        isFeatured: data.isFeatured || false,
      },
    });
  }

  async updatePlan(planId: string, data: any) {
    return await prisma.subscriptionPlan.update({
      where: { id: planId },
      data,
    });
  }

  async deletePlan(planId: string) {
    return await prisma.subscriptionPlan.delete({
      where: { id: planId },
    });
  }

  async getUserSubscription(userId: string) {
    const now = new Date();
    return await prisma.subscription.findFirst({
      where: {
        userId,
        endDate: { gte: now },
        status: SubscriptionStatus.ACTIVE,
      },
      include: {
        plan: true,
      },
    });
  }

  async createSubscription(data: {
    userId: string;
    planId: string;
    startDate?: Date;
    endDate: Date;
    paymentMethod?: string;
    paymentProviderId?: string;
    amount: number;
    currency?: string;
    listingsUsed?: number;
  }) {
    const now = new Date();
    const endDate = data.endDate || new Date(now.setMonth(now.getMonth() + 1));

    const sub = await prisma.subscription.create({
      data: {
        userId: data.userId,
        planId: data.planId,
        startDate: data.startDate || now,
        endDate,
        paymentMethod: data.paymentMethod,
        paymentProviderId: data.paymentProviderId,
        amount: data.amount,
        currency: data.currency || 'KES',
        status: SubscriptionStatus.ACTIVE,
        listingsUsed: data.listingsUsed || 0,
      },
      include: { plan: true },
    });

    await this.recordSubscriptionEvent({
      userId: data.userId,
      eventType: 'TRIAL_STARTED',
      amount: data.amount,
      currency: data.currency || 'KES',
    });

    return sub;
  }

  async cancelSubscription(subscriptionId: string) {
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: SubscriptionStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });

    return { success: true };
  }

  async renewSubscription(subscriptionId: string) {
    const sub = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { plan: true },
    });

    if (!sub) throw new Error('Subscription not found');

    let newEndDate = new Date(sub.endDate);
    if (sub.plan.billingCycle === 'monthly') {
      newEndDate.setMonth(newEndDate.getMonth() + 1);
    } else if (sub.plan.billingCycle === 'yearly') {
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);
    }

    return await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        endDate: newEndDate,
        status: SubscriptionStatus.ACTIVE,
        cancelledAt: null,
      },
      include: { plan: true },
    });
  }

  async getRevenueStats(days: number = 30) {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const result = await prisma.$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        SUM("amount") as revenue,
        COUNT(*) as transactions
      FROM "subscriptions"
      WHERE "createdAt" >= ${dateFrom}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    return result as Array<{ date: string; revenue: number; transactions: number }>;
  }

  async getMostPopularPlans() {
    const plans = await prisma.$queryRaw`
      SELECT 
        p.name,
        p.price,
        p."billingCycle",
        COUNT(s.id) as subscribers
      FROM "subscription_plans" p
      LEFT JOIN "subscriptions" s ON s."planId" = p.id AND s.status = 'ACTIVE'
      WHERE p."isActive" = true
      GROUP BY p.id, p.name, p.price, p."billingCycle"
      ORDER BY subscribers DESC
    `;

    return plans as Array<{
      name: string;
      price: number;
      billingCycle: string;
      subscribers: number;
    }>;
  }

  async recordSubscriptionEvent(data: {
    userId?: string;
    eventType: string;
    amount?: number;
    currency?: string;
    metadata?: any;
  }) {
    return await prisma.subscriptionEvent.create({
      data: {
        userId: data.userId,
        eventType: data.eventType,
        amount: data.amount,
        currency: data.currency,
        metadata: data.metadata,
      },
    });
  }

  async getUserRevenue(userId: string) {
    const result = await prisma.subscription.aggregate({
      where: { userId },
      _sum: { amount: true },
      _count: { _all: true },
    });

    return {
      totalSpent: result._sum.amount || 0,
      totalSubscriptions: result._count._all || 0,
    };
  }
}
