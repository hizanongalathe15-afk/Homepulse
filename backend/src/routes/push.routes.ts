import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { PushController } from '../controllers/push.controller';
import { PushService } from '../services/push.service';
import { NotificationService } from '../services/notification.service';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const pushService = new (require('../services/push.service').PushService)(notificationService);
const controller = new PushController(pushService);

const router = require('express').Router();

router.post('/send', authenticate, validateBody([
  body('title').notEmpty().withMessage('Title is required'),
  body('body').notEmpty().withMessage('Body is required'),
]), controller.sendPushNotification);

export default router;
