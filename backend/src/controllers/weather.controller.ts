import { Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateQuery } from '../middleware/validation.middleware';
import { AppError } from '../utils/errors';
import { WeatherService } from '../services/weather.service';

const weatherService = new WeatherService();

export class WeatherController {
  private weatherService: WeatherService;

  constructor(weatherService?: WeatherService) {
    this.weatherService = weatherService || new WeatherService();
  }

  getCurrentWeather = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { latitude, longitude } = req.query;
      if (!latitude || !longitude) {
        throw new AppError('Latitude and longitude are required', 400);
      }
      const result = await this.weatherService.getCurrentWeather(Number(latitude), Number(longitude));
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getWeatherForecast = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { latitude, longitude, days } = req.query;
      if (!latitude || !longitude) {
        throw new AppError('Latitude and longitude are required', 400);
      }
      const result = await this.weatherService.getWeatherForecast(Number(latitude), Number(longitude), Number(days) || 5);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getWeatherAlerts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { latitude, longitude } = req.query;
      if (!latitude || !longitude) {
        throw new AppError('Latitude and longitude are required', 400);
      }
      const result = await this.weatherService.getWeatherAlerts(Number(latitude), Number(longitude));
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
