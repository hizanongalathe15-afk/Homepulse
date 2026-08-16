export interface BannerType {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBannerData {
  title: string;
  imageUrl: string;
  linkUrl?: string;
  targetAudience?: string[];
  priority?: number;
  startDate?: Date;
  endDate?: Date;
}
