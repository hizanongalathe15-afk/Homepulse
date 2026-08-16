import { Request, Response, NextFunction } from 'express';
import { body, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validation.middleware';
import { GeocodingService } from '../services/geocoding.service';

const geocodingService = new GeocodingService();

export class GeocodingController {
  private geocodingService: GeocodingService;

  constructor(geocodingService?: GeocodingService) {
    this.geocodingService = geocodingService || new GeocodingService();
  }

  geocode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.geocodingService.geocode(req.body.address);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  reverseGeocode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.geocodingService.reverseGeocode(req.body.latitude, req.body.longitude);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
