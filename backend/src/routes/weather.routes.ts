import { Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateQuery } from '../middleware/validation.middleware';
import { WeatherController } from '../controllers/weather.controller';

const weatherService = new (require('../services/weather.service').WeatherService)();
const controller = new WeatherController(weatherService);

const router = require('express').Router();

router.get('/current', authenticate, validateQuery([
  query('latitude').isFloat().withMessage('Valid latitude is required'),
  query('longitude').isFloat().withMessage('Valid longitude is required'),
]), controller.getCurrentWeather);

router.get('/forecast', authenticate, validateQuery([
  query('latitude').isFloat().withMessage('Valid latitude is required'),
  query('longitude').isFloat().withMessage('Valid longitude is required'),
  query('days').optional().isInt({ min: 1, max: 7 }),
]), controller.getWeatherForecast);

router.get('/alerts', authenticate, validateQuery([
  query('latitude').isFloat().withMessage('Valid latitude is required'),
  query('longitude').isFloat().withMessage('Valid longitude is required'),
]), controller.getWeatherAlerts);

export default router;
