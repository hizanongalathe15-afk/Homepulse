export class UserModel {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  password?: string;
  role: string;
  status: string;
  isVerified: boolean;
  isActive: boolean;
  city?: string;
  profileImage?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  profileVideo?: any;
  profileMusic?: any;
  privacySettings?: any;
  profileCard?: any;
  locationFuzzPreference?: any;
}

export class PropertyModel {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  price: number;
  currency: string;
  city: string;
  neighborhood?: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images: string[];
  amenities: string[];
  latitude?: number;
  longitude?: number;
  landlordId: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export class PaymentModel {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  type: string;
  transactionId?: string;
  reference?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export class ReviewModel {
  id: string;
  targetId: string;
  targetType: string;
  authorId: string;
  rating: number;
  comment?: string;
  images: string[];
  helpful: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class MaintenanceModel {
  id: string;
  propertyId: string;
  requestedById: string;
  assignedToId?: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  images: string[];
  notes?: string;
  completionNotes?: string;
  completionImages: string[];
  completedAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CommunityModel {
  id: string;
  name: string;
  description: string;
  city: string;
  location: string;
  imageUrl?: string;
  members: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

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

export class QRCodeModel {
  id: string;
  propertyId: string;
  userId: string;
  code: string;
  expiresAt: Date;
  scans: number;
  maxScans: number;
  status: string;
  createdAt: Date;
}

export class BannerModel {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  targetAudience: string[];
  priority: number;
  status: string;
  views: number;
  clicks: number;
  startDate?: Date;
  endDate?: Date;
  propertyId?: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CampaignModel {
  id: string;
  title: string;
  description?: string;
  bannerId: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  status: string;
  conversions: number;
  targetAudience: string[];
  goals?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export class EscrowModel {
  id: string;
  propertyId: string;
  payerId: string;
  payeeId: string;
  amount: number;
  currency: string;
  status: string;
  releaseDate?: Date;
  holdDays: number;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ChatModel {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: string;
  mediaUrl?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export class SafetyReportModel {
  id: string;
  userId: string;
  type: string;
  status: string;
  title: string;
  description?: string;
  location?: string;
  images: string[];
  assignedToId?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class SOSAlertModel {
  id: string;
  userId: string;
  type: string;
  status: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  message?: string;
  resolvedAt?: Date;
  createdAt: Date;
}

export class AnalyticsModel {
  id: string;
  eventType: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export class IdentityVerificationModel {
  id: string;
  userId: string;
  idType: string;
  idNumber: string;
  idImage?: string;
  status: string;
  verifiedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ReferralModel {
  id: string;
  referrerId: string;
  refereeId?: string;
  code: string;
  status: string;
  rewardType: string;
  rewardAmount?: number;
  redeemedAt?: Date;
  createdAt: Date;
}

export class RoommateProfileModel {
  id: string;
  userId: string;
  preferences?: Record<string, unknown>;
  budgetMin?: number;
  budgetMax?: number;
  moveInDate?: Date;
  duration?: string;
  lifestyle: string[];
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class SavedSearchModel {
  id: string;
  userId: string;
  propertyId: string;
  name?: string;
  filters?: Record<string, unknown>;
  createdAt: Date;
}

export class SettingModel {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updatedAt: Date;
}
