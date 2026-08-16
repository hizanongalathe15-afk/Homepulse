import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { CampaignController } from '../controllers/campaign.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const campaignService = new (require('../services/campaign.service').CampaignService)(prisma);
const controller = new CampaignController(campaignService, notificationService);

const router = require('express').Router();

router.get('/', authenticate, requireRole(['ADMIN', 'ADMIN']), validateQuery([
  query('status').optional().isString(),
  query('bannerId').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getCampaigns);

router.post('/', authenticate, requireRole(['ADMIN', 'ADMIN']), validateBody([
  body('title').notEmpty().withMessage('Title is required'),
  body('bannerId').notEmpty().withMessage('Banner ID is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('budget').isFloat({ min: 0 }).withMessage('Valid budget is required'),
]), controller.createCampaign);

router.get('/stats', authenticate, requireRole(['ADMIN', 'ADMIN']), controller.getCampaignStats);

router.get('/active', authenticate, controller.getActiveCampaigns);

router.get('/:id', authenticate, requireRole(['ADMIN', 'ADMIN']), controller.getCampaign);

router.put('/:id', authenticate, requireRole(['ADMIN', 'ADMIN']), validateBody([
  body('title').optional().notEmpty(),
  body('budget').optional().isFloat({ min: 0 }),
  body('status').optional().isString(),
]), controller.updateCampaign);

router.delete('/:id', authenticate, requireRole(['ADMIN', 'ADMIN']), controller.deleteCampaign);

router.post('/:id/activate', authenticate, requireRole(['ADMIN', 'ADMIN']), controller.activateCampaign);

router.post('/:id/pause', authenticate, requireRole(['ADMIN', 'ADMIN']), controller.pauseCampaign);

router.post('/:id/conversion', authenticate, validateBody([
  body('type').notEmpty().withMessage('Conversion type is required'),
]), controller.recordConversion);

router.get('/:id/analytics', authenticate, requireRole(['ADMIN', 'ADMIN']), controller.getCampaignAnalytics);

export default router;
