import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { PaymentController } from '../controllers/payment.controller';
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
const paymentService = new (require('../services/payment.service').PaymentService)(prisma, stripeService, mpesaService, notificationService);
const controller = new PaymentController(paymentService);

const router = require('express').Router();

router.post('/', authenticate, validateBody([
  body('amount').isFloat({ min: 1 }).withMessage('Valid amount is required'),
  body('method').isIn(['STRIPE', 'MPESA', 'CASH', 'BANK_TRANSFER']).withMessage('Invalid payment method'),
  body('type').notEmpty().withMessage('Payment type is required'),
]), controller.createPayment);

router.post('/stripe/intent', authenticate, validateBody([
  body('amount').isFloat({ min: 1 }).withMessage('Valid amount is required'),
  body('description').optional().isString(),
]), controller.createStripePaymentIntent);

router.post('/mpesa/stkpush', authenticate, validateBody([
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Valid amount is required'),
]), controller.initiateMpesaSTKPush);

router.get('/', authenticate, validateQuery([
  query('method').optional().isString(),
  query('status').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getPayments);

router.get('/stats', authenticate, controller.getPaymentStats);

router.get('/:id', authenticate, controller.getPayment);

router.post('/:id/refund', authenticate, requireRole(['ADMIN', 'ADMIN']), validateBody([
  body('amount').optional().isFloat({ min: 0 }),
  body('reason').optional().isString(),
]), controller.refundPayment);

export default router;
