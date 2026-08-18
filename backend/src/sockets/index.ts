import { Server } from 'socket.io';
import { initializeSocket } from './index.socket';
import { initializeNotificationSocket } from './notification.socket';
import { initializeLocationSocket } from './location.socket';
import { initializeQRSocket } from './qr.socket';
import { initializeSOSSocket } from './sos.socket';
import { initializeChatSocket } from './chat.socket';
import { initializeThemeSocket } from './theme.socket';
import { logger } from '../config/logger.config';

export const initializeAllSockets = (io: Server) => {
  try {
    initializeSocket(io);
    initializeNotificationSocket(io);
    initializeLocationSocket(io);
    initializeQRSocket(io);
    initializeSOSSocket(io);
    initializeChatSocket(io);
    initializeThemeSocket(io);

    logger.info('All socket handlers initialized');
  } catch (error) {
    logger.error('Failed to initialize socket handlers:', error);
  }
};
