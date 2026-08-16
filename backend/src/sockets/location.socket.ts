import { Server } from 'socket.io';
import { logger } from '../config/logger.config';
import { authenticateSocket } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const initializeLocationSocket = (io: Server) => {
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    const userId = socket.data.user?.id;
    logger.info(`Location socket connected: ${socket.id} for user ${userId}`);

    socket.on('update_location', async (data: { latitude: number; longitude: number }) => {
      try {
        socket.to('ADMIN').emit('user_location_updated', {
          userId,
          latitude: data.latitude,
          longitude: data.longitude,
        });
      } catch (error) {
        logger.error('Socket update location error:', error);
      }
    });

    socket.on('sos_alert', async (data: { type: string; location?: string; latitude?: number; longitude?: number; message?: string }) => {
      try {
        const alert = await prisma.sOSAlert.create({
          data: {
            userId: userId!,
            type: data.type as any,
            location: data.location,
            latitude: data.latitude,
            longitude: data.longitude,
            message: data.message,
            status: 'ACTIVE',
          },
        });

        io.to('ADMIN').emit('new_sos_alert', alert);
        socket.emit('sos_alert_created', alert);
      } catch (error) {
        logger.error('Socket SOS alert error:', error);
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Location socket disconnected: ${socket.id}`);
    });
  });
};
