import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { LocationService } from '../services/location.service';

const prisma = new PrismaClient();
const locationService = new LocationService(prisma);

export class LocationController {
  private locationService: LocationService;

  constructor(prisma?: PrismaClient, locationService?: LocationService) {
    this.locationService = locationService || new LocationService(prisma as PrismaClient);
  }

  setPropertyFuzz = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { exactLat, exactLng, fuzzRadius } = req.body;
      const result = await this.locationService.setPropertyLocationFuzz(req.params.propertyId as string, exactLat, exactLng, fuzzRadius);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getPropertyLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isBookingConfirmed = (req as any).user?.role === 'LANDLORD' || (req as any).user?.role === 'ADMIN';
      const result = await this.locationService.getPropertyLocation(req.params.propertyId as string, isBookingConfirmed);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  setUserLocationPreference = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.locationService.setUserLocationFuzzPreference(userId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getUserLocationPreference = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.locationService.getUserLocationFuzzPreference(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
