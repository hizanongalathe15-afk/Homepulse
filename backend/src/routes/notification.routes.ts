import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { NotificationController } from '../controllers/notification.controller';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new (require('../services/notification.service').NotificationService)(prisma, emailService, smsService);
const controller = new NotificationController(notificationService);

const router = require('express').Router();

router.get('/', authenticate, validateQuery([
  query('isRead').optional().isBoolean(),
  query('type').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getNotifications);

router.get('/unread-count', authenticate, controller.getUnreadCount);

router.patch('/:id/read', authenticate, controller.markAsRead);

router.patch('/read-all', authenticate, controller.markAllAsRead);

router.delete('/:id', authenticate, controller.deleteNotification);

router.delete('/clear', authenticate, validateBody([
  body('olderThan').optional().isISO8601(),
]), controller.clearNotifications);

router.get('/preferences', authenticate, controller.getPreferences);

router.put('/preferences', authenticate, validateBody([
  body('EMAIL').optional().isBoolean(),
  body('SMS').optional().isBoolean(),
  body('PUSH').optional().isBoolean(),
  body('marketing').optional().isBoolean(),
]), controller.updatePreferences);

router.post('/test', authenticate, validateBody([
  body('channel').isIn(['IN_APP', 'EMAIL', 'SMS', 'PUSH']),
  body('title').isString(),
  body('MESSAGE').isString(),
]), controller.sendTestNotification);

export default router;
