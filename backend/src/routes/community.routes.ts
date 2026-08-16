import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { CommunityController } from '../controllers/community.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const communityService = new (require('../services/community.service').CommunityService)(prisma, notificationService);
const controller = new CommunityController(communityService);

const router = require('express').Router();

router.post('/', authenticate, validateBody([
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('LOCATION').notEmpty().withMessage('Location is required'),
]), controller.createCommunity);

router.get('/', authenticate, validateQuery([
  query('city').optional().isString(),
  query('search').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getCommunities);

router.get('/:id', optionalAuthenticate, controller.getCommunity);

router.post('/:id/join', authenticate, controller.joinCommunity);

router.post('/:id/leave', authenticate, controller.leaveCommunity);

router.post('/:communityId/posts', authenticate, validateBody([
  body('content').notEmpty().withMessage('Content is required'),
  body('type').optional().isIn(['TEXT', 'IMAGE', 'VIDEO', 'POLL']),
]), controller.createPost);

router.get('/:communityId/posts', authenticate, validateQuery([
  query('type').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getPosts);

router.post('/:communityId/events', authenticate, validateBody([
  body('title').notEmpty().withMessage('Title is required'),
  body('eventDate').isISO8601().withMessage('Valid event date is required'),
  body('LOCATION').notEmpty().withMessage('Location is required'),
]), controller.createEvent);

router.get('/:communityId/events', authenticate, controller.getEvents);

router.post('/events/:eventId/rsvp', authenticate, controller.rsvpEvent);

router.post('/events/:eventId/cancel-rsvp', authenticate, controller.cancelRsvp);

export default router;
