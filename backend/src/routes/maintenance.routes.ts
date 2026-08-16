import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { MaintenanceController } from '../controllers/maintenance.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const maintenanceService = new (require('../services/maintenance.service').MaintenanceService)(prisma, notificationService);
const controller = new MaintenanceController(maintenanceService);

const router = require('express').Router();

router.post('/', authenticate, validateBody([
  body('propertyId').notEmpty().withMessage('Property ID is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
]), controller.createRequest);

router.get('/my', authenticate, validateQuery([
  query('propertyId').optional().isString(),
  query('status').optional().isString(),
  query('priority').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getRequests);

router.get('/:id', authenticate, controller.getRequest);

router.put('/:id', authenticate, validateBody([
  body('title').optional().notEmpty(),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  body('status').optional().isString(),
]), controller.updateRequest);

router.post('/:id/assign', authenticate, requireRole(['ADMIN', 'ADMIN']), validateBody([
  body('assignedToId').notEmpty().withMessage('AssignedTo ID is required'),
]), controller.assignRequest);

router.post('/:id/complete', authenticate, requireRole(['ADMIN', 'ADMIN']), validateBody([
  body('completionNotes').optional().isString(),
]), controller.completeRequest);

router.post('/:id/cancel', authenticate, validateBody([
  body('reason').notEmpty().withMessage('Cancellation reason is required'),
]), controller.cancelRequest);

router.get('/stats', authenticate, requireRole(['ADMIN', 'ADMIN']), validateQuery([
  query('propertyId').optional().isString(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
]), controller.getMaintenanceStats);

export default router;
