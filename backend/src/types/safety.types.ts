export interface SafetyReportType {
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

export interface CreateSafetyReportData {
  userId: string;
  type: string;
  title: string;
  description?: string;
  location?: string;
  images?: string[];
}

export interface SOSAlertType {
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

export interface CreateSOSAlertData {
  userId: string;
  type: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  message?: string;
}
