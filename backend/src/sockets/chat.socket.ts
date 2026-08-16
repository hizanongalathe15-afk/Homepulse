import { Server } from 'socket.io';
import { logger } from '../config/logger.config';
import { authenticateSocket } from '../middleware/socket.auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const initializeChatSocket = (io: Server) => {
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    const userId = socket.data.user?.id;
    logger.info(`Chat socket connected: ${socket.id} for user ${userId}`);

    socket.on('join_chat', (data: { conversationId: string }) => {
      socket.join(`chat:${data.conversationId}`);
      logger.info(`User ${userId} joined chat ${data.conversationId}`);
    });

    socket.on('leave_chat', (data: { conversationId: string }) => {
      socket.leave(`chat:${data.conversationId}`);
      logger.info(`User ${userId} left chat ${data.conversationId}`);
    });

    socket.on('send_message', async (data: { conversationId: string; receiverId: string; content: string; type?: string; mediaUrl?: string }) => {
      try {
        const message = await prisma.chatMessage.create({
          data: {
            conversationId: data.conversationId,
            senderId: userId!,
            receiverId: data.receiverId,
            content: data.content,
            type: data.type || 'TEXT' as any,
            mediaUrl: data.mediaUrl,
          },
          include: {
            sender: { select: { firstName: true, lastName: true, profileImage: true } },
            receiver: { select: { firstName: true, lastName: true, profileImage: true } },
          },
        });

        io.to(`chat:${data.conversationId}`).emit('new_message', message);
        io.to(`user:${data.receiverId}`).emit('message_notification', { conversationId: data.conversationId, message });
      } catch (error) {
        logger.error('Chat socket send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Chat socket disconnected: ${socket.id}`);
    });
  });
};
