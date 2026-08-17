import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import {
  AdCampaignModel,
  CreateAdCampaignData,
  UpdateAdCampaignData,
  AdCampaignFilters,
} from '../models/AdCampaign.model';

export class AdService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createAdCampaign(createdById: string, data: CreateAdCampaignData): Promise<AdCampaignModel> {
    try {
      const campaign = await this.prisma.adCampaign.create({
        data: {
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          linkUrl: data.linkUrl,
          targetPage: data.targetPage,
          targetType: data.targetType,
          targetId: data.targetId,
          startDate: data.startDate,
          endDate: data.endDate,
          budget: data.budget,
          priority: data.priority || 0,
          createdBy: createdById,
          metadata: data.metadata as any,
        },
      });

      logger.info(`AdCampaign created: ${campaign.id}`);

      return campaign as unknown as AdCampaignModel;
    } catch (error) {
      logger.error('Failed to create ad campaign:', error);
      throw new AppError('Failed to create ad campaign', 500);
    }
  }

  async getAdCampaigns(filters?: AdCampaignFilters) {
    try {
      const whereClause: any = {};

      if (filters?.status) whereClause.status = filters.status;
      if (filters?.targetType) whereClause.targetType = filters.targetType;
      if (filters?.search) {
        whereClause.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [campaigns, total] = await Promise.all([
        this.prisma.adCampaign.findMany({
          where: whereClause,
          orderBy: { priority: 'desc', createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.adCampaign.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: campaigns,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get ad campaigns:', error);
      throw new AppError('Failed to fetch ad campaigns', 500);
    }
  }

  async getAdCampaign(id: string): Promise<AdCampaignModel> {
    try {
      const campaign = await this.prisma.adCampaign.findUnique({
        where: { id },
      });

      if (!campaign) {
        throw new AppError('Ad campaign not found', 404);
      }

      return campaign as unknown as AdCampaignModel;
    } catch (error) {
      logger.error(`Failed to get ad campaign ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch ad campaign', 500);
    }
  }

  async updateAdCampaign(id: string, data: UpdateAdCampaignData): Promise<AdCampaignModel> {
    try {
      const campaign = await this.prisma.adCampaign.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!campaign) {
        throw new AppError('Ad campaign not found', 404);
      }

      const allowedFields = [
        'title', 'description', 'imageUrl', 'linkUrl', 'targetPage',
        'targetType', 'targetId', 'startDate', 'endDate', 'budget',
        'status', 'priority', 'metadata',
      ];
      const updateData: any = {};
      for (const field of allowedFields) {
        if (data[field as keyof UpdateAdCampaignData] !== undefined) {
          updateData[field] = data[field as keyof UpdateAdCampaignData] as any;
        }
      }

      const updatedCampaign = await this.prisma.adCampaign.update({
        where: { id },
        data: updateData,
      });

      return updatedCampaign as unknown as AdCampaignModel;
    } catch (error) {
      logger.error(`Failed to update ad campaign ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update ad campaign', 500);
    }
  }

  async deleteAdCampaign(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const campaign = await this.prisma.adCampaign.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!campaign) {
        throw new AppError('Ad campaign not found', 404);
      }

      await this.prisma.adCampaign.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Ad campaign deleted successfully',
      };
    } catch (error) {
      logger.error(`Failed to delete ad campaign ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete ad campaign', 500);
    }
  }

  async recordImpression(id: string): Promise<{ success: boolean }> {
    try {
      await this.prisma.adCampaign.update({
        where: { id },
        data: { impressions: { increment: 1 } },
      });

      return { success: true };
    } catch (error) {
      logger.error(`Failed to record impression for ad campaign ${id}:`, error);
      return { success: false };
    }
  }

  async recordClick(id: string): Promise<{ success: boolean }> {
    try {
      await this.prisma.adCampaign.update({
        where: { id },
        data: { clicks: { increment: 1 } },
      });

      return { success: true };
    } catch (error) {
      logger.error(`Failed to record click for ad campaign ${id}:`, error);
      return { success: false };
    }
  }

  async getActiveAdCampaigns() {
    try {
      const now = new Date();
      const campaigns = await this.prisma.adCampaign.findMany({
        where: {
          status: 'active',
          startDate: { lte: now },
          endDate: { gte: now },
        },
        orderBy: { priority: 'desc' },
        take: 20,
      });

      return {
        success: true,
        data: campaigns,
      };
    } catch (error) {
      logger.error('Failed to get active ad campaigns:', error);
      throw new AppError('Failed to fetch active ad campaigns', 500);
    }
  }

  async getAdCampaignStats() {
    try {
      const [totalCampaigns, activeCampaigns, totalImpressions, totalClicks] = await Promise.all([
        this.prisma.adCampaign.count(),
        this.prisma.adCampaign.count({ where: { status: 'active' } }),
        this.prisma.adCampaign.aggregate({ _sum: { impressions: true } }),
        this.prisma.adCampaign.aggregate({ _sum: { clicks: true } }),
      ]);

      return {
        success: true,
        data: {
          totalCampaigns,
          activeCampaigns,
          totalImpressions: totalImpressions._sum.impressions || 0,
          totalClicks: totalClicks._sum.clicks || 0,
          ctr: totalImpressions._sum.impressions ? ((totalClicks._sum.clicks || 0) / totalImpressions._sum.impressions) * 100 : 0,
        },
      };
    } catch (error) {
      logger.error('Failed to get ad campaign stats:', error);
      throw new AppError('Failed to fetch ad campaign stats', 500);
    }
  }
}
