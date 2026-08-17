import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { LeaseService, LeaseResponse } from '../services/lease.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const leaseService = new LeaseService(prisma);

export class LeaseController {
  private leaseService: LeaseService;

  constructor(leaseService?: LeaseService) {
    this.leaseService = leaseService || new LeaseService(prisma);
  }

  getTenantLeases = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.leaseService.getTenantLeases(userId, req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getLandlordLeases = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.leaseService.getLandlordLeases(userId, req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getLease = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.leaseService.getLease(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  createLease = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.leaseService.createLease(userId, req.body.landlordId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateLease = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.leaseService.updateLease(req.params.id as string, userId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  terminateLease = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.leaseService.terminateLease(req.params.id as string, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
