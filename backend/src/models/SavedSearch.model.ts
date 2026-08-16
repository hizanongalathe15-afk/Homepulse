export class SavedSearchModel {
  id: string;
  userId: string;
  propertyId: string;
  name?: string;
  filters?: Record<string, unknown>;
  createdAt: Date;
}

export class CreateSavedSearchData {
  userId: string;
  propertyId: string;
  name?: string;
  filters?: Record<string, unknown>;
}

export class SavedSearchFilters {
  userId?: string;
  propertyId?: string;
  page?: number;
  limit?: number;
}
