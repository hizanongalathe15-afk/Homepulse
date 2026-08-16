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

export class CreateMaintenanceRequestData {
  propertyId: string;
  requestedBy: string;
  title: string;
  description?: string;
  priority?: string;
  images?: string[];
}

export class UpdateMaintenanceRequestData {
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  images?: string[];
}

export class MaintenanceFilters {
  propertyId?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  page?: number;
  limit?: number;
}
