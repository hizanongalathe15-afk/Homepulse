import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { PaymentService } from '../services/payment.service';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';
import { NotificationService } from '../services/notification.service';
import { StripeService } from '../services/stripe.service';
import { MpesaService } from '../services/mpesa.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const stripeService = new StripeService();
const mpesaService = new MpesaService(prisma, notificationService);
const paymentService = new PaymentService(prisma, stripeService, mpesaService, notificationService);

export class PaymentController {
  private paymentService: PaymentService;

  constructor(paymentService?: PaymentService) {
    this.paymentService = paymentService || new PaymentService(prisma, stripeService, mpesaService, notificationService);
  }

  createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.paymentService.createPayment(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  createStripePaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.paymentService.createStripePaymentIntent(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  initiateMpesaSTKPush = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.paymentService.initiateMpesaSTKPush(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getPayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const isAdmin = (req as any).user.role === 'ADMIN';
      const filters = req.query as any;
      if (!isAdmin) {
        filters.userId = userId;
      }
      const result = await this.paymentService.getPayments(filters);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.paymentService.getPayment(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  refundPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.paymentService.refundPayment(req.params.id as string, req.body.amount, req.body.reason);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getPaymentStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const isAdmin = (req as any).user.role === 'ADMIN';
      const result = await this.paymentService.getPaymentStats(isAdmin ? undefined : userId, req.query.startDate as any, req.query.endDate as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
