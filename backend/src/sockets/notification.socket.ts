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

export const initializeNotificationSocket = (io: Server) => {
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    const userId = socket.data.user?.id;
    logger.info(`Notification socket connected: ${socket.id} for user ${userId}`);

    socket.join(`user:${userId}`);

    socket.on('mark_notification_read', async (data: { notificationId: string }) => {
      try {
        await prisma.notification.update({
          where: { id: data.notificationId },
          data: { isRead: true, readAt: new Date() },
        });

        socket.emit('notification_marked_read', { notificationId: data.notificationId });
      } catch (error) {
        logger.error('Socket mark notification read error:', error);
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Notification socket disconnected: ${socket.id}`);
    });
  });
};
