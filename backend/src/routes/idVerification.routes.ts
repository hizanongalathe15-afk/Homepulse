import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { IdVerificationController } from '../controllers/idVerification.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const idVerificationService = new (require('../services/idVerification.service').IdVerificationService)(prisma, notificationService);
const controller = new IdVerificationController(idVerificationService);

const router = require('express').Router();

router.post('/submit', authenticate, validateBody([
  body('idType').isIn(['NATIONAL_ID', 'PASSPORT', 'DRIVING_LICENSE']).withMessage('Invalid ID type'),
  body('idNumber').notEmpty().withMessage('ID number is required'),
]), controller.submitVerification);

router.get('/my', authenticate, controller.getMyVerification);

router.get('/:id', authenticate, requireRole(['ADMIN', 'ADMIN']), controller.getVerification);

router.post('/:id/approve', authenticate, requireRole(['ADMIN', 'ADMIN']), controller.approveVerification);

router.post('/:id/reject', authenticate, requireRole(['ADMIN', 'ADMIN']), validateBody([
  body('reason').notEmpty().withMessage('Rejection reason is required'),
]), controller.rejectVerification);

router.get('/pending', authenticate, requireRole(['ADMIN', 'ADMIN']), validateQuery([
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getPendingVerifications);

export default router;
