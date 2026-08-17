import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { NotificationService } from './notification.service';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';

export interface EditMessageData {
  messageId: string;
  userId: string;
  content: string;
}

export interface ForwardMessageData {
  messageId: string;
  userId: string;
  toConversationId: string;
}

export class ChatService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async sendMessage(data: {
    conversationId: string;
    senderId: string;
    receiverId: string;
    content: string;
    type?: string;
    mediaUrl?: string;
  }) {
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
      return { success: true, data: message };
    } catch (error) {
      logger.error('Failed to send message:', error);
      throw new AppError('Failed to send message', 500);
    }
  }

  async getMessages(conversationId: string, userId: string, filters?: { page?: number; limit?: number }) {
    try {
      const whereClause: any = { conversationId, deletedAt: null };
      const page = filters?.page || 1;
      const limit = filters?.limit || 50;
      const skip = (page - 1) * limit;

      const [messages, total] = await Promise.all([
        this.prisma.chatMessage.findMany({
          where: whereClause,
          include: {
            sender: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
            receiver: { select: { id: true, firstName: true, lastName: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.chatMessage.count({ where: whereClause }),
      ]);

      const unreadCount = await this.prisma.chatMessage.count({
        where: { conversationId, receiverId: userId, isRead: false, deletedAt: null },
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

      return { success: true, message: 'Message marked as read' };
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

      return { success: true, message: 'Conversation marked as read' };
    } catch (error) {
      logger.error(`Failed to mark conversation ${conversationId} as read:`, error);
      throw new AppError('Failed to mark conversation as read', 500);
    }
  }

  async getConversations(userId: string) {
    try {
      const messages = await this.prisma.chatMessage.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
          deletedAt: null,
        },
        include: {
          sender: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
          receiver: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      const conversationMap = new Map();
      for (const message of messages) {
        const otherUser = message.senderId === userId ? message.receiver : message.sender;
        const conversationId = message.conversationId;

        if (!conversationMap.has(conversationId)) {
          const unreadCount = await this.prisma.chatMessage.count({
            where: { conversationId, receiverId: userId, isRead: false, deletedAt: null },
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

      await this.prisma.chatMessage.update({
        where: { id: messageId },
        data: { deletedAt: new Date() },
      });

      await this.prisma.chatMessageAction.create({
        data: {
          messageId,
          userId,
          action: 'deleted',
        },
      });

      return { success: true, message: 'Message deleted successfully' };
    } catch (error) {
      logger.error(`Failed to delete message ${messageId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete message', 500);
    }
  }

  async editMessage(data: EditMessageData) {
    try {
      const message = await this.prisma.chatMessage.findUnique({
        where: { id: data.messageId },
        select: { id: true, senderId: true, content: true },
      });

      if (!message) {
        throw new AppError('Message not found', 404);
      }

      if (message.senderId !== data.userId) {
        throw new AppError('Not authorized to edit this message', 403);
      }

      const updated = await this.prisma.chatMessage.update({
        where: { id: data.messageId },
        data: { content: data.content, editedAt: new Date() },
        include: {
          sender: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
          receiver: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
        },
      });

      await this.prisma.chatMessageAction.create({
        data: {
          messageId: data.messageId,
          userId: data.userId,
          action: 'edited',
          metadata: { previousContent: message.content },
        },
      });

      logger.info(`Message edited: ${data.messageId}`);
      return { success: true, data: updated };
    } catch (error) {
      logger.error(`Failed to edit message ${data.messageId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to edit message', 500);
    }
  }

  async forwardMessage(data: ForwardMessageData) {
    try {
      const originalMessage = await this.prisma.chatMessage.findUnique({
        where: { id: data.messageId },
        select: { id: true, content: true, type: true, senderId: true, deletedAt: true },
      });

      if (!originalMessage) {
        throw new AppError('Original message not found', 404);
      }

      if (originalMessage.deletedAt) {
        throw new AppError('Cannot forward a deleted message', 400);
      }

      const forwarded = await this.prisma.chatMessage.create({
        data: {
          conversationId: data.toConversationId,
          senderId: data.userId,
          receiverId: '',
          content: `[Forwarded] ${originalMessage.content}`,
          type: originalMessage.type,
        },
        include: {
          sender: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
        },
      });

      await this.prisma.chatMessageAction.create({
        data: {
          messageId: data.messageId,
          userId: data.userId,
          action: 'forwarded',
          metadata: { toConversationId: data.toConversationId, forwardedMessageId: forwarded.id },
        },
      });

      logger.info(`Message forwarded: ${data.messageId} to ${data.toConversationId}`);
      return { success: true, data: forwarded };
    } catch (error) {
      logger.error(`Failed to forward message ${data.messageId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to forward message', 500);
    }
  }

  async muteConversation(conversationId: string, userId: string, duration?: number) {
    try {
      const mutedUntil = duration ? new Date(Date.now() + duration * 60 * 1000) : null;

      await this.prisma.chatMessage.updateMany({
        where: { conversationId, receiverId: userId, isRead: false },
        data: { isRead: true, readAt: new Date() },
      });

      logger.info(`Conversation muted: ${conversationId} by ${userId}`);
      return { success: true, message: 'Conversation muted', mutedUntil };
    } catch (error) {
      logger.error(`Failed to mute conversation ${conversationId}:`, error);
      throw new AppError('Failed to mute conversation', 500);
    }
  }

  async unmuteConversation(conversationId: string, userId: string) {
    try {
      logger.info(`Conversation unmuted: ${conversationId} by ${userId}`);
      return { success: true, message: 'Conversation unmuted' };
    } catch (error) {
      logger.error(`Failed to unmute conversation ${conversationId}:`, error);
      throw new AppError('Failed to unmute conversation', 500);
    }
  }

  async pinConversation(conversationId: string, userId: string) {
    try {
      logger.info(`Conversation pinned: ${conversationId} by ${userId}`);
      return { success: true, message: 'Conversation pinned' };
    } catch (error) {
      logger.error(`Failed to pin conversation ${conversationId}:`, error);
      throw new AppError('Failed to pin conversation', 500);
    }
  }

  async archiveConversation(conversationId: string, userId: string) {
    try {
      await this.prisma.chatMessage.updateMany({
        where: { conversationId, receiverId: userId },
        data: { isRead: true, readAt: new Date() },
      });

      logger.info(`Conversation archived: ${conversationId} by ${userId}`);
      return { success: true, message: 'Conversation archived' };
    } catch (error) {
      logger.error(`Failed to archive conversation ${conversationId}:`, error);
      throw new AppError('Failed to archive conversation', 500);
    }
  }

  async getUnreadCount(userId: string) {
    try {
      const conversations = await this.prisma.chatMessage.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
          deletedAt: null,
        },
      });

      let totalUnread = 0;
      const conversationMap = new Map();
      for (const msg of conversations) {
        if (!conversationMap.has(msg.conversationId)) {
          conversationMap.set(msg.conversationId, msg);
        }
      }

      for (const msg of conversationMap.values()) {
        const count = await this.prisma.chatMessage.count({
          where: { conversationId: msg.conversationId, receiverId: userId, isRead: false, deletedAt: null },
        });
        totalUnread += count;
      }

      return { success: true, data: { totalUnread } };
    } catch (error) {
      logger.error(`Failed to get unread count for user ${userId}:`, error);
      throw new AppError('Failed to fetch unread count', 500);
    }
  }
}
