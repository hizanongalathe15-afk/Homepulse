import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { LeaseController } from '../controllers/lease.controller';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const leaseService = new (require('../services/lease.service').LeaseService)(prisma);
const controller = new LeaseController(leaseService);

const router = require('express').Router();

router.get('/my', authenticate, validateQuery([
  query('status').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getTenantLeases);

router.get('/landlord', authenticate, validateQuery([
  query('status').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), controller.getLandlordLeases);

router.get('/:id', optionalAuthenticate, controller.getLease);

router.post('/', authenticate, validateBody([
  body('propertyId').notEmpty().withMessage('Property ID is required'),
  body('landlordId').notEmpty().withMessage('Landlord ID is required'),
  body('startDate').notEmpty().withMessage('Start date is required'),
  body('endDate').notEmpty().withMessage('End date is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Valid amount is required'),
]), controller.createLease);

router.put('/:id', authenticate, validateBody([
  body('status').optional().isString(),
  body('endDate').optional().isString(),
  body('amount').optional().isFloat({ min: 0 }),
  body('depositStatus').optional().isString(),
  body('terms').optional().isString(),
  body('documentUrl').optional().isString(),
  body('signedAt').optional().isString(),
  body('terminatedAt').optional().isString(),
]), controller.updateLease);

router.post('/:id/terminate', authenticate, controller.terminateLease);

export default router;
