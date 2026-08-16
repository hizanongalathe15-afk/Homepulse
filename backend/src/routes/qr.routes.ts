import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { QRCodeController } from '../controllers/qr.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const qrService = new (require('../services/qr.service').QRCodeService)(prisma, notificationService);
const controller = new QRCodeController(qrService);

const router = require('express').Router();

router.post('/generate', authenticate, validateBody([
  body('propertyId').notEmpty().withMessage('Property ID is required'),
  body('maxScans').optional().isInt({ min: 1 }),
]), controller.generateQRCode);

router.post('/scan', optionalAuthenticate, validateBody([
  body('code').notEmpty().withMessage('QR code is required'),
]), controller.scanQRCode);

router.get('/my', authenticate, validateQuery([
  query('propertyId').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getMyQRCodes);

router.delete('/:id', authenticate, controller.deactivateQRCode);

router.get('/stats/:propertyId', authenticate, controller.getQRCodeStats);

export default router;
