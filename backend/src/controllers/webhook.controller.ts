import { Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { validateBody, validateParams } from '../middleware/validation.middleware';
import { StripeWebhookHandler } from '../webhooks/stripe.webhook';
import { MpesaWebhookHandler } from '../webhooks/mpesa.webhook';
import { MapboxWebhookHandler } from '../webhooks/mapbox.webhook';

const stripeWebhookHandler = new StripeWebhookHandler();
const mpesaWebhookHandler = new MpesaWebhookHandler();
const mapboxWebhookHandler = new MapboxWebhookHandler();

export class WebhookController {
  private stripeWebhookHandler: StripeWebhookHandler;
  private mpesaWebhookHandler: MpesaWebhookHandler;
  private mapboxWebhookHandler: MapboxWebhookHandler;

  constructor() {
    this.stripeWebhookHandler = stripeWebhookHandler;
    this.mpesaWebhookHandler = mpesaWebhookHandler;
    this.mapboxWebhookHandler = mapboxWebhookHandler;
  }

  handleStripeWebhook = (req: Request, res: Response, next: NextFunction) => {
    this.stripeWebhookHandler.handleWebhook(req, res).catch(next);
  };

  handleMpesaSTKCallback = (req: Request, res: Response, next: NextFunction) => {
    this.mpesaWebhookHandler.handleSTKCallback(req, res).catch(next);
  };

  handleMpesaTimeout = (req: Request, res: Response, next: NextFunction) => {
    this.mpesaWebhookHandler.handleTimeout(req, res).catch(next);
  };

  handleMpesaC2BValidation = (req: Request, res: Response, next: NextFunction) => {
    this.mpesaWebhookHandler.handleC2BValidation(req, res).catch(next);
  };

  handleMpesaC2BConfirmation = (req: Request, res: Response, next: NextFunction) => {
    this.mpesaWebhookHandler.handleC2BConfirmation(req, res).catch(next);
  };

  handleMapboxGeocoding = (req: Request, res: Response, next: NextFunction) => {
    this.mapboxWebhookHandler.handleGeocodingCallback(req, res).catch(next);
  };

  handleMapboxDirections = (req: Request, res: Response, next: NextFunction) => {
    this.mapboxWebhookHandler.handleDirectionsCallback(req, res).catch(next);
  };

  handleMapboxMatrix = (req: Request, res: Response, next: NextFunction) => {
    this.mapboxWebhookHandler.handleMatrixCallback(req, res).catch(next);
  };
}
