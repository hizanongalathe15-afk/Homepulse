import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { AdminController } from '../controllers/admin.controller';
import { PrismaClient } from '@prisma/client';
import { AdminService } from '../services/admin.service';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const analyticsService = new (require('../services/analytics.service').AnalyticsService)(prisma, notificationService);
const adminService = new AdminService(prisma, analyticsService, notificationService);
const controller = new AdminController(adminService);

const router = require('express').Router();

router.get('/dashboard', authenticate, requireRole(['ADMIN', 'ADMIN']), controller.getDashboard);

router.get('/users', authenticate, requireRole(['ADMIN', 'ADMIN']), validateQuery([
  query('role').optional().isString(),
  query('status').optional().isString(),
  query('search').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getUsers);

router.get('/users/:id', authenticate, requireRole(['ADMIN', 'ADMIN']), controller.getUser);

router.put('/users/:id', authenticate, requireRole(['ADMIN', 'ADMIN']), validateBody([
  body('role').optional().isString(),
  body('status').optional().isString(),
]), controller.updateUser);

router.delete('/users/:id', authenticate, requireRole(['ADMIN', 'ADMIN']), controller.deleteUser);

router.get('/properties', authenticate, requireRole(['ADMIN', 'ADMIN']), validateQuery([
  query('status').optional().isString(),
  query('city').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getProperties);

router.post('/properties/:id/approve', authenticate, requireRole(['ADMIN', 'ADMIN']), validateBody([
  body('APPROVED').isBoolean().withMessage('Approved must be a boolean'),
  body('reason').optional().isString(),
]), controller.approveProperty);

router.get('/payments', authenticate, requireRole(['ADMIN', 'ADMIN']), validateQuery([
  query('method').optional().isString(),
  query('status').optional().isString(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getPayments);

router.get('/settings', authenticate, requireRole(['ADMIN', 'ADMIN']), controller.getSettings);

router.put('/settings', authenticate, requireRole(['ADMIN', 'ADMIN']), validateBody([
  body('platform_fee_percentage').optional().isFloat(),
  body('escrow_hold_days').optional().isInt(),
]), controller.updateSettings);

router.post('/broadcast', authenticate, requireRole(['ADMIN', 'ADMIN']), validateBody([
  body('title').notEmpty().withMessage('Title is required'),
  body('MESSAGE').notEmpty().withMessage('Message is required'),
  body('channels').isArray({ min: 1 }).withMessage('At least one channel is required'),
  body('targetRoles').optional().isArray(),
]), controller.broadcastMessage);

export default router;
