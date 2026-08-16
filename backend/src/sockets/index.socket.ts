import { Server } from 'socket.io';
import { logger } from '../config/logger.config';
import { authenticateSocket } from '../middleware/auth.middleware';
import { NotificationService } from '../services/notification.service';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);

export const initializeSocket = (io: Server) => {
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    const userId = socket.data.user?.id;
    logger.info(`Socket connected: ${socket.id} for user ${userId}`);

    socket.join(`user:${userId}`);

    socket.on('send_message', async (data: { conversationId: string; receiverId: string; content: string; type?: string }) => {
      try {
        const message = await prisma.chatMessage.create({
          data: {
            conversationId: data.conversationId,
            senderId: userId!,
            receiverId: data.receiverId,
            content: data.content,
            type: (data.type || 'TEXT') as any,
          },
          include: {
            sender: { select: { firstName: true, lastName: true, profileImage: true } },
            receiver: { select: { firstName: true, lastName: true } },
          },
        });

        socket.to(`user:${data.receiverId}`).emit('new_message', message);
        socket.emit('message_sent', message);
      } catch (error) {
        logger.error('Socket send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('typing_start', (data: { conversationId: string; receiverId: string }) => {
      socket.to(`user:${data.receiverId}`).emit('user_typing', {
        conversationId: data.conversationId,
        userId,
      });
    });

    socket.on('typing_stop', (data: { conversationId: string; receiverId: string }) => {
      socket.to(`user:${data.receiverId}`).emit('user_stopped_typing', {
        conversationId: data.conversationId,
        userId,
      });
    });

    socket.on('mark_read', async (data: { conversationId: string }) => {
      try {
        await prisma.chatMessage.updateMany({
          where: { conversationId: data.conversationId, receiverId: userId!, isRead: false },
          data: { isRead: true, readAt: new Date() },
        });

        socket.emit('messages_marked_read', { conversationId: data.conversationId });
      } catch (error) {
        logger.error('Socket mark read error:', error);
      }
    });

    socket.on('join_conversation', (data: { conversationId: string }) => {
      socket.join(`conversation:${data.conversationId}`);
      logger.info(`User ${userId} joined conversation ${data.conversationId}`);
    });

    socket.on('leave_conversation', (data: { conversationId: string }) => {
      socket.leave(`conversation:${data.conversationId}`);
      logger.info(`User ${userId} left conversation ${data.conversationId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id} for user ${userId}`);
    });
  });
};
