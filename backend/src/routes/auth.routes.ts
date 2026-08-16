import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { AuthController } from '../controllers/auth.controller';

const controller = new AuthController();

const router = require('express').Router();

router.post('/register', validateBody([
  body('EMAIL').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
]), controller.register);

router.post('/login', validateBody([
  body('EMAIL').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
]), controller.login);

router.post('/refresh-token', validateBody([
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
]), controller.refreshToken);

router.post('/forgot-password', validateBody([
  body('EMAIL').isEmail().withMessage('Valid email is required'),
]), controller.forgotPassword);

router.post('/reset-password', validateBody([
  body('token').notEmpty().withMessage('Token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
]), controller.resetPassword);

router.post('/verify-email', validateBody([
  body('EMAIL').isEmail().withMessage('Valid email is required'),
  body('otp').notEmpty().withMessage('OTP is required'),
]), controller.verifyEmail);

router.post('/change-password', authenticate, validateBody([
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
]), controller.changePassword);

router.get('/me', authenticate, controller.getMe);

router.put('/me', authenticate, validateBody([
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('phone').optional().isMobilePhone('any').withMessage('Valid phone number is required'),
]), controller.updateProfile);

export default router;
