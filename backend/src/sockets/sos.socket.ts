import { Server } from 'socket.io';
import { logger } from '../config/logger.config';
import { authenticateSocket } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const initializeSOSSocket = (io: Server) => {
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    const userId = socket.data.user?.id;
    logger.info(`SOS socket connected: ${socket.id} for user ${userId}`);

    socket.on('create_sos', async (data: { type: string; location?: string; latitude?: number; longitude?: number; message?: string }) => {
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
        logger.error('Socket SOS create error:', error);
        socket.emit('error', { message: 'Failed to create SOS alert' });
      }
    });

    socket.on('cancel_sos', async (data: { alertId: string }) => {
      try {
        await prisma.sOSAlert.update({
          where: { id: data.alertId },
          data: { status: 'CANCELLED' },
        });

        io.to('ADMIN').emit('sos_alert_cancelled', { alertId: data.alertId });
        socket.emit('sos_alert_cancelled', { alertId: data.alertId });
      } catch (error) {
        logger.error('Socket SOS cancel error:', error);
      }
    });

    socket.on('disconnect', () => {
      logger.info(`SOS socket disconnected: ${socket.id}`);
    });
  });
};
