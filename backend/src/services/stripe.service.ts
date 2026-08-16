import axios from 'axios';
import { logger } from '../config/logger.config';
import { stripeConfig, stripe } from '../config/stripe.config';

export class StripeService {
  async createPaymentIntent(data: { amount: number; currency?: string; customerEmail?: string; description?: string; metadata?: Record<string, string> }) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100),
        currency: (data.currency || 'USD').toLowerCase(),
        customer: data.customerEmail ? this.generateCustomerId(data.customerEmail) : undefined,
        description: data.description,
        metadata: data.metadata || {},
        automatic_payment_methods: { enabled: true },
      });

      logger.info(`Payment intent created: ${paymentIntent.id}`);

      return {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      };
    } catch (error) {
      logger.error('Failed to create payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  async confirmPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
      logger.info(`Payment intent confirmed: ${paymentIntentId}`);
      return { id: paymentIntent.id, status: paymentIntent.status };
    } catch (error) {
      logger.error(`Failed to confirm payment intent ${paymentIntentId}:`, error);
      throw new Error('Failed to confirm payment intent');
    }
  }

  async cancelPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
      logger.info(`Payment intent cancelled: ${paymentIntentId}`);
      return { id: paymentIntent.id, status: paymentIntent.status };
    } catch (error) {
      logger.error(`Failed to cancel payment intent ${paymentIntentId}:`, error);
      throw new Error('Failed to cancel payment intent');
    }
  }

  async createRefund(data: { paymentIntentId: string; amount?: number; reason?: string }) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: data.paymentIntentId,
        amount: data.amount ? Math.round(data.amount * 100) : undefined,
        reason: data.reason as any,
      });
      logger.info(`Refund created: ${refund.id}`);
      return { id: refund.id, amount: (refund.amount || 0) / 100, status: refund.status };
    } catch (error) {
      logger.error('Failed to create refund:', error);
      throw new Error('Failed to create refund');
    }
  }

  async createCustomer(email: string, name: string) {
    try {
      const customer = await stripe.customers.create({ email, name });
      logger.info(`Customer created: ${customer.id}`);
      return { id: customer.id, email: customer.email || '', name: customer.name || '' };
    } catch (error) {
      logger.error('Failed to create customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  async getPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        metadata: paymentIntent.metadata,
      };
    } catch (error) {
      logger.error(`Failed to get payment intent ${paymentIntentId}:`, error);
      throw new Error('Payment intent not found');
    }
  }

  async listPaymentIntents(limit = 10, customerId?: string) {
    try {
      const params: any = { limit };
      if (customerId) params.customer = customerId;
      const paymentIntents = await stripe.paymentIntents.list(params);
      return paymentIntents.data.map((pi: any) => ({
        id: pi.id,
        amount: pi.amount / 100,
        currency: pi.currency,
        status: pi.status,
        createdAt: new Date(pi.created * 1000),
      }));
    } catch (error) {
      logger.error('Failed to list payment intents:', error);
      throw new Error('Failed to list payment intents');
    }
  }

  async handleWebhook(payload: string | Buffer, signature: string) {
    try {
      const webhookSecret = stripeConfig.webhookSecret;
      if (!webhookSecret) throw new Error('Webhook secret not configured');
      const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      logger.info(`Stripe webhook received: ${event.type}`);
      return { type: event.type, data: event.data as any };
    } catch (error) {
      logger.error('Stripe webhook handling failed:', error);
      throw new Error('Webhook verification failed');
    }
  }

  private generateCustomerId(email: string): string {
    return `email_${email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
  }
}
