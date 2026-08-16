import { Request, Response, NextFunction } from 'express';
import { body, query } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validation.middleware';
import { GeocodingController } from '../controllers/geocoding.controller';

const geocodingService = new (require('../services/geocoding.service').GeocodingService)();
const controller = new GeocodingController(geocodingService);

const router = require('express').Router();

router.post('/geocode', authenticate, validateBody([
  body('address').notEmpty().withMessage('Address is required'),
]), controller.geocode);

router.post('/reverse-geocode', authenticate, validateBody([
  body('latitude').isFloat().withMessage('Valid latitude is required'),
  body('longitude').isFloat().withMessage('Valid longitude is required'),
]), controller.reverseGeocode);

export default router;
