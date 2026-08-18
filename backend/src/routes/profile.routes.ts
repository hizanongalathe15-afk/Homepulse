import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { ProfileController } from '../controllers/profile.controller';
import { PrivacyController } from '../controllers/privacy.controller';
import { OfflineController } from '../controllers/offline.controller';
import { DataPortabilityController } from '../controllers/data-portability.controller';
import { LocationController } from '../controllers/location.controller';
import { NetworkController } from '../controllers/network.controller';
import { AppIconController } from '../controllers/app-icon.controller';
import { PrismaClient } from '@prisma/client';
import { ProfileService } from '../services/profile.service';
import { PrivacyService } from '../services/privacy.service';
import { OfflineService } from '../services/offline.service';
import { NetworkService } from '../services/network.service';
import { ProfileCardService } from '../services/profile-card.service';
import { LocationService } from '../services/location.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';
import { NotificationService } from '../services/notification.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const profileService = new ProfileService(prisma);
const privacyService = new PrivacyService(prisma);
const offlineService = new OfflineService(prisma);
const networkService = new NetworkService(prisma);
const profileCardService = new ProfileCardService(prisma);
const locationService = new LocationService(prisma);

const profileController = new ProfileController(prisma, profileService, privacyService, offlineService, networkService, profileCardService, locationService, notificationService);
const privacyController = new PrivacyController(prisma, privacyService);
const offlineController = new OfflineController(prisma, offlineService);
const dataController = new DataPortabilityController(prisma, notificationService, emailService, smsService);
const locationController = new LocationController(prisma, locationService);
const networkController = new NetworkController(prisma, networkService);
const appIconController = new AppIconController(prisma, notificationService);

const router = Router();

router.use(authenticate);

router.post('/video', validateBody([
  body('url').isString().withMessage('Video URL is required'),
  body('thumbnailUrl').optional().isString(),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('fileSize').isInt({ min: 1 }).withMessage('File size must be a positive integer'),
]), profileController.uploadProfileVideo);

router.get('/video', profileController.getProfileVideo);

router.delete('/video', profileController.deleteProfileVideo);

router.post('/music', validateBody([
  body('title').isString().withMessage('Music title is required'),
  body('artist').optional().isString(),
  body('url').isString().withMessage('Music URL is required'),
  body('duration').optional().isInt(),
  body('coverUrl').optional().isString(),
]), profileController.uploadProfileMusic);

router.get('/music', profileController.getProfileMusic);

router.delete('/music', profileController.deleteProfileMusic);

router.post('/card', profileController.generateProfileCard);

router.get('/card/:userId', validateParams([
  param('userId').isString(),
]), profileController.getProfileCard);

router.get('/:userId', validateParams([
  param('userId').isString(),
]), profileController.getUserProfile);

router.get('/privacy', privacyController.getPrivacySettings);

router.put('/privacy', validateBody([
  body('shareEmail').optional().isBoolean(),
  body('sharePhone').optional().isBoolean(),
  body('shareLocation').optional().isBoolean(),
  body('shareOnlineStatus').optional().isBoolean(),
  body('shareLastSeen').optional().isBoolean(),
  body('sharePaymentHistory').optional().isBoolean(),
  body('shareEmployment').optional().isBoolean(),
  body('shareProfileVideo').optional().isBoolean(),
  body('shareProfileMusic').optional().isBoolean(),
  body('allowDirectMessages').optional().isBoolean(),
  body('allowFollowRequests').optional().isBoolean(),
  body('showActivityStatus').optional().isBoolean(),
]), privacyController.updatePrivacySettings);

router.post('/offline/cache', validateBody([
  body('entityType').isString().withMessage('Entity type is required'),
  body('entityId').optional().isString(),
  body('data').isObject().withMessage('Data object is required'),
  body('ttlHours').optional().isInt(),
]), offlineController.cacheData);

router.get('/offline/cache/:entityType', offlineController.getCachedData);

router.post('/offline/sync', validateBody([
  body('entityType').isString().withMessage('Entity type is required'),
  body('data').isObject().withMessage('Data object is required'),
]), offlineController.syncData);

router.post('/data/export', validateBody([
  body('format').optional().isString(),
]), dataController.requestExport);

router.get('/data/export/status', dataController.getExportStatus);

router.post('/data/delete', validateBody([
  body('reason').optional().isString(),
]), dataController.requestDeletion);

router.get('/data/delete/status', dataController.getDeleteStatus);

router.post('/data/delete/cancel', validateBody([
  body('requestId').isString().withMessage('Request ID is required'),
]), dataController.cancelDeletion);

router.put('/location/property/:propertyId', validateParams([
  param('propertyId').isString(),
]), validateBody([
  body('exactLat').isFloat().withMessage('exactLat is required'),
  body('exactLng').isFloat().withMessage('exactLng is required'),
  body('fuzzRadius').optional().isInt(),
]), locationController.setPropertyFuzz);

router.get('/location/property/:propertyId', validateParams([
  param('propertyId').isString(),
]), locationController.getPropertyLocation);

router.put('/location/preferences', validateBody([
  body('enableFuzzing').optional().isBoolean(),
  body('fuzzRadius').optional().isInt(),
  body('showExactAfterViewing').optional().isBoolean(),
]), locationController.setUserLocationPreference);

router.get('/location/preferences', locationController.getUserLocationPreference);

router.post('/network/speed', validateBody([
  body('downloadSpeed').isFloat().withMessage('Download speed is required'),
  body('uploadSpeed').isFloat().withMessage('Upload speed is required'),
  body('latency').isInt().withMessage('Latency is required'),
  body('connectionType').isString().withMessage('Connection type is required'),
  body('userAgent').isString().withMessage('User agent is required'),
  body('ipAddress').optional().isString(),
]), networkController.logNetworkSpeed);

router.get('/network/status', networkController.getNetworkStatus);

router.put('/app-icon/state', validateBody([
  body('state').isString().withMessage('State is required'),
  body('iconUrl').optional().isString(),
  body('badgeCount').optional().isInt(),
  body('isActive').optional().isBoolean(),
]), appIconController.setAppIconState);

router.get('/app-icon/state', appIconController.getAppIconState);

export default router;
