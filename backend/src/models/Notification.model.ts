export class NotificationModel {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  channel: string;
  isRead: boolean;
  readAt?: Date;
  data?: Record<string, unknown>;
  createdAt: Date;
}

export class CreateNotificationData {
  userId: string;
  type: string;
  title: string;
  message: string;
  channel?: string;
  data?: Record<string, unknown>;
}

export class NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  marketing: boolean;
}
