import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { PropertyController } from '../controllers/property.controller';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';
import { NotificationService } from '../services/notification.service';
import { SearchService } from '../services/search.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const searchService = new SearchService(prisma, notificationService);
const propertyService = new (require('../services/property.service').PropertyService)(prisma, searchService, notificationService);
const controller = new PropertyController(propertyService, searchService);

const router = require('express').Router();

router.post('/', authenticate, validateBody([
  body('title').notEmpty().withMessage('Title is required'),
  body('type').notEmpty().withMessage('Type is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('city').notEmpty().withMessage('City is required'),
]), controller.createProperty);

router.get('/', optionalAuthenticate, validateQuery([
  query('city').optional().isString(),
  query('type').optional().isString(),
  query('minPrice').optional().isFloat(),
  query('maxPrice').optional().isFloat(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getProperties);

router.get('/search', validateQuery([
  query('q').optional().isString(),
  query('city').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.searchProperties);

router.get('/my', authenticate, validateQuery([
  query('status').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getMyProperties);

router.get('/:id', optionalAuthenticate, controller.getProperty);

router.put('/:id', authenticate, validateBody([
  body('title').optional().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
]), controller.updateProperty);

router.delete('/:id', authenticate, controller.deleteProperty);

export default router;
