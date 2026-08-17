import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { body, param, query } from 'express-validator';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';
import axios from 'axios';

export class AiService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async generatePropertyDescription(title: string, type: string, features: string[]) {
    try {
      const openaiApiKey = process.env['OPENAI_API_KEY'];
      if (!openaiApiKey) {
        throw new AppError('OpenAI API key not configured', 500);
      }

      const prompt = `Generate a compelling property description for a ${type.toLowerCase()} titled "${title}" with the following features: ${features.join(', ')}. The description should be professional, engaging, and suitable for a rental listing in Kenya. Keep it under 200 words.`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a professional real estate copywriter specializing in Kenyan rental properties.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 300,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const description = response.data.choices[0]?.message?.content?.trim() || '';

      return {
        success: true,
        data: { description },
      };
    } catch (error) {
      logger.error('Failed to generate property description:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to generate description', 500);
    }
  }

  async suggestPropertyPrice(city: string, type: string, bedrooms: number, bathrooms: number, area: number) {
    try {
      const similarProperties = await this.prisma.property.findMany({
        where: {
          city: { contains: city, mode: 'insensitive' },
          type: type as any,
          status: 'ACTIVE',
          bedrooms: { gte: bedrooms - 1, lte: bedrooms + 1 },
          bathrooms: { gte: bathrooms - 1, lte: bathrooms + 1 },
          area: { gte: area * 0.8, lte: area * 1.2 },
        },
        select: { price: true },
        take: 20,
      });

      if (similarProperties.length === 0) {
        return {
          success: true,
          data: { suggestedPrice: area * 15, confidence: 'LOW', reason: 'No similar properties found' },
        };
      }

      const prices = similarProperties.map((p) => p.price);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      return {
        success: true,
        data: {
          suggestedPrice: Math.round(avgPrice),
          minPrice,
          maxPrice,
          confidence: 'HIGH',
          reason: `Based on ${similarProperties.length} similar properties`,
        },
      };
    } catch (error) {
      logger.error('Failed to suggest property price:', error);
      throw new AppError('Failed to suggest price', 500);
    }
  }

  async predictMaintenancePriority(propertyId: string) {
    try {
      const maintenanceRequests = await this.prisma.maintenanceRequest.findMany({
        where: { propertyId },
        select: { priority: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      const priorityCounts = maintenanceRequests.reduce((acc, req) => {
        acc[req.priority] = (acc[req.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostCommonPriority = Object.entries(priorityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'MEDIUM';

      return {
        success: true,
        data: {
          predictedPriority: mostCommonPriority,
          history: priorityCounts,
          totalRequests: maintenanceRequests.length,
        },
      };
    } catch (error) {
      logger.error('Failed to predict maintenance priority:', error);
      throw new AppError('Failed to predict priority', 500);
    }
  }

  async getChatbotResponse(query: string, userId: string) {
    try {
      const openaiApiKey = process.env['OPENAI_API_KEY'];
      if (!openaiApiKey) {
        throw new AppError('OpenAI API key not configured', 500);
      }

      const systemPrompt = `You are HomePulse AI assistant, a helpful support chatbot for a property rental and management platform in Kenya. You help users with questions about renting, property management, payments, maintenance, and general platform usage. Be concise, friendly, and professional.`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query },
          ],
          max_tokens: 200,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const chatbotResponse = response.data.choices[0]?.message?.content?.trim() || 'Thank you for your question. Our support team will get back to you shortly.';

      return {
        success: true,
        data: { response: chatbotResponse },
      };
    } catch (error) {
      logger.error('Failed to get chatbot response:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to get response', 500);
    }
  }
}
