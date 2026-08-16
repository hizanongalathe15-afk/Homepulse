export class PaymentModel {
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

export class CreatePaymentData {
  userId: string;
  amount: number;
  currency?: string;
  method: string;
  type: string;
  transactionId?: string;
  reference?: string;
  metadata?: Record<string, unknown>;
}

export class PaymentFilters {
  userId?: string;
  method?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}
