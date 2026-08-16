import { Request, Response } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { mpesaConfig, getMpesaBaseUrl } from '../config/mpesa.config';

export class MpesaWebhookHandler {
  async handleSTKCallback(req: Request, res: Response) {
    try {
      const { Body } = req.body;
      const { stkCallback } = Body;

      if (stkCallback.ResultCode === 0) {
        const receiptNumber = stkCallback.CallbackMetadata?.Item?.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
        await this.updatePaymentStatus(stkCallback.CheckoutRequestID, 'COMPLETED', receiptNumber);
        logger.info(`M-Pesa STK callback success: ${stkCallback.CheckoutRequestID}`);
      } else {
        await this.updatePaymentStatus(stkCallback.CheckoutRequestID, 'FAILED');
        logger.warn(`M-Pesa STK callback failed: ${stkCallback.CheckoutRequestID} - ${stkCallback.ResultDesc}`);
      }

      res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
    } catch (error) {
      logger.error('M-Pesa STK callback handling failed:', error);
      res.status(200).json({ ResultCode: 1, ResultDesc: 'Failed' });
    }
  }

  async handleTimeout(req: Request, res: Response) {
    try {
      const { Body } = req.body;
      const { stkCallback } = Body;

      await this.updatePaymentStatus(stkCallback.CheckoutRequestID, 'TIMEOUT');
      logger.info(`M-Pesa timeout callback: ${stkCallback.CheckoutRequestID}`);

      res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
    } catch (error) {
      logger.error('M-Pesa timeout callback handling failed:', error);
      res.status(200).json({ ResultCode: 1, ResultDesc: 'Failed' });
    }
  }

  async handleC2BValidation(req: Request, res: Response) {
    try {
      const { Body } = req.body;
      const { stkCallback } = Body;

      logger.info(`M-Pesa C2B validation: ${stkCallback.CheckoutRequestID}`);

      res.status(200).json({ ResultCode: 0, ResultDesc: 'Validation successful' });
    } catch (error) {
      logger.error('M-Pesa C2B validation failed:', error);
      res.status(200).json({ ResultCode: 1, ResultDesc: 'Validation failed' });
    }
  }

  async handleC2BConfirmation(req: Request, res: Response) {
    try {
      const { Body } = req.body;
      const { stkCallback } = Body;

      await this.updatePaymentStatus(stkCallback.CheckoutRequestID, 'COMPLETED', stkCallback.TransID);
      logger.info(`M-Pesa C2B confirmation: ${stkCallback.CheckoutRequestID}`);

      res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
    } catch (error) {
      logger.error('M-Pesa C2B confirmation failed:', error);
      res.status(200).json({ ResultCode: 1, ResultDesc: 'Failed' });
    }
  }

  private async updatePaymentStatus(checkoutRequestId: string, status: string, transactionId?: string) {
    try {
      const payment = await require('../services/payment.service').PaymentService.prototype.getPaymentByReference(checkoutRequestId);
      if (payment) {
        await require('../services/payment.service').PaymentService.prototype.updatePaymentStatus(payment.id, status, transactionId);
      }
    } catch (error) {
      logger.error('Failed to update payment status:', error);
    }
  }
}
