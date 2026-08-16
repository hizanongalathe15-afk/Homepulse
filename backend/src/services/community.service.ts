import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validation.middleware';
import { body, query } from 'express-validator';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

export class CommunityService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async createCommunity(createdById: string, data: { name: string; description: string; city: string; location: string; imageUrl?: string }) {
    try {
      const existingCommunity = await this.prisma.community.findFirst({
        where: { name: data.name, city: data.city },
      });

      if (existingCommunity) {
        throw new AppError('Community with this name already exists in this city', 409);
      }

      const community = await this.prisma.community.create({
        data: {
          name: data.name,
          description: data.description,
          city: data.city,
          location: data.location,
          imageUrl: data.imageUrl,
          createdBy: createdById,
          members: [createdById],
        },
        include: { creator: { select: { firstName: true, lastName: true } } },
      });

      logger.info(`Community created: ${community.id}`);

      return {
        success: true,
        data: community,
      };
    } catch (error) {
      logger.error('Failed to create community:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create community', 500);
    }
  }

  async getCommunities(filters?: { city?: string; search?: string; page?: number; limit?: number }) {
    try {
      const whereClause: any = {};

      if (filters?.city) {
        whereClause.city = { contains: filters.city, mode: 'insensitive' };
      }

      if (filters?.search) {
        whereClause.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [communities, total] = await Promise.all([
        this.prisma.community.findMany({
          where: whereClause,
          include: { creator: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.community.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: communities,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get communities:', error);
      throw new AppError('Failed to fetch communities', 500);
    }
  }

  async getCommunity(id: string) {
    try {
      const community = await this.prisma.community.findUnique({
        where: { id },
        include: {
          creator: { select: { firstName: true, lastName: true } },
          posts: { orderBy: { createdAt: 'desc' }, take: 10, include: { author: { select: { firstName: true, lastName: true } } } },
          events: { where: { eventDate: { gte: new Date() } }, orderBy: { eventDate: 'asc' }, take: 5, include: { organizer: { select: { firstName: true, lastName: true } } } },
        },
      });

      if (!community) {
        throw new AppError('Community not found', 404);
      }

      return {
        success: true,
        data: community,
      };
    } catch (error) {
      logger.error(`Failed to get community ${id}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch community', 500);
    }
  }

  async joinCommunity(communityId: string, userId: string) {
    try {
      const community = await this.prisma.community.findUnique({
        where: { id: communityId },
        select: { id: true, members: true },
      });

      if (!community) {
        throw new AppError('Community not found', 404);
      }

      if (community.members.includes(userId)) {
        throw new AppError('Already a member of this community', 400);
      }

      await this.prisma.community.update({
        where: { id: communityId },
        data: { members: { push: userId } },
      });

      logger.info(`User ${userId} joined community ${communityId}`);

      return {
        success: true,
        message: 'Joined community successfully',
      };
    } catch (error) {
      logger.error(`Failed to join community ${communityId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to join community', 500);
    }
  }

  async leaveCommunity(communityId: string, userId: string) {
    try {
      const community = await this.prisma.community.findUnique({
        where: { id: communityId },
        select: { id: true, members: true, createdBy: true },
      });

      if (!community) {
        throw new AppError('Community not found', 404);
      }

      if (community.createdBy === userId) {
        throw new AppError('Community creator cannot leave. Delete the community instead.', 400);
      }

      if (!community.members.includes(userId)) {
        throw new AppError('Not a member of this community', 400);
      }

      await this.prisma.community.update({
        where: { id: communityId },
        data: { members: { set: community.members.filter((id: string) => id !== userId) } },
      });

      logger.info(`User ${userId} left community ${communityId}`);

      return {
        success: true,
        message: 'Left community successfully',
      };
    } catch (error) {
      logger.error(`Failed to leave community ${communityId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to leave community', 500);
    }
  }

  async createPost(communityId: string, authorId: string, data: { content: string; type?: string; mediaUrls?: string[]; pollOptions?: string[]; tags?: string[] }) {
    try {
      const community = await this.prisma.community.findUnique({
        where: { id: communityId },
        select: { id: true, members: true },
      });

      if (!community) {
        throw new AppError('Community not found', 404);
      }

      if (!community.members.includes(authorId)) {
        throw new AppError('Not a member of this community', 403);
      }

      const post = await this.prisma.communityPost.create({
        data: {
          communityId,
          authorId,
          content: data.content,
          type: (data.type || 'TEXT') as any,
          mediaUrls: data.mediaUrls || [],
          pollOptions: data.pollOptions,
          tags: data.tags || [],
        },
        include: { author: { select: { firstName: true, lastName: true, profileImage: true } } },
      });

      logger.info(`Post created: ${post.id} in community ${communityId}`);

      return {
        success: true,
        data: post,
      };
    } catch (error) {
      logger.error('Failed to create post:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create post', 500);
    }
  }

  async getPosts(communityId: string, filters?: { type?: string; authorId?: string; page?: number; limit?: number }) {
    try {
      const whereClause: any = { communityId };

      if (filters?.type) whereClause.type = filters.type;
      if (filters?.authorId) whereClause.authorId = filters.authorId;

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const [posts, total] = await Promise.all([
        this.prisma.communityPost.findMany({
          where: whereClause,
          include: { author: { select: { firstName: true, lastName: true, profileImage: true } } },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        this.prisma.communityPost.count({ where: whereClause }),
      ]);

      return {
        success: true,
        data: posts,
        total,
        page,
        limit,
        hasMore: total > skip + limit,
      };
    } catch (error) {
      logger.error('Failed to get posts:', error);
      throw new AppError('Failed to fetch posts', 500);
    }
  }

  async createEvent(communityId: string, organizerId: string, data: { title: string; description?: string; eventDate: Date; location: string; maxAttendees?: number; imageUrl?: string }) {
    try {
      const community = await this.prisma.community.findUnique({
        where: { id: communityId },
        select: { id: true, createdBy: true, members: true },
      });

      if (!community) {
        throw new AppError('Community not found', 404);
      }

      if (community.createdBy !== organizerId && !community.members.includes(organizerId)) {
        throw new AppError('Not authorized to create events in this community', 403);
      }

      const event = await this.prisma.communityEvent.create({
        data: {
          communityId,
          organizerId,
          title: data.title,
          description: data.description,
          eventDate: data.eventDate,
          location: data.location,
          maxAttendees: data.maxAttendees,
          imageUrl: data.imageUrl,
        },
        include: { organizer: { select: { firstName: true, lastName: true } } },
      });

      logger.info(`Event created: ${event.id} in community ${communityId}`);

      return {
        success: true,
        data: event,
      };
    } catch (error) {
      logger.error('Failed to create event:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create event', 500);
    }
  }

  async getEvents(communityId: string, upcoming: boolean = true) {
    try {
      const whereClause: any = { communityId };

      if (upcoming) {
        whereClause.eventDate = { gte: new Date() };
      }

      const events = await this.prisma.communityEvent.findMany({
        where: whereClause,
        select: { id: true, title: true, description: true, eventDate: true, location: true, maxAttendees: true, imageUrl: true, attendees: true, organizer: { select: { firstName: true, lastName: true } } },
        orderBy: { eventDate: 'asc' },
      });

      return {
        success: true,
        data: events,
      };
    } catch (error) {
      logger.error(`Failed to get events for community ${communityId}:`, error);
      throw new AppError('Failed to fetch events', 500);
    }
  }

  async rsvpEvent(eventId: string, userId: string) {
    try {
      const event = await this.prisma.communityEvent.findUnique({
        where: { id: eventId },
        select: { id: true, attendees: true, maxAttendees: true, eventDate: true },
      });

      if (!event) {
        throw new AppError('Event not found', 404);
      }

      if (event.eventDate < new Date()) {
        throw new AppError('Cannot RSVP to past events', 400);
      }

      if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
        throw new AppError('Event is fully booked', 400);
      }

      if (event.attendees.includes(userId)) {
        throw new AppError('Already RSVPed to this event', 400);
      }

      await this.prisma.communityEvent.update({
        where: { id: eventId },
        data: { attendees: { push: userId } },
      });

      return {
        success: true,
        message: 'RSVP successful',
      };
    } catch (error) {
      logger.error(`Failed to RSVP to event ${eventId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to RSVP to event', 500);
    }
  }

  async cancelRsvp(eventId: string, userId: string) {
    try {
      const event = await this.prisma.communityEvent.findUnique({
        where: { id: eventId },
        select: { id: true, attendees: true },
      });

      if (!event) {
        throw new AppError('Event not found', 404);
      }

      if (!event.attendees.includes(userId)) {
        throw new AppError('Not RSVPed to this event', 400);
      }

      await this.prisma.communityEvent.update({
        where: { id: eventId },
        data: { attendees: { set: event.attendees.filter((id: string) => id !== userId) } },
      });

      return {
        success: true,
        message: 'RSVP cancelled',
      };
    } catch (error) {
      logger.error(`Failed to cancel RSVP for event ${eventId}:`, error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to cancel RSVP', 500);
    }
  }
}
