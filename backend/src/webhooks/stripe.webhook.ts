import { Request, Response } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { stripeConfig, stripe } from '../config/stripe.config';

export class StripeWebhookHandler {
  async handleWebhook(req: Request, res: Response) {
    try {
      const signature = req.headers['stripe-signature'] as string;
      const payload = req.body;

      if (!signature) {
        throw new AppError('Missing stripe signature', 400);
      }

      const { type, data } = await stripe.webhooks.constructEventAsync(
        JSON.stringify(payload),
        signature,
        stripeConfig.webhookSecret!
      );

      logger.info(`Stripe webhook received: ${type}`);

      switch (type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(data.object as any);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(data.object as any);
          break;
        case 'charge.refunded':
          await this.handleChargeRefunded(data.object as any);
          break;
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(data.object as any);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(data.object as any);
          break;
        default:
          logger.info(`Unhandled Stripe webhook type: ${type}`);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      logger.error('Stripe webhook handling failed:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Webhook verification failed' });
      }
    }
  }

  private async handlePaymentIntentSucceeded(paymentIntent: any) {
    try {
      await require('../services/payment.service').PaymentService.prototype.createPayment(
        paymentIntent.metadata.userId,
        {
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          method: 'STRIPE',
          type: 'payment',
          transactionId: paymentIntent.id,
          status: 'COMPLETED',
        }
      );
      logger.info(`Payment intent succeeded: ${paymentIntent.id}`);
    } catch (error) {
      logger.error(`Failed to handle payment intent succeeded: ${paymentIntent.id}`, error);
    }
  }

  private async handlePaymentIntentFailed(paymentIntent: any) {
    try {
      logger.info(`Payment intent failed: ${paymentIntent.id}`);
    } catch (error) {
      logger.error(`Failed to handle payment intent failed: ${paymentIntent.id}`, error);
    }
  }

  private async handleChargeRefunded(charge: any) {
    try {
      logger.info(`Charge refunded: ${charge.id}`);
    } catch (error) {
      logger.error(`Failed to handle charge refunded: ${charge.id}`, error);
    }
  }

  private async handleSubscriptionCreated(subscription: any) {
    try {
      logger.info(`Subscription created: ${subscription.id}`);
    } catch (error) {
      logger.error(`Failed to handle subscription created: ${subscription.id}`, error);
    }
  }

  private async handleSubscriptionDeleted(subscription: any) {
    try {
      logger.info(`Subscription deleted: ${subscription.id}`);
    } catch (error) {
      logger.error(`Failed to handle subscription deleted: ${subscription.id}`, error);
    }
  }
}
