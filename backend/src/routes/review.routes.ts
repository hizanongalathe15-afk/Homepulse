import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { ReviewController } from '../controllers/review.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const reviewService = new (require('../services/review.service').ReviewService)(prisma, notificationService);
const controller = new ReviewController(reviewService);

const router = require('express').Router();

router.post('/', authenticate, validateBody([
  body('targetId').notEmpty().withMessage('Target ID is required'),
  body('targetType').isIn(['property', 'user', 'LANDLORD', 'TENANT']).withMessage('Invalid target type'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString(),
]), controller.createReview);

router.get('/', validateQuery([
  query('targetId').optional().isString(),
  query('targetType').optional().isString(),
  query('authorId').optional().isString(),
  query('rating').optional().isInt(),
  query('sortBy').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getReviews);

router.get('/stats/:targetId', controller.getReviewStats);

router.get('/:id', optionalAuthenticate, controller.getReview);

router.put('/:id', authenticate, validateBody([
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('comment').optional().isString(),
]), controller.updateReview);

router.delete('/:id', authenticate, controller.deleteReview);

router.post('/:id/helpful', authenticate, controller.markHelpful);

router.post('/:id/unhelpful', authenticate, controller.unmarkHelpful);

router.post('/:id/report', authenticate, validateBody([
  body('reason').notEmpty().withMessage('Reason is required'),
]), controller.reportReview);

export default router;
