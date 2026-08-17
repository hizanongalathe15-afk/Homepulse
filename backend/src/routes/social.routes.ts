import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { SocialService } from '../services/social.service';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const socialService = new SocialService(prisma, notificationService);

const router = require('express').Router();

// Property Like/Unlike
router.post('/properties/:propertyId/like', authenticate, validateParams([
  param('propertyId').isUUID().withMessage('Invalid property ID'),
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const result = await socialService.likeProperty(req.params.propertyId as string, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/properties/:propertyId/like', authenticate, validateParams([
  param('propertyId').isUUID().withMessage('Invalid property ID'),
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const result = await socialService.unlikeProperty(req.params.propertyId as string, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/properties/:propertyId/liked', authenticate, validateParams([
  param('propertyId').isUUID().withMessage('Invalid property ID'),
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const liked = await socialService.hasUserLikedProperty(req.params.propertyId as string, userId);
    res.status(200).json({ success: true, liked });
  } catch (error) {
    next(error);
  }
});

router.get('/properties/liked', authenticate, validateQuery([
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await socialService.getUserLikes(userId, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Follow/Unfollow
router.post('/users/:userId/follow', authenticate, validateParams([
  param('userId').isUUID().withMessage('Invalid user ID'),
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const followerId = (req as any).user.id;
    const result = await socialService.followUser(followerId, req.params.userId as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/users/:userId/follow', authenticate, validateParams([
  param('userId').isUUID().withMessage('Invalid user ID'),
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const followerId = (req as any).user.id;
    const result = await socialService.unfollowUser(followerId, req.params.userId as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/users/:userId/following', authenticate, validateParams([
  param('userId').isUUID().withMessage('Invalid user ID'),
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const followedBy = (req as any).user.id;
    const following = await socialService.hasUserFollowed(followedBy, req.params.userId as string);
    res.status(200).json({ success: true, following });
  } catch (error) {
    next(error);
  }
});

router.get('/users/:userId/followers', authenticate, validateQuery([
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await socialService.getFollowers(req.params.userId as string, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/users/:userId/following-list', authenticate, validateQuery([
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await socialService.getFollowing(req.params.userId as string, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Block/Unblock
router.post('/users/:userId/block', authenticate, validateParams([
  param('userId').isUUID().withMessage('Invalid user ID'),
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blockerId = (req as any).user.id;
    const result = await socialService.blockUser(blockerId, req.params.userId as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/users/:userId/block', authenticate, validateParams([
  param('userId').isUUID().withMessage('Invalid user ID'),
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blockerId = (req as any).user.id;
    const result = await socialService.unblockUser(blockerId, req.params.userId as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/users/:userId/blocked', authenticate, validateQuery([
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await socialService.getBlockedUsers(req.params.userId as string, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/users/:userId/is-blocked', authenticate, validateParams([
  param('userId').isUUID().withMessage('Invalid user ID'),
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blockerId = (req as any).user.id;
    const blocked = await socialService.isUserBlocked(blockerId, req.params.userId as string);
    res.status(200).json({ success: true, blocked });
  } catch (error) {
    next(error);
  }
});

router.get('/blocked-users', authenticate, validateQuery([
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await socialService.getBlockedUsers(userId, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
