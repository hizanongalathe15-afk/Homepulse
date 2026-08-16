export class AnalyticsModel {
  id: string;
  eventType: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export class AnalyticsEvent {
  eventType: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export class PropertyAnalytics {
  totalViews: number;
  totalInquiries: number;
  totalViewsToday: number;
  totalViewsThisWeek: number;
  totalViewsThisMonth: number;
}

export class PlatformAnalytics {
  totalUsers: number;
  totalProperties: number;
  totalListings: number;
  totalRevenue: number;
  totalPayments: number;
  totalReviews: number;
  totalCommunities: number;
}
