import { body } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { PrismaClient } from '@prisma/client';
import { ThemeService } from '../services/theme.service';
import { createThemeController } from '../controllers/theme.controller';

const prisma = new PrismaClient();
const themeService = new ThemeService(prisma);
const controller = createThemeController(themeService);

const router = require('express').Router();

router.get('/theme', controller.getTheme.bind(controller));

router.put('/admin/theme',
  authenticate,
  requireRole(['ADMIN']),
  validateBody([
    body('name').optional().isString(),
    body('colors').isObject().withMessage('Colors object is required'),
    body('colors.primary').isString().isHexadecimal(),
    body('colors.primaryLight').optional().isString(),
    body('colors.primaryDark').optional().isString(),
    body('colors.secondary').optional().isString(),
    body('colors.tertiary').optional().isString(),
    body('colors.background').optional().isString(),
    body('colors.surface').optional().isString(),
    body('colors.error').optional().isString(),
    body('colors.onPrimary').optional().isString(),
    body('colors.onSecondary').optional().isString(),
    body('colors.success').optional().isString(),
    body('colors.warning').optional().isString(),
    body('colors.info').optional().isString(),
    body('colors.textPrimary').optional().isString(),
    body('colors.textSecondary').optional().isString(),
    body('colors.divider').optional().isString(),
    body('typography').optional().isObject(),
    body('borderRadius').optional().isObject(),
    body('spacing').optional().isObject(),
  ]),
  controller.updateTheme.bind(controller)
);

router.post('/admin/theme/reset',
  authenticate,
  requireRole(['ADMIN']),
  controller.resetTheme.bind(controller)
);

router.get('/admin/theme/history',
  authenticate,
  requireRole(['ADMIN']),
  controller.getThemeHistory.bind(controller)
);

export default router;
