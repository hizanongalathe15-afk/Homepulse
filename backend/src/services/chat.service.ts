import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { body, param, query } from 'express-validator';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

export interface ChatMessageData {
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type?: string;
  mediaUrl?: string;
}

export class ChatService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async sendMessage(data: ChatMessageData) {
    try {
      const message = await this.prisma.chatMessage.create({
        data: {
          conversationId: data.conversationId,
          senderId: data.senderId,
          receiverId: data.receiverId,
          content: data.content,
          type: (data.type || 'TEXT') as any,
          mediaUrl: data.mediaUrl,
        },
        include: {
          sender: { select: { firstName: true, lastName: true, profileImage: true } },
          receiver: { select: { firstName: true, lastName: true, profileImage: true } },
        },
      });

      await this.notificationService.sendNotification({
        userId: data.receiverId,
        type: 'NEW_MESSAGE',
        title: 'New Message',
        message: `${message.sender.firstName} sent you a message`,
        data: { conversationId: data.conversationId, messageId: message.id },
      });

      logger.info(`Message sent: ${message.id}`);

      return {
        success: true,
        data: message,
      };
    } catch (error) {
      logger.error('Failed to send message:', error);
      throw new AppError('Failed to send message', 500);
    }
  }

  async getMessages(conversationId: string, userId: string, filters?: { page?: number; limit?: number }) {
    try {
      const whereClause: any = {
        conversationId,
        OR: [{ senderId: userId }, { receiverId: userId }],
      };

      const page = filters?.page || 1;
      const limit = filters?.limit || 50;
      const skip = (page - 1) * limit;

      const [messages, total] = await Promise.all([
        this.prisma.chatMessage.findMany({
          where: whereClause,
          include: {
            sender: { select: { firstName: true, lastName: true, profileImage: true } },
            receiver: { select: { firstName: true, lastName: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.chatMessage.count({ where: whereClause }),
      ]);

      const unreadCount = await this.prisma.chatMessage.count({
        where: { ...whereClause, receiverId: userId, isRead: false },
      });

      return {
        success: true,
        data: messages.reverse(),
        total,
        page,
        limit,
        hasMore: total > skip + limit,
        unreadCount,
      };
    } catch (error) {
      logger.error('Failed to get messages:', error);
      throw new AppError('Failed to fetch messages', 500);
    }
  }

  async markAsRead(messageId: string, userId: string) {
    try {
      const message = await this.prisma.chatMessage.findUnique({
        where: { id: messageId },
        select: { id: true, receiverId: true },
      });

      if (!message) {
        throw new AppError('Message not found', 404);
      }

      if (message.receiverId !== userId) {
        throw new AppError('Not authorized to mark this message as read', 403);
      }

      await this.prisma.chatMessage.update({
        where: { id: messageId },
        data: { isRead: true, readAt: new Date() },
      });

      return {
        success: true,
        message: 'Message marked as read',
      };
    } catch (error) {
      logger.error(`Failed to mark message ${messageId} as read:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to mark message as read', 500);
    }
  }

  async markConversationAsRead(conversationId: string, userId: string) {
    try {
      await this.prisma.chatMessage.updateMany({
        where: { conversationId, receiverId: userId, isRead: false },
        data: { isRead: true, readAt: new Date() },
      });

      return {
        success: true,
        message: 'Conversation marked as read',
      };
    } catch (error) {
      logger.error(`Failed to mark conversation ${conversationId} as read:`, error);
      throw new AppError('Failed to mark conversation as read', 500);
    }
  }

  async getConversations(userId: string) {
    try {
      const conversations = await this.prisma.chatMessage.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
        include: {
          sender: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
          receiver: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      const conversationMap = new Map();

      for (const message of conversations) {
        const otherUser = message.senderId === userId ? message.receiver : message.sender;
        const conversationId = message.conversationId;

        if (!conversationMap.has(conversationId)) {
          const unreadCount = await this.prisma.chatMessage.count({
            where: { conversationId, receiverId: userId, isRead: false },
          });

          conversationMap.set(conversationId, {
            conversationId,
            participant: otherUser,
            lastMessage: message,
            unreadCount,
          });
        }
      }

      return {
        success: true,
        data: Array.from(conversationMap.values()),
      };
    } catch (error) {
      logger.error('Failed to get conversations:', error);
      throw new AppError('Failed to fetch conversations', 500);
    }
  }

  async deleteMessage(messageId: string, userId: string) {
    try {
      const message = await this.prisma.chatMessage.findUnique({
        where: { id: messageId },
        select: { id: true, senderId: true },
      });

      if (!message) {
        throw new AppError('Message not found', 404);
      }

      if (message.senderId !== userId) {
        throw new AppError('Not authorized to delete this message', 403);
      }

      await this.prisma.chatMessage.delete({
        where: { id: messageId },
      });

      return {
        success: true,
        message: 'Message deleted successfully',
      };
    } catch (error) {
      logger.error(`Failed to delete message ${messageId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete message', 500);
    }
  }
}
