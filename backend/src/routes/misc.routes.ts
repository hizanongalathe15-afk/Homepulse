import { Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateParams } from '../middleware/validation.middleware';
import { GeocodingController } from '../controllers/geocoding.controller';
import { IdVerificationController } from '../controllers/idVerification.controller';
import { FraudDetectionController } from '../controllers/fraudDetection.controller';
import { ExportController } from '../controllers/export.controller';
import { AiController } from '../controllers/ai.controller';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);

const geocodingService = new (require('../services/geocoding.service').GeocodingService)();
const geocodingController = new GeocodingController(geocodingService);

const idVerificationService = new (require('../services/idVerification.service').IdVerificationService)(prisma, notificationService);
const idVerificationController = new IdVerificationController(idVerificationService);

const fraudService = new (require('../services/fraudDetection.service').FraudDetectionService)(prisma, notificationService);
const fraudController = new FraudDetectionController(fraudService);

const exportService = new (require('../services/export.service').ExportService)(prisma, notificationService);
const exportController = new ExportController(exportService);

const aiService = new (require('../services/ai.service').AiService)(prisma, notificationService);
const aiController = new AiController(aiService);

const router = require('express').Router();

router.use('/geocoding', geocodingController);
router.use('/verification', idVerificationController);
router.use('/fraud', fraudController);
router.use('/export', exportController);
router.use('/ai', aiController);

export default router;
