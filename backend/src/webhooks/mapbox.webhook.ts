import { Request, Response } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import axios from 'axios';
import { searchConfig } from '../config/search.config';

export class MapboxWebhookHandler {
  async handleGeocodingCallback(req: Request, res: Response) {
    try {
      const { data } = req.body;

      logger.info(`Mapbox geocoding callback received: ${data.features?.length || 0} results`);

      res.status(200).json({ success: true });
    } catch (error) {
      logger.error('Mapbox geocoding callback failed:', error);
      res.status(400).json({ success: false });
    }
  }

  async handleDirectionsCallback(req: Request, res: Response) {
    try {
      const { data } = req.body;

      logger.info(`Mapbox directions callback received: ${data.routes?.length || 0} routes`);

      res.status(200).json({ success: true });
    } catch (error) {
      logger.error('Mapbox directions callback failed:', error);
      res.status(400).json({ success: false });
    }
  }

  async handleMatrixCallback(req: Request, res: Response) {
    try {
      const { data } = req.body;

      logger.info(`Mapbox matrix callback received`);

      res.status(200).json({ success: true });
    } catch (error) {
      logger.error('Mapbox matrix callback failed:', error);
      res.status(400).json({ success: false });
    }
  }
}
