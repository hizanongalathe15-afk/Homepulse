import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';

export interface CreateCampaignData {
  title: string;
  description?: string;
  bannerId: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  targetAudience?: string[];
  goals?: any;
}

export interface UpdateCampaignData {
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  status?: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  targetAudience?: string[];
  goals?: any;
}

export interface CampaignFilters {
  status?: string;
  bannerId?: string;
  page?: number;
  limit?: number;
  offset?: number;
}

export class CampaignService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getCampaigns(filters?: CampaignFilters): Promise<{ campaigns: any[]; total: number; hasMore: boolean }> {
    try {
      const whereClause: any = {};
      if (filters?.status) whereClause.status = filters.status;
      if (filters?.bannerId) whereClause.bannerId = filters.bannerId;

      const limit = filters?.limit || 20;
      const offset = filters?.offset || 0;

      const [campaigns, total] = await Promise.all([
        this.prisma.campaign.findMany({
          where: whereClause,
          include: { banner: { select: { id: true, title: true, imageUrl: true } } },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        this.prisma.campaign.count({ where: whereClause }),
      ]);

      return { campaigns, total, hasMore: total > offset + limit };
    } catch (error) {
      logger.error('Failed to get campaigns:', error);
      throw new AppError('Failed to fetch campaigns', 500);
    }
  }

  async createCampaign(data: CreateCampaignData): Promise<{ id: string; title: string }> {
    try {
      const campaign = await this.prisma.campaign.create({
        data: {
          title: data.title,
          description: data.description,
          bannerId: data.bannerId,
          startDate: data.startDate,
          endDate: data.endDate,
          budget: data.budget,
          targetAudience: data.targetAudience || [],
          goals: data.goals || {},
          status: 'DRAFT',
        },
        select: { id: true, title: true },
      });
      return campaign;
    } catch (error) {
      logger.error('Failed to create campaign:', error);
      throw new AppError('Failed to create campaign', 500);
    }
  }

  async getCampaign(id: string): Promise<any> {
    try {
      const campaign = await this.prisma.campaign.findUnique({
        where: { id },
        include: { banner: true },
      });
      if (!campaign) throw new AppError('Campaign not found', 404);
      return campaign;
    } catch (error) {
      logger.error(`Failed to get campaign ${id}:`, error);
      throw new AppError('Failed to fetch campaign', 500);
    }
  }

  async updateCampaign(id: string, data: UpdateCampaignData): Promise<{ id: string; title: string }> {
    try {
      const campaign = await this.prisma.campaign.update({
        where: { id },
        data,
        select: { id: true, title: true },
      });
      return campaign;
    } catch (error) {
      logger.error(`Failed to update campaign ${id}:`, error);
      throw new AppError('Failed to update campaign', 500);
    }
  }

  async deleteCampaign(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.campaign.delete({ where: { id } });
      return { message: 'Campaign deleted successfully' };
    } catch (error) {
      logger.error(`Failed to delete campaign ${id}:`, error);
      throw new AppError('Failed to delete campaign', 500);
    }
  }

  async activateCampaign(id: string): Promise<{ id: string; status: string }> {
    try {
      const campaign = await this.prisma.campaign.update({
        where: { id },
        data: { status: 'ACTIVE' },
        select: { id: true, status: true },
      });
      return campaign;
    } catch (error) {
      logger.error(`Failed to activate campaign ${id}:`, error);
      throw new AppError('Failed to activate campaign', 500);
    }
  }

  async pauseCampaign(id: string): Promise<{ id: string; status: string }> {
    try {
      const campaign = await this.prisma.campaign.update({
        where: { id },
        data: { status: 'PAUSED' },
        select: { id: true, status: true },
      });
      return campaign;
    } catch (error) {
      logger.error(`Failed to pause campaign ${id}:`, error);
      throw new AppError('Failed to pause campaign', 500);
    }
  }

  async recordConversion(campaignId: string, data: { type: string; userId?: string; value?: number }): Promise<{ conversions: number }> {
    try {
      const campaign = await this.prisma.campaign.update({
        where: { id: campaignId },
        data: { conversions: { increment: 1 } },
        select: { conversions: true },
      });
      return { conversions: campaign.conversions };
    } catch (error) {
      logger.error(`Failed to record conversion for campaign ${campaignId}:`, error);
      throw new AppError('Failed to record conversion', 500);
    }
  }

  async getCampaignAnalytics(campaignId: string): Promise<any> {
    try {
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: campaignId },
        include: { banner: { select: { views: true, clicks: true } } },
      });
      if (!campaign) throw new AppError('Campaign not found', 404);

      const views = campaign.banner.views;
      const clicks = campaign.banner.clicks;
      const conversions = campaign.conversions;
      const ctr = views > 0 ? (clicks / views) * 100 : 0;
      const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

      return {
        totalCampaigns: 1,
        activeCampaigns: campaign.status === 'ACTIVE' ? 1 : 0,
        totalViews: views,
        totalClicks: clicks,
        totalConversions: conversions,
        averageCTR: Math.round(ctr * 100) / 100,
        campaigns: [{
          id: campaign.id,
          title: campaign.title,
          views,
          clicks,
          conversions,
          ctr: Math.round(ctr * 100) / 100,
        }],
      };
    } catch (error) {
      logger.error(`Failed to get analytics for campaign ${campaignId}:`, error);
      throw new AppError('Failed to fetch campaign analytics', 500);
    }
  }

  async getCampaignStats(): Promise<any> {
    try {
      const [total, active] = await Promise.all([
        this.prisma.campaign.count(),
        this.prisma.campaign.count({ where: { status: 'ACTIVE' } }),
      ]);

      return { totalCampaigns: total, activeCampaigns: active };
    } catch (error) {
      logger.error('Failed to get campaign stats:', error);
      throw new AppError('Failed to fetch campaign stats', 500);
    }
  }

  async getActiveCampaigns(): Promise<any[]> {
    try {
      const campaigns = await this.prisma.campaign.findMany({
        where: { status: 'ACTIVE' },
        include: { banner: true },
        orderBy: { createdAt: 'desc' },
      });
      return campaigns;
    } catch (error) {
      logger.error('Failed to get active campaigns:', error);
      throw new AppError('Failed to fetch active campaigns', 500);
    }
  }
}
