import { Request, Response, NextFunction } from 'express';
import { body, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validation.middleware';
import { ExportController } from '../controllers/export.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const exportService = new (require('../services/export.service').ExportService)(prisma, notificationService);
const controller = new ExportController(exportService);

const router = require('express').Router();

router.get('/properties', authenticate, requireRole(['ADMIN', 'ADMIN']), validateQuery([
  query('city').optional().isString(),
  query('type').optional().isString(),
  query('status').optional().isString(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
]), controller.exportProperties);

router.get('/payments', authenticate, requireRole(['ADMIN', 'ADMIN']), validateQuery([
  query('userId').optional().isString(),
  query('method').optional().isString(),
  query('status').optional().isString(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
]), controller.exportPayments);

router.get('/maintenance', authenticate, requireRole(['ADMIN', 'ADMIN']), validateQuery([
  query('propertyId').optional().isString(),
  query('status').optional().isString(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
]), controller.exportMaintenanceReports);

export default router;
