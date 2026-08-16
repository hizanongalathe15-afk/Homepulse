export class LeaseModel {
  id: string;
  propertyId: string;
  landlordId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  rentAmount: number;
  currency: string;
  depositAmount: number;
  status: string;
  terms?: string;
  signedByLandlord: boolean;
  signedByTenant: boolean;
  documentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateLeaseData {
  propertyId: string;
  landlordId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  rentAmount: number;
  currency?: string;
  depositAmount: number;
  terms?: string;
}

export class LeaseFilters {
  propertyId?: string;
  landlordId?: string;
  tenantId?: string;
  status?: string;
  page?: number;
  limit?: number;
}
