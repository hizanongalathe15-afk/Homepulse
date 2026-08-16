import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { ChatController } from '../controllers/chat.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const chatService = new (require('../services/chat.service').ChatService)(prisma, notificationService);
const controller = new ChatController(chatService);

const router = require('express').Router();

router.post('/messages', authenticate, validateBody([
  body('conversationId').notEmpty().withMessage('Conversation ID is required'),
  body('receiverId').notEmpty().withMessage('Receiver ID is required'),
  body('content').notEmpty().withMessage('Message content is required'),
]), controller.sendMessage);

router.get('/conversations', authenticate, controller.getConversations);

router.get('/conversations/:conversationId/messages', authenticate, validateQuery([
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getMessages);

router.patch('/messages/:id/read', authenticate, controller.markAsRead);

router.patch('/conversations/:conversationId/read', authenticate, controller.markConversationAsRead);

router.delete('/messages/:id', authenticate, controller.deleteMessage);

export default router;
