import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { EscrowService } from '../services/escrow.service';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';
import { NotificationService } from '../services/notification.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const escrowService = new EscrowService(prisma, notificationService);

export class EscrowController {
  private escrowService: EscrowService;

  constructor(escrowService?: EscrowService) {
    this.escrowService = escrowService || new EscrowService(prisma, notificationService);
  }

  createEscrow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.escrowService.createEscrow(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getEscrow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.escrowService.getEscrow(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getEscrows = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.escrowService.getEscrows(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  releaseEscrow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.escrowService.releaseEscrow(req.params.id as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  cancelEscrow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.escrowService.cancelEscrow(req.params.id as string, userId, req.body.reason);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getMyEscrows = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.escrowService.getMyEscrows(userId, req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
