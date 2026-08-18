import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';

export class LocationService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async setPropertyLocationFuzz(propertyId: string, exactLat: number, exactLng: number, fuzzRadius: number = 500) {
    try {
      const approximateLat = exactLat + (Math.random() - 0.5) * (fuzzRadius / 111300);
      const approximateLng = exactLng + (Math.random() - 0.5) * (fuzzRadius / (111300 * Math.cos(exactLat * Math.PI / 180)));
      
      const fuzz = await this.prisma.propertyLocationFuzz.upsert({
        where: { propertyId },
        update: { exactLat, exactLng, approximateLat, approximateLng, fuzzRadius },
        create: { propertyId, exactLat, exactLng, approximateLat, approximateLng, fuzzRadius },
      });
      return fuzz;
    } catch (error) {
      logger.error('Failed to set property location fuzz:', error);
      throw new AppError('Failed to set property location fuzz', 500);
    }
  }

  async getPropertyLocation(propertyId: string, isBookingConfirmed: boolean = false) {
    try {
      const fuzz = await this.prisma.propertyLocationFuzz.findUnique({
        where: { propertyId },
      });
      if (!fuzz) return null;
      
      if (isBookingConfirmed || !fuzz.showExactAfterBooking) {
        return { lat: fuzz.exactLat, lng: fuzz.exactLng, isExact: true };
      }
      return { lat: fuzz.approximateLat, lng: fuzz.approximateLng, isExact: false, radius: fuzz.fuzzRadius };
    } catch (error) {
      logger.error('Failed to get property location:', error);
      throw new AppError('Failed to get property location', 500);
    }
  }

  async setUserLocationFuzzPreference(userId: string, data: { enableFuzzing?: boolean; fuzzRadius?: number; showExactAfterViewing?: boolean }) {
    try {
      const preference = await this.prisma.locationFuzzPreference.upsert({
        where: { userId },
        update: data as any,
        create: { userId, ...(data as any) },
      });
      return preference;
    } catch (error) {
      logger.error('Failed to set location fuzz preference:', error);
      throw new AppError('Failed to set location fuzz preference', 500);
    }
  }

  async getUserLocationFuzzPreference(userId: string) {
    try {
      let preference = await this.prisma.locationFuzzPreference.findUnique({
        where: { userId },
      });
      if (!preference) {
        preference = await this.prisma.locationFuzzPreference.create({
          data: { userId },
        });
      }
      return preference;
    } catch (error) {
      logger.error('Failed to get location fuzz preference:', error);
      throw new AppError('Failed to get location fuzz preference', 500);
    }
  }
}
