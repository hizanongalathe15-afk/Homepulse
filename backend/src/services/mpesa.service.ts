import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { mpesaConfig, getMpesaBaseUrl } from '../config/mpesa.config';
import axios from 'axios';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

export interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  accountReference?: string;
}

export interface STKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export class MpesaService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async getAccessToken(): Promise<string> {
    try {
      const auth = Buffer.from(`${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`).toString('base64');
      const response = await axios.get(`${getMpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: { Authorization: `Basic ${auth}` },
      });

      return response.data.access_token;
    } catch (error) {
      logger.error('Failed to get M-Pesa access token:', error);
      throw new Error('Failed to authenticate with M-Pesa');
    }
  }

  async initiateSTKPush(data: STKPushRequest): Promise<STKPushResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      const password = Buffer.from(`${mpesaConfig.shortcode}${mpesaConfig.passkey}${timestamp}`).toString('base64');

      const response = await axios.post(`${getMpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
        BusinessShortCode: mpesaConfig.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: mpesaConfig.transactionType,
        Amount: data.amount,
        PartyA: data.phoneNumber,
        PartyB: mpesaConfig.shortcode,
        PhoneNumber: data.phoneNumber,
        CallBackURL: mpesaConfig.callbackUrl,
        AccountReference: data.accountReference || 'HomePulse',
        TransactionDesc: 'Payment',
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to initiate STK push:', error);
      throw new Error('Failed to initiate M-Pesa payment');
    }
  }

  async handleCallback(data: any) {
    try {
      const { Body } = data;
      const { stkCallback } = Body;

      if (stkCallback.ResultCode === 0) {
        await this.prisma.payment.updateMany({
          where: { reference: stkCallback.CheckoutRequestID },
          data: { status: 'COMPLETED', transactionId: stkCallback.CallbackMetadata?.Item?.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value },
        });
      } else {
        await this.prisma.payment.updateMany({
          where: { reference: stkCallback.CheckoutRequestID },
          data: { status: 'FAILED' },
        });
      }

      return { success: true };
    } catch (error) {
      logger.error('Failed to handle M-Pesa callback:', error);
      return { success: false };
    }
  }

  async handleTimeout(data: any) {
    try {
      const { Body } = data;
      const { stkCallback } = Body;

      await this.prisma.payment.updateMany({
        where: { reference: stkCallback.CheckoutRequestID },
        data: { status: 'TIMEOUT' },
      });

      return { success: true };
    } catch (error) {
      logger.error('Failed to handle M-Pesa timeout:', error);
      return { success: false };
    }
  }

  async queryTransactionStatus(checkoutRequestId: string) {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      const password = Buffer.from(`${mpesaConfig.shortcode}${mpesaConfig.passkey}${timestamp}`).toString('base64');

      const response = await axios.post(`${getMpesaBaseUrl()}/mpesa/stkpush/v1/query`, {
        BusinessShortCode: mpesaConfig.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to query transaction status:', error);
      throw new Error('Failed to query transaction status');
    }
  }
}
