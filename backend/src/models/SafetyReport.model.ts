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

export class CreateSafetyReportData {
  userId: string;
  type: string;
  title: string;
  description?: string;
  location?: string;
  images?: string[];
}

export class SafetyReportFilters {
  type?: string;
  status?: string;
  userId?: string;
  page?: number;
  limit?: number;
}
