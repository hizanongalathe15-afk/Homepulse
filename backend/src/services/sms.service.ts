import twilio from 'twilio';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { smsConfig } from '../config/sms.config';

export class SmsService {
  private twilioClient: twilio.Twilio | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient(): void {
    try {
      if (smsConfig.provider === 'twilio' && smsConfig.twilio.accountSid && smsConfig.twilio.authToken) {
        this.twilioClient = twilio(smsConfig.twilio.accountSid, smsConfig.twilio.authToken);
        logger.info('SMS service initialized with Twilio');
      } else {
        logger.warn('SMS service not configured');
      }
    } catch (error) {
      logger.error('Failed to initialize SMS service:', error);
    }
  }

  async sendSMS(to: string, message: string): Promise<{ messageId: string; success: boolean }> {
    try {
      if (!this.twilioClient) {
        throw new AppError('SMS service not configured', 503);
      }

      const result = await this.twilioClient!.messages.create({
        body: message,
        from: smsConfig.twilio.senderId,
        to,
      });

      logger.info(`SMS sent: ${result.sid} to ${to}`);

      return { messageId: result.sid, success: true };
    } catch (error) {
      logger.error('SMS sending failed:', error);
      if (error instanceof AppError) throw error;
      return { messageId: '', success: false };
    }
  }

  async sendBulkSMS(recipients: string[], message: string): Promise<{ successCount: number; failureCount: number }> {
    try {
      let successCount = 0;
      let failureCount = 0;

      for (const recipient of recipients) {
        try {
          await this.sendSMS(recipient, message);
          successCount++;
        } catch {
          failureCount++;
        }
      }

      return { successCount, failureCount };
    } catch (error) {
      logger.error('Bulk SMS sending failed:', error);
      return { successCount: 0, failureCount: recipients.length };
    }
  }

  async sendWhatsAppMessage(to: string, message: string): Promise<{ messageId: string; success: boolean }> {
    try {
      if (!this.twilioClient) {
        throw new AppError('SMS service not configured', 503);
      }

      const result = await this.twilioClient!.messages.create({
        body: message,
        from: smsConfig.twilio.whatsappNumber,
        to: `whatsapp:${to}`,
      });

      logger.info(`WhatsApp message sent: ${result.sid}`);

      return { messageId: result.sid, success: true };
    } catch (error) {
      logger.error('WhatsApp sending failed:', error);
      if (error instanceof AppError) throw error;
      return { messageId: '', success: false };
    }
  }
}
