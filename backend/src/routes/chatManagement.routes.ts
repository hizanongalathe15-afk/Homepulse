import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { ChatManagementController } from '../controllers/chatManagement.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const chatService = new (require('../services/chat.service').ChatService)(prisma, notificationService);
const controller = new ChatManagementController(chatService);

const router = require('express').Router();

router.put('/conversations/:id/mute', authenticate, validateBody([
  body('duration').optional().isInt({ min: 1 }),
]), controller.muteConversation);

router.post('/conversations/:id/pin', authenticate, controller.pinConversation);

router.post('/conversations/:id/archive', authenticate, controller.archiveConversation);

router.post('/messages/:id/edit', authenticate, validateBody([
  body('content').notEmpty().withMessage('Content is required').isLength({ max: 5000 }).withMessage('Content must not exceed 5000 characters'),
]), controller.editMessage);

router.delete('/messages/:id', authenticate, controller.deleteMessage);

router.post('/messages/:id/forward', authenticate, validateBody([
  body('toConversationId').notEmpty().withMessage('Target conversation ID is required'),
]), controller.forwardMessage);

router.post('/conversations/:id/read', authenticate, controller.markConversationAsRead);

router.get('/unread-count', authenticate, controller.getUnreadCount);

export default router;
