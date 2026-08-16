import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { MaintenanceService } from '../services/maintenance.service';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(prisma, emailService, smsService);
const maintenanceService = new MaintenanceService(prisma, notificationService);

export class MaintenanceController {
  private maintenanceService: MaintenanceService;

  constructor(maintenanceService?: MaintenanceService) {
    this.maintenanceService = maintenanceService || new MaintenanceService(prisma, notificationService);
  }

  createRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.maintenanceService.createRequest(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.maintenanceService.getRequests(userId, req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.maintenanceService.getRequest(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.maintenanceService.updateRequest(req.params.id as string, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  assignRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.maintenanceService.assignRequest(req.params.id as string, req.body.assignedToId, req.body.notes);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  completeRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.maintenanceService.completeRequest(req.params.id as string, req.body.completionNotes, req.body.completionImages);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  cancelRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.maintenanceService.cancelRequest(req.params.id as string, userId, req.body.reason);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getMaintenanceStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.maintenanceService.getMaintenanceStats(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
