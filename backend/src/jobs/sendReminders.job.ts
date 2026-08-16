import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.config';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';

export class SendRemindersJob {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  async execute() {
    try {
      const now = new Date();
      const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const upcomingEvents = await this.prisma.communityEvent.findMany({
        where: {
          eventDate: { gte: now, lte: oneDayFromNow },
        },
        include: {
          community: { select: { name: true } },
        },
      });

      let remindersSent = 0;

      for (const event of upcomingEvents) {
        for (const attendeeId of event.attendees) {
          try {
            await this.notificationService.sendNotification({
              userId: attendeeId,
              type: 'EVENT_REMINDER',
              title: 'Event Reminder',
              message: `Reminder: "${event.title}" in ${event.community.name} is happening tomorrow at ${new Date(event.eventDate).toLocaleTimeString()}.`,
            });
            remindersSent++;
          } catch (error) {
            logger.error(`Failed to send reminder to ${attendeeId}:`, error);
          }
        }
      }

      const pendingMaintenance = await this.prisma.maintenanceRequest.findMany({
        where: {
          status: 'PENDING',
          createdAt: { lte: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
        },
        include: {
          property: { select: { title: true, landlordId: true } },
        },
      });

      for (const request of pendingMaintenance) {
        try {
          await this.notificationService.sendNotification({
            userId: request.property.landlordId,
            type: 'MAINTENANCE_REMINDER',
            title: 'Pending Maintenance Request',
            message: `Maintenance request "${request.title}" has been pending for 3 days. Please review and take action.`,
          });
          remindersSent++;
        } catch (error) {
          logger.error(`Failed to send maintenance reminder:`, error);
        }
      }

      logger.info(`Reminders job completed: ${remindersSent} reminders sent`);

      return {
        success: true,
        remindersSent,
      };
    } catch (error) {
      logger.error('Send reminders job failed:', error);
      return { success: false, error };
    }
  }
}
