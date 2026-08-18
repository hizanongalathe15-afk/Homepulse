import { Server } from 'socket.io';
import { logger } from '../config/logger.config';

export const initializeThemeSocket = (io: Server) => {
  io.on('connection', (socket) => {
    const userId = socket.data?.user?.id;

    logger.info(`Theme socket connected: ${socket.id} for user ${userId}`);

    socket.on('theme:subscribe', () => {
      socket.join('theme:subscribers');
      logger.info(`User ${userId} subscribed to theme updates`);
    });

    socket.on('theme:unsubscribe', () => {
      socket.leave('theme:subscribers');
    });

    socket.on('disconnect', () => {
      logger.info(`Theme socket disconnected: ${socket.id}`);
    });
  });

  logger.info('Theme socket handler initialized');
};
