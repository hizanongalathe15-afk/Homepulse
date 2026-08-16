import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { body, param, query } from 'express-validator';
import { StripeService } from '../services/stripe.service';
import { MpesaService } from '../services/mpesa.service';
import { PaymentFilters, CreatePaymentData } from '../types/payment.types';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';
import { NotificationService } from '../services/notification.service';

export interface PaymentResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class PaymentService {
  private prisma: PrismaClient;
  private stripeService: StripeService;
  private mpesaService: MpesaService;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, stripeService: StripeService, mpesaService: MpesaService, notificationService: NotificationService) {
    this.prisma = prisma;
    this.stripeService = stripeService;
    this.mpesaService = mpesaService;
    this.notificationService = notificationService;
  }

  async createPayment(userId: string, data: CreatePaymentData) {
    try {
      const payment = await this.prisma.payment.create({
        data: {
          userId,
          amount: data.amount,
          currency: data.currency || 'USD',
          method: data.method as any,
          type: data.type,
          transactionId: data.transactionId,
          reference: data.reference,
          metadata: data.metadata as any,
          status: 'PENDING',
        },
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
      });

      if (process.env['ENABLE_ANALYTICS'] === 'true') {
        await this.prisma.analytics.create({
          data: {
            eventType: 'PAYMENT_INITIATED',
            entityType: 'Payment',
            entityId: payment.id,
            userId,
            metadata: { amount: payment.amount, method: payment.method, type: payment.type },
          },
        });
      }

      return {
        success: true,
        data: payment,
      };
    } catch (error) {
      logger.error('Failed to create payment:', error);
      throw new AppError('Failed to create payment', 500);
    }
  }

  async createStripePaymentIntent(userId: string, data: { amount: number; currency?: string; description?: string }) {
    try {
      const paymentIntent = await this.stripeService.createPaymentIntent({
        amount: data.amount,
        currency: data.currency || 'USD',
        customerEmail: (await this.prisma.user.findUnique({ where: { id: userId }, select: { email: true } }))?.email,
        description: data.description,
        metadata: { userId },
      });

      const payment = await this.prisma.payment.create({
        data: {
          userId,
          amount: data.amount,
          currency: data.currency || 'USD',
          method: 'STRIPE',
          type: 'payment_intent',
          transactionId: paymentIntent.id,
          status: 'PENDING',
          metadata: { clientSecret: paymentIntent.clientSecret },
        },
      });

      return {
        success: true,
        data: { paymentIntent, payment },
      };
    } catch (error) {
      logger.error('Failed to create Stripe payment intent:', error);
      throw new AppError('Failed to create payment intent', 500);
    }
  }

  async initiateMpesaSTKPush(userId: string, data: { phoneNumber: string; amount: number; accountReference?: string }) {
    try {
      const stkResponse = await this.mpesaService.initiateSTKPush({
        phoneNumber: data.phoneNumber,
        amount: data.amount,
        accountReference: data.accountReference || 'HomePulse',
      });

      const payment = await this.prisma.payment.create({
        data: {
          userId,
          amount: data.amount,
          currency: 'USD',
          method: 'MPESA',
          type: 'stk_push',
          reference: stkResponse.CheckoutRequestID,
          status: 'PENDING',
          metadata: { phoneNumber: data.phoneNumber },
        },
      });

      return {
        success: true,
        data: { stkResponse, payment },
      };
    } catch (error) {
      logger.error('Failed to initiate M-Pesa STK push:', error);
      throw new AppError('Failed to initiate M-Pesa payment', 500);
    }
  }

  async getPayments(filters?: PaymentFilters) {
    try {
      const whereClause: any = {};

      if (filters?.userId) whereClause.userId = filters.userId;
      if (filters?.method) whereClause.method = filters.method;
      if (filters?.status) whereClause.status = filters.status;
      if (filters?.startDate || filters?.endDate) {
        whereClause.createdAt = {};
        if (filters.startDate) (whereClause.createdAt as { gte?: Date }).gte = filters.startDate;
        if (filters.endDate) (whereClause.createdAt as { lte?: Date }).lte = filters.endDate;
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [payments, total] = await Promise.all([
        this.prisma.payment.findMany({
          where: whereClause,
          include: { user: { select: { firstName: true, lastName: true, email: true } } },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.payment.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: payments,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get payments:', error);
      throw new AppError('Failed to fetch payments', 500);
    }
  }

  async getPayment(id: string) {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { id },
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
      });

      if (!payment) {
        throw new AppError('Payment not found', 404);
      }

      return {
        success: true,
        data: payment,
      };
    } catch (error) {
      logger.error(`Failed to get payment ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch payment', 500);
    }
  }

  async refundPayment(paymentId: string, amount?: number, reason?: string) {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
        throw new AppError('Payment not found', 404);
      }

      if (payment.status !== 'COMPLETED') {
        throw new AppError('Only completed payments can be refunded', 400);
      }

      if (payment.method === 'STRIPE' && payment.transactionId) {
        await this.stripeService.createRefund({
          paymentIntentId: payment.transactionId,
          amount,
          reason: reason as any,
        });
      }

      const refundAmount = amount || payment.amount;

      await this.prisma.payment.create({
        data: {
          userId: payment.userId,
          amount: -refundAmount,
          currency: payment.currency,
          method: payment.method,
          type: 'REFUND',
          reference: `REF-${payment.transactionId}`,
          status: 'COMPLETED',
          metadata: { originalPaymentId: payment.id, reason },
        },
      });

      await this.prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'REFUNDED' },
      });

      await this.notificationService.sendNotification({
        userId: payment.userId,
        type: 'PAYMENT_REFUNDED',
        title: 'Payment Refunded',
        message: `Your payment of ${payment.currency} ${refundAmount} has been refunded.`,
      });

      return {
        success: true,
        message: 'Refund processed successfully',
      };
    } catch (error) {
      logger.error(`Failed to refund payment ${paymentId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to process refund', 500);
    }
  }

  async getPaymentStats(userId?: string, startDate?: Date, endDate?: Date) {
    try {
      const whereClause: any = {};

      if (userId) whereClause.userId = userId;
      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) (whereClause.createdAt as { gte?: Date }).gte = startDate;
        if (endDate) (whereClause.createdAt as { lte?: Date }).lte = endDate;
      }

      const [totalRevenue, totalPayments, totalRefunds, paymentsByMethod] = await Promise.all([
        this.prisma.payment.aggregate({
          where: { ...whereClause, status: 'COMPLETED', amount: { gt: 0 } },
          _sum: { amount: true },
        }),
        this.prisma.payment.count({ where: { ...whereClause, status: 'COMPLETED' } }),
        this.prisma.payment.count({ where: { ...whereClause, type: 'REFUND' } }),
        this.prisma.payment.groupBy({
          by: ['method'],
          where: { ...whereClause, status: 'COMPLETED' },
          _sum: { amount: true },
          _count: { id: true },
        }),
      ]);

      return {
        success: true,
        data: {
          totalRevenue: totalRevenue._sum.amount || 0,
          totalPayments,
          totalRefunds,
          paymentsByMethod,
        },
      };
    } catch (error) {
      logger.error('Failed to get payment stats:', error);
      throw new AppError('Failed to fetch payment stats', 500);
    }
  }
}
