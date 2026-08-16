import { Request, Response, NextFunction } from 'express';
import { body, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validation.middleware';
import { FraudDetectionController } from '../controllers/fraudDetection.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const fraudService = new (require('../services/fraudDetection.service').FraudDetectionService)(prisma, notificationService);
const controller = new FraudDetectionController(fraudService);

const router = require('express').Router();

router.get('/detect', authenticate, controller.detectSuspiciousActivity);

router.post('/report', authenticate, validateBody([
  body('entityType').isIn(['PROPERTY', 'REVIEW', 'USER', 'PAYMENT']).withMessage('Invalid entity type'),
  body('entityId').notEmpty().withMessage('Entity ID is required'),
  body('reason').notEmpty().withMessage('Reason is required'),
]), controller.reportFraud);

router.get('/reports', authenticate, requireRole(['ADMIN', 'ADMIN']), validateQuery([
  query('status').optional().isString(),
  query('entityType').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getFraudReports);

export default router;
