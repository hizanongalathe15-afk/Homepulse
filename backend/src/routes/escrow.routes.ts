import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { EscrowController } from '../controllers/escrow.controller';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';
import { NotificationService } from '../services/notification.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const escrowService = new (require('../services/escrow.service').EscrowService)(prisma, notificationService);
const controller = new EscrowController(escrowService);

const router = require('express').Router();

router.post('/', authenticate, validateBody([
  body('propertyId').notEmpty().withMessage('Property ID is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Valid amount is required'),
  body('holdDays').optional().isInt({ min: 1 }),
]), controller.createEscrow);

router.get('/my', authenticate, validateQuery([
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getMyEscrows);

router.get('/', authenticate, requireRole(['ADMIN', 'ADMIN']), validateQuery([
  query('status').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getEscrows);

router.get('/:id', authenticate, controller.getEscrow);

router.post('/:id/release', authenticate, controller.releaseEscrow);

router.post('/:id/cancel', authenticate, validateBody([
  body('reason').notEmpty().withMessage('Cancellation reason is required'),
]), controller.cancelEscrow);

export default router;
