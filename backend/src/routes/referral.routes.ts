import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { ReferralController } from '../controllers/referral.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const referralService = new (require('../services/referral.service').ReferralService)(prisma, notificationService);
const controller = new ReferralController(referralService);

const router = require('express').Router();

router.post('/', authenticate, validateBody([
  body('code').notEmpty().withMessage('Referral code is required'),
  body('rewardType').optional().isString(),
  body('rewardAmount').optional().isFloat(),
]), controller.createReferral);

router.get('/', authenticate, validateQuery([
  query('referrerId').optional().isString(),
  query('status').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getReferrals);

router.get('/:id', authenticate, controller.getReferral);

router.post('/redeem', authenticate, validateBody([
  body('code').notEmpty().withMessage('Referral code is required'),
]), controller.redeemReferral);

router.get('/my', authenticate, validateQuery([
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getMyReferrals);

router.get('/my/stats', authenticate, controller.getReferralStats);

export default router;
