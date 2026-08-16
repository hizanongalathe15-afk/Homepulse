import { Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateQuery } from '../middleware/validation.middleware';
import { RecommendationController } from '../controllers/recommendation.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const recommendationService = new (require('../services/recommendation.service').RecommendationService)(prisma, notificationService);
const controller = new RecommendationController(recommendationService);

const router = require('express').Router();

router.get('/recommendations', authenticate, validateQuery([
  query('city').optional().isString(),
  query('type').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 50 }),
]), controller.getRecommendations);

router.get('/similar/:propertyId', authenticate, validateQuery([
  query('limit').optional().isInt({ min: 1, max: 20 }),
]), controller.getSimilarProperties);

router.get('/trending', authenticate, validateQuery([
  query('city').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 50 }),
]), controller.getTrendingProperties);

export default router;
