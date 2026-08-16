import { PrismaClient } from '@prisma/client';
import { AdminService } from '../services/admin.service';
import { AnalyticsService } from '../services/analytics.service';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';
import { logger } from '../config/logger.config';

export class AppController {
  private prisma: PrismaClient;
  private adminService: AdminService;
  private analyticsService: AnalyticsService;
  private notificationService: NotificationService;

  constructor() {
    this.prisma = new PrismaClient();
    const emailService = new EmailService();
    const smsService = new SmsService();
    this.notificationService = new NotificationService(this.prisma, emailService, smsService);
    this.analyticsService = new AnalyticsService(this.prisma, this.notificationService);
    this.adminService = new AdminService(this.prisma, this.analyticsService, this.notificationService);
  }

  getDashboard = async (req: any, res: any, next: any) => {
    try {
      const stats = await this.adminService.getDashboard();
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: any, res: any, next: any) => {
    try {
      const result = await this.adminService.getUsers(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getUser = async (req: any, res: any, next: any) => {
    try {
      const user = await this.adminService.getUser(req.params.id as string);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: any, res: any, next: any) => {
    try {
      const user = await this.adminService.updateUser(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: any, res: any, next: any) => {
    try {
      const result = await this.adminService.deleteUser(req.params.id as string);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getProperties = async (req: any, res: any, next: any) => {
    try {
      const result = await this.adminService.getProperties(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  approveProperty = async (req: any, res: any, next: any) => {
    try {
      const result = await this.adminService.approveProperty(req.params.id as string, req.body.approved, req.body.reason, req.user.id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getPayments = async (req: any, res: any, next: any) => {
    try {
      const result = await this.adminService.getPayments(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getSettings = async (req: any, res: any, next: any) => {
    try {
      const settings = await this.adminService.getSettings();
      res.status(200).json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  };

  updateSettings = async (req: any, res: any, next: any) => {
    try {
      const settings = await this.adminService.updateSettings(req.body);
      res.status(200).json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  };

  broadcastMessage = async (req: any, res: any, next: any) => {
    try {
      const result = await this.adminService.broadcastMessage({ ...req.body, senderId: req.user.id });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
