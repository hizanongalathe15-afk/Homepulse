import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { CommentService } from '../services/comment.service';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const commentService = new CommentService(prisma, notificationService);

export class CommentController {
  private commentService: CommentService;

  constructor(commentService?: CommentService) {
    this.commentService = commentService || new CommentService(prisma, notificationService);
  }

  getComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await this.commentService.getComments(req.params.propertyId as string, page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.commentService.createComment({
        propertyId: req.params.propertyId as string,
        userId,
        content: req.body.content,
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getReplies = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await this.commentService.getReplies(req.params.id as string, page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  createReply = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const parent = await prisma.propertyComment.findUnique({
        where: { id: req.params.id as string },
        select: { propertyId: true },
      });
      const result = await this.commentService.createComment({
        propertyId: req.body.propertyId || parent?.propertyId || '',
        userId,
        content: req.body.content,
        parentId: req.params.id as string,
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.commentService.updateComment(req.params.id as string, userId, req.body.content);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const userRole = (req as any).user.role;
      const result = await this.commentService.deleteComment(req.params.id as string, userId, userRole);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  likeComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.commentService.likeComment(req.params.id as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  unlikeComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.commentService.unlikeComment(req.params.id as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  pinComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = (req as any).user.role;
      const result = await this.commentService.pinComment(req.params.id as string, userRole);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
