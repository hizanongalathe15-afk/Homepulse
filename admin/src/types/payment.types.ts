export interface Payment {
  id: string
  userId: string
  userName: string
  amount: number
  currency: string
  method: 'mpesa' | 'stripe' | 'cash' | 'bank_transfer'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  type: 'rent' | 'deposit' | 'commission' | 'subscription'
  reference: string
  propertyId?: string
  propertyTitle?: string
  paidAt?: Date
  createdAt: Date
}

export interface PaymentFilters {
  search?: string
  method?: Payment['method']
  status?: Payment['status']
  type?: Payment['type']
  dateFrom?: string
  dateTo?: string
  userId?: string
}
