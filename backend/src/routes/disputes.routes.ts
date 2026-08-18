import express, { Request, Response, NextFunction } from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { body, param, query } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), validateQuery([
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isString().withMessage('Status must be a string'),
  query('type').optional().isString().withMessage('Type must be a string'),
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const where: any = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.type) where.type = req.query.type;

    const [disputes, total] = await Promise.all([
      prisma.dispute.findMany({ where, skip: offset, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.dispute.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: disputes,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), validateParams([
  param('id').isString().withMessage('Dispute ID is required'),
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dispute = await prisma.dispute.findUnique({ where: { id: req.params.id } });
    if (!dispute) {
      return res.status(404).json({ success: false, error: 'Dispute not found' });
    }
    res.status(200).json({ success: true, data: dispute });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/assign', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), validateParams([
  param('id').isString().withMessage('Dispute ID is required'),
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dispute = await prisma.dispute.update({
      where: { id: req.params.id },
      data: { assignedToId: req.body.assignedToId },
    });
    res.status(200).json({ success: true, data: dispute });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/resolve', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), validateParams([
  param('id').isString().withMessage('Dispute ID is required'),
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dispute = await prisma.dispute.update({
      where: { id: req.params.id },
      data: { status: 'RESOLVED', resolution: req.body.resolution, resolvedAt: new Date() },
    });
    res.status(200).json({ success: true, data: dispute });
  } catch (error) {
    next(error);
  }
});

export default router;
