import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, optionalAuthenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { BannerController } from '../controllers/banner.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const bannerService = new (require('../services/banner.service').BannerService)(prisma, notificationService);
const controller = new BannerController(bannerService);

const router = require('express').Router();

router.post('/', authenticate, requireRole(['ADMIN', 'ADMIN']), validateBody([
  body('title').notEmpty().withMessage('Title is required'),
  body('imageUrl').notEmpty().withMessage('Image URL is required'),
]), controller.createBanner);

router.get('/', authenticate, requireRole(['ADMIN', 'ADMIN']), validateQuery([
  query('status').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getBanners);

router.get('/active', authenticate, controller.getActiveBanners);

router.get('/stats', authenticate, requireRole(['ADMIN', 'ADMIN']), controller.getBannerStats);

router.get('/:id', authenticate, requireRole(['ADMIN', 'ADMIN']), controller.getBanner);

router.put('/:id', authenticate, requireRole(['ADMIN', 'ADMIN']), validateBody([
  body('title').optional().notEmpty(),
  body('imageUrl').optional().notEmpty(),
]), controller.updateBanner);

router.delete('/:id', authenticate, requireRole(['ADMIN', 'ADMIN']), controller.deleteBanner);

router.post('/:id/view', optionalAuthenticate, controller.recordView);

router.post('/:id/click', controller.recordClick);

export default router;
