import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { SafetyController } from '../controllers/safety.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const safetyService = new (require('../services/safety.service').SafetyService)(prisma, notificationService);
const controller = new SafetyController(safetyService);

const router = require('express').Router();

router.post('/sos', authenticate, validateBody([
  body('type').isIn(['PANIC', 'MEDICAL', 'CRIME']).withMessage('Invalid SOS type'),
  body('LOCATION').optional().isString(),
  body('MESSAGE').optional().isString(),
]), controller.createSOSAlert);

router.get('/sos/my', authenticate, validateQuery([
  query('status').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getMySOSAlerts);

router.get('/sos/:id', authenticate, controller.getSOSAlert);

router.post('/sos/:id/resolve', authenticate, controller.resolveSOSAlert);

router.post('/reports', authenticate, validateBody([
  body('type').isIn(['HARASSMENT', 'SCAM', 'OTHER', 'NOISE', 'OTHER']).withMessage('Invalid report type'),
  body('title').notEmpty().withMessage('Title is required'),
]), controller.createSafetyReport);

router.get('/reports', authenticate, requireRole(['ADMIN', 'ADMIN']), validateQuery([
  query('type').optional().isString(),
  query('status').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getSafetyReports);

router.post('/reports/:id/assign', authenticate, requireRole(['ADMIN', 'ADMIN']), validateBody([
  body('assignedToId').notEmpty().withMessage('AssignedTo ID is required'),
]), controller.assignSafetyReport);

router.post('/reports/:id/resolve', authenticate, requireRole(['ADMIN', 'ADMIN']), validateBody([
  body('resolution').notEmpty().withMessage('Resolution is required'),
]), controller.resolveSafetyReport);

export default router;
