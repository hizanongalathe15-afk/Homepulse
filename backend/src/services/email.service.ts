import nodemailer from 'nodemailer';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private readonly defaultFrom: string;

  constructor() {
    this.defaultFrom = process.env['EMAIL_FROM'] || 'noreply@homepulse.com';
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    try {
      if (process.env['SMTP_HOST'] && process.env['SMTP_USER'] && process.env['SMTP_PASS']) {
        this.transporter = nodemailer.createTransport({
          host: process.env['SMTP_HOST'],
          port: Number(process.env['SMTP_PORT']) || 587,
          secure: process.env['SMTP_SECURE'] === 'true',
          auth: { user: process.env['SMTP_USER'], pass: process.env['SMTP_PASS'] },
        });
        logger.info('Email service initialized');
      } else if (process.env['SENDGRID_API_KEY']) {
        this.transporter = nodemailer.createTransport({
          host: 'smtp.sendgrid.net',
          port: 587,
          auth: { user: 'apikey', pass: process.env['SENDGRID_API_KEY'] },
        });
        logger.info('Email service initialized with SendGrid');
      } else {
        logger.warn('Email service not configured');
      }
    } catch (error) {
      logger.error('Failed to initialize email service:', error);
    }
  }

  async sendEmail(options: EmailOptions): Promise<{ messageId: string; success: boolean }> {
    try {
      if (!this.transporter) throw new AppError('Email service not configured', 503);
      const info = await this.transporter.sendMail({
        from: options.from || this.defaultFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        cc: options.cc,
        bcc: options.bcc,
        attachments: options.attachments,
      });
      logger.info(`Email sent: ${info.messageId}`);
      return { messageId: info.messageId, success: true };
    } catch (error) {
      logger.error('Email sending failed:', error);
      if (error instanceof AppError) throw error;
      return { messageId: '', success: false };
    }
  }

  async sendTemplateEmail(to: string, template: EmailTemplate, variables: Record<string, string>) {
    try {
      let html = template.html;
      let text = template.text;
      let subject = template.subject;
      for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, value);
        text = text.replace(regex, value);
        subject = subject.replace(regex, value);
      }
      return this.sendEmail({ to, subject, html, text });
    } catch (error) {
      logger.error(`Template email sending failed to ${to}:`, error);
      return { messageId: '', success: false };
    }
  }

  async sendBulkEmails(recipients: string[], subject: string, html: string) {
    try {
      let successCount = 0;
      let failureCount = 0;
      for (const recipient of recipients) {
        try {
          await this.sendEmail({ to: recipient, subject, html });
          successCount++;
        } catch {
          failureCount++;
        }
      }
      return { successCount, failureCount };
    } catch (error) {
      logger.error('Bulk email sending failed:', error);
      return { successCount: 0, failureCount: recipients.length };
    }
  }

  async verifyConfiguration() {
    try {
      if (!this.transporter) return { configured: false, verified: false };
      await this.transporter.verify();
      return { configured: true, verified: true };
    } catch (error) {
      logger.error('Email configuration verification failed:', error);
      return { configured: true, verified: false };
    }
  }

  getTemplates(): Record<string, EmailTemplate> {
    return {
      WELCOME: {
        subject: 'Welcome to HomePulse!',
        html: '<h1>Welcome to HomePulse!</h1><p>Thank you for joining.</p>',
        text: 'Welcome to HomePulse! Thank you for joining.',
      },
      PASSWORD_RESET: {
        subject: 'Password Reset Request',
        html: '<h1>Password Reset</h1><p>Click the link below to reset your password.</p>',
        text: 'Password Reset Request. Click the link below to reset your password.',
      },
      PAYMENT_CONFIRMATION: {
        subject: 'Payment Confirmation',
        html: '<h1>Payment Confirmed</h1><p>Your payment has been processed successfully.</p>',
        text: 'Payment Confirmed. Your payment has been processed successfully.',
      },
      PROPERTY_APPROVAL: {
        subject: 'Property Listing Approved',
        html: '<h1>Property Approved</h1><p>Your property listing has been approved and is now live.</p>',
        text: 'Property Approved. Your property listing has been approved and is now live.',
      },
    };
  }
}
