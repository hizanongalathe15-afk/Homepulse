import { Server } from 'socket.io';
import { logger } from '../config/logger.config';
import { authenticateSocket } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const initializeQRSocket = (io: Server) => {
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    const userId = socket.data.user?.id;
    logger.info(`QR socket connected: ${socket.id} for user ${userId}`);

    socket.on('scan_qr', async (data: { code: string }) => {
      try {
        const qrCode = await prisma.qRCode.findFirst({
          where: { code: data.code, status: 'ACTIVE' },
          include: { property: true },
        });

        if (!qrCode) {
          socket.emit('qr_scan_result', { success: false, message: 'Invalid QR code' });
          return;
        }

        if (new Date() > qrCode.expiresAt) {
          await prisma.qRCode.update({ where: { id: qrCode.id }, data: { status: 'EXPIRED' } });
          socket.emit('qr_scan_result', { success: false, message: 'QR code expired' });
          return;
        }

        if (qrCode.scans >= qrCode.maxScans) {
          await prisma.qRCode.update({ where: { id: qrCode.id }, data: { status: 'EXHAUSTED' } });
          socket.emit('qr_scan_result', { success: false, message: 'QR code exhausted' });
          return;
        }

        await prisma.qRCode.update({ where: { id: qrCode.id }, data: { scans: { increment: 1 } } });

        socket.emit('qr_scan_result', { success: true, property: qrCode.property });
      } catch (error) {
        logger.error('Socket QR scan error:', error);
        socket.emit('qr_scan_result', { success: false, message: 'Failed to scan QR code' });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`QR socket disconnected: ${socket.id}`);
    });
  });
};
