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

export class CreateEscrowData {
  propertyId: string;
  payerId: string;
  payeeId: string;
  amount: number;
  currency?: string;
  holdDays?: number;
}

export class EscrowFilters {
  propertyId?: string;
  status?: string;
  payerId?: string;
  payeeId?: string;
  page?: number;
  limit?: number;
}
