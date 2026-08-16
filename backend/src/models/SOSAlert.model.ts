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

export class CreateSOSAlertData {
  userId: string;
  type: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  message?: string;
}

export class SOSAlertFilters {
  userId?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}
