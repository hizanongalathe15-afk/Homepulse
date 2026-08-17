import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { CommentController } from '../controllers/comment.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const commentService = new (require('../services/comment.service').CommentService)(prisma, notificationService);
const controller = new CommentController(commentService);

const router = require('express').Router();

router.get('/property/:propertyId', authenticate, validateQuery([
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getComments);

router.post('/property/:propertyId', authenticate, validateBody([
  body('content').notEmpty().withMessage('Content is required').isLength({ max: 2000 }).withMessage('Content must not exceed 2000 characters'),
]), controller.createComment);

router.get('/:id/replies', authenticate, validateQuery([
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getReplies);

router.post('/:id/replies', authenticate, validateBody([
  body('content').notEmpty().withMessage('Content is required').isLength({ max: 2000 }).withMessage('Content must not exceed 2000 characters'),
  body('propertyId').notEmpty().withMessage('Property ID is required'),
]), controller.createReply);

router.put('/:id', authenticate, validateBody([
  body('content').notEmpty().withMessage('Content is required').isLength({ max: 2000 }).withMessage('Content must not exceed 2000 characters'),
]), controller.updateComment);

router.delete('/:id', authenticate, controller.deleteComment);

router.post('/:id/like', authenticate, controller.likeComment);

router.delete('/:id/like', authenticate, controller.unlikeComment);

router.post('/:id/pin', authenticate, controller.pinComment);

export default router;
