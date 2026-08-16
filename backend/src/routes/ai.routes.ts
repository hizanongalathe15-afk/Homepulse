import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { AiController } from '../controllers/ai.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const aiService = new (require('../services/ai.service').AiService)(prisma, notificationService);
const controller = new AiController(aiService);

const router = require('express').Router();

router.post('/generate-description', authenticate, validateBody([
  body('title').notEmpty().withMessage('Title is required'),
  body('type').notEmpty().withMessage('Type is required'),
  body('features').isArray({ min: 1 }).withMessage('At least one feature is required'),
]), controller.generatePropertyDescription);

router.post('/suggest-price', authenticate, validateBody([
  body('city').notEmpty().withMessage('City is required'),
  body('type').notEmpty().withMessage('Type is required'),
  body('bedrooms').isInt({ min: 1 }),
  body('bathrooms').isInt({ min: 1 }),
  body('area').isFloat({ min: 1 }),
]), controller.suggestPropertyPrice);

router.get('/predict-maintenance/:propertyId', authenticate, controller.predictMaintenancePriority);

router.post('/chatbot', authenticate, validateBody([
  body('query').notEmpty().withMessage('Query is required'),
]), controller.getChatbotResponse);

export default router;
