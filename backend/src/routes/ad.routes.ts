import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { AdController } from '../controllers/ad.controller';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const adService = new (require('../services/ad.service').AdService)(prisma);
const controller = new AdController(adService);

const router = require('express').Router();

router.get('/', authenticate, requireRole(['ADMIN', 'ADMIN']), validateQuery([
  query('status').optional().isString(),
  query('targetType').optional().isString(),
  query('search').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getAdCampaigns);

router.post('/', authenticate, requireRole(['ADMIN', 'ADMIN']), validateBody([
  body('title').notEmpty().withMessage('Title is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('budget').isFloat({ min: 0 }).withMessage('Valid budget is required'),
]), controller.createAdCampaign);

router.get('/stats', authenticate, requireRole(['ADMIN', 'ADMIN']), controller.getAdCampaignStats);

router.get('/active', authenticate, controller.getActiveAdCampaigns);

router.get('/:id', authenticate, requireRole(['ADMIN', 'ADMIN']), validateParams([
  param('id').isString(),
]), controller.getAdCampaign);

router.put('/:id', authenticate, requireRole(['ADMIN', 'ADMIN']), validateParams([
  param('id').isString(),
]), controller.updateAdCampaign);

router.delete('/:id', authenticate, requireRole(['ADMIN', 'ADMIN']), validateParams([
  param('id').isString(),
]), controller.deleteAdCampaign);

router.post('/:id/impression', controller.recordImpression);

router.post('/:id/click', controller.recordClick);

export default router;
