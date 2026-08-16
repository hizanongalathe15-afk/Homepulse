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

export class CreateBannerData {
  title: string;
  imageUrl: string;
  linkUrl?: string;
  targetAudience?: string[];
  priority?: number;
  startDate?: Date;
  endDate?: Date;
}

export class BannerFilters {
  status?: string;
  targetAudience?: string;
  page?: number;
  limit?: number;
}
