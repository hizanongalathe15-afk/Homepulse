import { Request, Response, NextFunction } from 'express';
import { body, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validation.middleware';
import { RoommateController } from '../controllers/roommate.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const roommateService = new (require('../services/roommateMatching.service').RoommateMatchingService)(prisma, notificationService);
const controller = new RoommateController(roommateService);

const router = require('express').Router();

router.post('/profile', authenticate, validateBody([
  body('budgetMin').optional().isFloat(),
  body('budgetMax').optional().isFloat(),
  body('moveInDate').optional().isISO8601(),
  body('duration').optional().isString(),
  body('lifestyle').optional().isArray(),
]), controller.createProfile);

router.get('/profile', authenticate, controller.getProfile);

router.put('/profile', authenticate, validateBody([
  body('budgetMin').optional().isFloat(),
  body('budgetMax').optional().isFloat(),
  body('moveInDate').optional().isISO8601(),
  body('duration').optional().isString(),
  body('lifestyle').optional().isArray(),
]), controller.updateProfile);

router.get('/matches', authenticate, validateQuery([
  query('city').optional().isString(),
  query('minBudget').optional().isFloat(),
  query('maxBudget').optional().isFloat(),
  query('moveInDate').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.findMatches);

export default router;
