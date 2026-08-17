import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { ChatService } from '../services/chat.service';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const chatService = new ChatService(prisma, notificationService);

export class ChatManagementController {
  private chatService: ChatService;

  constructor(chatService?: ChatService) {
    this.chatService = chatService || new ChatService(prisma, notificationService);
  }

  editMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.chatService.editMessage({
        messageId: req.params.id as string,
        userId,
        content: req.body.content,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.chatService.deleteMessage(req.params.id as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  forwardMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.chatService.forwardMessage({
        messageId: req.params.id as string,
        userId,
        toConversationId: req.body.toConversationId as string,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  muteConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const duration = req.body.duration as number | undefined;
      const result = await this.chatService.muteConversation(req.params.id as string, userId, duration);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  unmuteConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.chatService.unmuteConversation(req.params.id as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  pinConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.chatService.pinConversation(req.params.id as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  archiveConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.chatService.archiveConversation(req.params.id as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  markConversationAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.chatService.markConversationAsRead(req.params.id as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.chatService.getUnreadCount(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
