import { Request, Response, NextFunction } from 'express';
import { body, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validation.middleware';
import { SearchController } from '../controllers/search.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const searchService = new (require('../services/search.service').SearchService)(prisma, notificationService);
const controller = new SearchController(searchService);

const router = require('express').Router();

router.get('/properties', validateQuery([
  query('q').optional().isString(),
  query('city').optional().isString(),
  query('type').optional().isString(),
  query('minPrice').optional().isFloat(),
  query('maxPrice').optional().isFloat(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.search);

router.get('/advanced', validateQuery([
  query('city').optional().isString(),
  query('type').optional().isString(),
  query('minPrice').optional().isFloat(),
  query('maxPrice').optional().isFloat(),
  query('bedrooms').optional().isInt(),
  query('bathrooms').optional().isInt(),
  query('neighborhood').optional().isString(),
  query('amenities').optional().isArray(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.advancedSearch);

router.get('/suggestions', validateQuery([
  query('q').optional().isString(),
]), controller.getSuggestions);

router.post('/saved-searches', authenticate, validateBody([
  body('name').notEmpty().withMessage('Name is required'),
  body('filters').isObject().withMessage('Filters must be an object'),
]), controller.saveSearch);

router.get('/saved-searches', authenticate, validateQuery([
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getSavedSearches);

router.delete('/saved-searches/:id', authenticate, controller.deleteSavedSearch);

export default router;
