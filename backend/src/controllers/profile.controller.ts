import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProfileService } from '../services/profile.service';
import { PrivacyService } from '../services/privacy.service';
import { OfflineService } from '../services/offline.service';
import { NetworkService } from '../services/network.service';
import { ProfileCardService } from '../services/profile-card.service';
import { LocationService } from '../services/location.service';
import { NotificationService } from '../services/notification.service';
import { AppError } from '../utils/errors';

export class ProfileController {
  private profileService: ProfileService;
  private privacyService: PrivacyService;
  private offlineService: OfflineService;
  private networkService: NetworkService;
  private profileCardService: ProfileCardService;
  private locationService: LocationService;
  private notificationService: NotificationService;
  private prisma: PrismaClient;

  constructor(
    prisma: PrismaClient,
    profileService: ProfileService,
    privacyService: PrivacyService,
    offlineService: OfflineService,
    networkService: NetworkService,
    profileCardService: ProfileCardService,
    locationService: LocationService,
    notificationService: NotificationService,
  ) {
    this.prisma = prisma;
    this.profileService = profileService;
    this.privacyService = privacyService;
    this.offlineService = offlineService;
    this.networkService = networkService;
    this.profileCardService = profileCardService;
    this.locationService = locationService;
    this.notificationService = notificationService;
  }

  uploadProfileVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.profileService.uploadProfileVideo(userId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getProfileVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.profileService.getProfileVideo(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteProfileVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      await this.profileService.deleteProfileVideo(userId);
      res.status(200).json({ success: true, message: 'Profile video deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  uploadProfileMusic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.profileService.uploadProfileMusic(userId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getProfileMusic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.profileService.getProfileMusic(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteProfileMusic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      await this.profileService.deleteProfileMusic(userId);
      res.status(200).json({ success: true, message: 'Profile music deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  generateProfileCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true, email: true, profileImage: true, bio: true },
      });
      if (!user) throw new AppError('User not found', 404);
      const result = await this.profileCardService.generateProfileCard(userId, user as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getProfileCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.profileCardService.getProfileCard(req.params.userId as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const targetUserId = req.params.userId as string;
      const privacy = await this.privacyService.getPrivacySettings(targetUserId);
      const result = await (this.profileService as any).getUserProfile(targetUserId, privacy);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
