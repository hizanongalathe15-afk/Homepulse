import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { SubscriptionService } from '../services/subscription.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const subscriptionService = new SubscriptionService();

const router = Router();

const adminRoleCheck = requireRole(['ADMIN']);

router.use(authenticate);

router.get('/plans', validateQuery([
  query('activeOnly').optional().isBoolean(),
]), async (req, res, next) => {
  try {
    const activeOnly = req.query.activeOnly === 'false' ? false : true;
    const plans = await subscriptionService.getPlans(activeOnly);
    res.json(plans);
  } catch (error) {
    next(error);
  }
});

router.post('/plans', adminRoleCheck, validateBody([
  body('name').notEmpty().withMessage('Plan name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('billingCycle').isIn(['monthly', 'yearly']).withMessage('Invalid billing cycle'),
]), async (req, res, next) => {
  try {
    const plan = await subscriptionService.createPlan(req.body);
    res.status(201).json(plan);
  } catch (error) {
    next(error);
  }
});

router.put('/plans/:id', adminRoleCheck, validateParams([
  param('id').notEmpty(),
]), async (req, res, next) => {
  try {
    const plan = await subscriptionService.updatePlan(req.params.id as string, req.body);
    res.json(plan);
  } catch (error) {
    next(error);
  }
});

router.delete('/plans/:id', adminRoleCheck, validateParams([
  param('id').notEmpty(),
]), async (req, res, next) => {
  try {
    await subscriptionService.deletePlan(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get('/subscriptions/user/:userId', adminRoleCheck, validateParams([
  param('userId').notEmpty(),
]), async (req, res, next) => {
  try {
    const sub = await subscriptionService.getUserSubscription(req.params.userId as string);
    res.json(sub);
  } catch (error) {
    next(error);
  }
});

router.post('/subscriptions', adminRoleCheck, validateBody([
  body('userId').notEmpty().withMessage('User ID is required'),
  body('planId').notEmpty().withMessage('Plan ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount is required'),
]), async (req, res, next) => {
  try {
    const sub = await subscriptionService.createSubscription(req.body);
    res.status(201).json(sub);
  } catch (error) {
    next(error);
  }
});

router.post('/subscriptions/:id/cancel', adminRoleCheck, validateParams([
  param('id').notEmpty(),
]), async (req, res, next) => {
  try {
    const result = await subscriptionService.cancelSubscription(req.params.id as string);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/subscriptions/:id/renew', adminRoleCheck, validateParams([
  param('id').notEmpty(),
]), async (req, res, next) => {
  try {
    const sub = await subscriptionService.renewSubscription(req.params.id as string);
    res.json(sub);
  } catch (error) {
    next(error);
  }
});

router.get('/revenue/stats', adminRoleCheck, validateQuery([
  query('days').optional().isInt({ min: 1 }),
]), async (req, res, next) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const stats = await subscriptionService.getRevenueStats(days);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

router.get('/revenue/popular-plans', adminRoleCheck, async (req, res, next) => {
  try {
    const plans = await subscriptionService.getMostPopularPlans();
    res.json(plans);
  } catch (error) {
    next(error);
  }
});

router.get('/revenue/user/:userId', adminRoleCheck, validateParams([
  param('userId').notEmpty(),
]), async (req, res, next) => {
  try {
    const stats = await subscriptionService.getUserRevenue(req.params.userId as string);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

export default router;
