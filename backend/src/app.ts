import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { logger } from './config/logger.config';
import { errorHandler } from './middleware/errorHandler.middleware';
import { rateLimiter } from './middleware/rateLimiter.middleware';
import { loggerMiddleware } from './middleware/logger.middleware';

import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import propertyRoutes from './routes/property.routes';
import paymentRoutes from './routes/payment.routes';
import escrowRoutes from './routes/escrow.routes';
import qrRoutes from './routes/qr.routes';
import bannerRoutes from './routes/banner.routes';
import campaignRoutes from './routes/campaign.routes';
import disputesRoutes from './routes/disputes.routes';
import notificationRoutes from './routes/notification.routes';
import chatRoutes from './routes/chat.routes';
import safetyRoutes from './routes/safety.routes';
import communityRoutes from './routes/community.routes';
import analyticsRoutes from './routes/analytics.routes';
import adminRoutes from './routes/admin.routes';
import searchRoutes from './routes/search.routes';
import referralRoutes from './routes/referral.routes';
import maintenanceRoutes from './routes/maintenance.routes';
import reviewRoutes from './routes/review.routes';
import roommateRoutes from './routes/roommate.routes';
import webhooksRoutes from './routes/webhooks.routes';
import geocodingRoutes from './routes/geocoding.routes';
import idVerificationRoutes from './routes/idVerification.routes';
import fraudDetectionRoutes from './routes/fraudDetection.routes';
import exportRoutes from './routes/export.routes';
import aiRoutes from './routes/ai.routes';
import pushRoutes from './routes/push.routes';
import weatherRoutes from './routes/weather.routes';
import leaseRoutes from './routes/lease.routes';

import { initializeAllSockets } from './sockets';
import { initializeWorker } from './workers/index.worker';
import { startBackgroundJobs } from './jobs/background.jobs';
import { validateEnv } from './config/env.config';

validateEnv();
dotenv.config();

const app = express();
const server = createServer(app);

const apiVersion = process.env['API_VERSION'] || 'v1';

app.use(helmet());
app.use(cors({
  origin: [process.env['FRONTEND_URL'] || 'http://localhost:3001', 'http://localhost:3000'],
  credentials: true,
}));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: process.env['BODY_LIMIT'] || '10mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env['BODY_LIMIT'] || '10mb' }));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(loggerMiddleware);
app.use(rateLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(`/api/${apiVersion}/auth`, authRoutes);
app.use(`/api/${apiVersion}/users`, usersRoutes);
app.use(`/api/${apiVersion}/properties`, propertyRoutes);
app.use(`/api/${apiVersion}/payments`, paymentRoutes);
app.use(`/api/${apiVersion}/escrow`, escrowRoutes);
app.use(`/api/${apiVersion}/qr`, qrRoutes);
app.use(`/api/${apiVersion}/banners`, bannerRoutes);
app.use(`/api/${apiVersion}/campaigns`, campaignRoutes);
app.use(`/api/${apiVersion}/disputes`, disputesRoutes);
app.use(`/api/${apiVersion}/notifications`, notificationRoutes);
app.use(`/api/${apiVersion}/chat`, chatRoutes);
app.use(`/api/${apiVersion}/safety`, safetyRoutes);
app.use(`/api/${apiVersion}/community`, communityRoutes);
app.use(`/api/${apiVersion}/analytics`, analyticsRoutes);
app.use(`/api/${apiVersion}/admin`, adminRoutes);
app.use(`/api/${apiVersion}/search`, searchRoutes);
app.use(`/api/${apiVersion}/referral`, referralRoutes);
app.use(`/api/${apiVersion}/maintenance`, maintenanceRoutes);
app.use(`/api/${apiVersion}/review`, reviewRoutes);
app.use(`/api/${apiVersion}/roommate`, roommateRoutes);
app.use(`/api/${apiVersion}/webhooks`, webhooksRoutes);
app.use(`/api/${apiVersion}/geocoding`, geocodingRoutes);
app.use(`/api/${apiVersion}/verifications`, idVerificationRoutes);
app.use(`/api/${apiVersion}/fraud`, fraudDetectionRoutes);
app.use(`/api/${apiVersion}/export`, exportRoutes);
app.use(`/api/${apiVersion}/ai`, aiRoutes);
app.use(`/api/${apiVersion}/push`, pushRoutes);
app.use(`/api/${apiVersion}/weather`, weatherRoutes);
app.use(`/api/${apiVersion}/leases`, leaseRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    timestamp: new Date().toISOString(),
    path: req.path,
  });
});

app.use(errorHandler);

const io = new Server(server, {
  cors: {
    origin: [process.env['SOCKET_CORS_ORIGIN'] || 'http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
  },
  path: process.env['SOCKET_PATH'] || '/socket.io',
});

initializeAllSockets(io);

if (process.env['NODE_ENV'] !== 'test') {
  startBackgroundJobs();
  initializeWorker();

  const PORT = Number(process.env['PORT']) || 3000;
  const HOST = process.env['HOST'] || '0.0.0.0';

  server.listen(PORT, HOST, () => {
    logger.info(`Server running on http://${HOST}:${PORT} in ${process.env['NODE_ENV']} mode`);
  });
}

export { app, server, io };
