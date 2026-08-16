export interface PaymentType {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  type: string;
  transactionId?: string;
  reference?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentData {
  userId: string;
  amount: number;
  currency?: string;
  method: string;
  type: string;
  transactionId?: string;
  reference?: string;
  metadata?: Record<string, unknown>;
}

export interface EscrowTransactionType {
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

export interface CreateEscrowData {
  propertyId: string;
  payerId: string;
  payeeId: string;
  amount: number;
  currency?: string;
  holdDays?: number;
}

export interface PaymentFilters {
  userId?: string;
  method?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}
