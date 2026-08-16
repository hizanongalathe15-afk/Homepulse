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

export class CreateCampaignData {
  title: string;
  description?: string;
  bannerId: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  targetAudience?: string[];
  goals?: Record<string, unknown>;
}

export class UpdateCampaignData {
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  status?: string;
  targetAudience?: string[];
  goals?: Record<string, unknown>;
}

export class CampaignFilters {
  status?: string;
  bannerId?: string;
  page?: number;
  limit?: number;
  offset?: number;
}
