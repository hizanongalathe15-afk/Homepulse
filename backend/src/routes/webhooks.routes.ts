import express from 'express';
import { WebhookController } from '../controllers/webhook.controller';

const controller = new WebhookController();

const router = express.Router();

router.post('/stripe', express.raw({ type: 'application/json' }), controller.handleStripeWebhook);

router.post('/mpesa/stk/callback', controller.handleMpesaSTKCallback);

router.post('/mpesa/stk/timeout', controller.handleMpesaTimeout);

router.post('/mpesa/c2b/validation', controller.handleMpesaC2BValidation);

router.post('/mpesa/c2b/confirmation', controller.handleMpesaC2BConfirmation);

router.post('/mapbox/geocoding', controller.handleMapboxGeocoding);

router.post('/mapbox/directions', controller.handleMapboxDirections);

router.post('/mapbox/matrix', controller.handleMapboxMatrix);

export default router;
