import Stripe from 'stripe';
import { logger } from './logger.config';

export const stripeConfig = {
  secretKey: process.env['STRIPE_SECRET_KEY'],
  publishableKey: process.env['STRIPE_PUBLISHABLE_KEY'],
  webhookSecret: process.env['STRIPE_WEBHOOK_SECRET'],
  apiVersion: process.env['STRIPE_API_VERSION'] || '2023-10-16',
  connectClientId: process.env['STRIPE_CONNECT_CLIENT_ID'],
};

export const stripe = new Stripe(stripeConfig.secretKey!, {
  apiVersion: stripeConfig.apiVersion as Stripe.LatestApiVersion,
});

if (stripeConfig.secretKey) {
  logger.info('Stripe service initialized');
} else {
  logger.warn('Stripe API key not configured');
}
