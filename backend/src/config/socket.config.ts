import { logger } from './logger.config';

export const socketConfig = {
  corsOrigin: process.env['SOCKET_CORS_ORIGIN'] || 'http://localhost:3001',
  path: process.env['SOCKET_PATH'] || '/socket.io',
  transports: process.env['SOCKET_TRANSPORTS']?.split(',') || ['websocket', 'polling'],
  pingTimeout: Number(process.env['SOCKET_PING_TIMEOUT']) || 60000,
  pingInterval: Number(process.env['SOCKET_PING_INTERVAL']) || 25000,
};

logger.info(`Socket config loaded: transports=${socketConfig.transports.join(',')}`);
