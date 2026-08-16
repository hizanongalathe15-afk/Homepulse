import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { pushConfig } from '../config/push.config';
import { NotificationService } from './notification.service';

export interface PushNotificationData {
  userId: string;
  title: string;
  body: string;
  data?: any;
}

export class PushService {
  private notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  async sendPushNotification(data: PushNotificationData) {
    try {
      if (pushConfig.provider === 'firebase') {
        return this.sendFirebaseNotification(data);
      } else if (pushConfig.provider === 'onesignal') {
        return this.sendOneSignalNotification(data);
      } else {
        logger.warn('Push provider not configured');
        return { success: false };
      }
    } catch (error) {
      logger.error('Failed to send push notification:', error);
      if (error instanceof AppError) throw error;
      return { success: false };
    }
  }

  private async sendFirebaseNotification(data: PushNotificationData) {
    try {
      const admin = require('firebase-admin');
      if (!admin.apps.length && pushConfig.firebase.projectId) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: pushConfig.firebase.projectId,
            clientEmail: pushConfig.firebase.clientEmail,
            privateKey: pushConfig.firebase.privateKey?.replace(/\\n/g, '\n'),
          }),
          databaseURL: pushConfig.firebase.databaseURL,
        });
      }

      const message = {
        notification: {
          title: data.title,
          body: data.body,
        },
        data: data.data || {},
        token: data.userId,
      };

      const response = await admin.messaging().send(message);
      logger.info(`Firebase push notification sent: ${response}`);
      return { success: true, messageId: response };
    } catch (error) {
      logger.error('Firebase push notification failed:', error);
      return { success: false };
    }
  }

  private async sendOneSignalNotification(data: PushNotificationData) {
    try {
      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${pushConfig.onesignal.restApiKey}`,
        },
        body: JSON.stringify({
          app_id: pushConfig.onesignal.appId,
          include_external_user_ids: [data.userId],
          headings: { en: data.title },
          contents: { en: data.body },
          data: data.data,
        }),
      });

      const result: any = await response.json();
      logger.info(`OneSignal push notification sent: ${result.id}`);
      return { success: true, messageId: result.id };
    } catch (error) {
      logger.error('OneSignal push notification failed:', error);
      return { success: false };
    }
  }

  async sendBulkPushNotifications(notifications: PushNotificationData[]) {
    try {
      const results = await Promise.allSettled(
        notifications.map((notification) => this.sendPushNotification(notification))
      );

      const successCount = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
      const failureCount = results.length - successCount;

      return { successCount, failureCount };
    } catch (error) {
      logger.error('Bulk push notifications failed:', error);
      return { successCount: 0, failureCount: notifications.length };
    }
  }
}
