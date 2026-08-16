export interface QRCode {
  id: string
  code: string
  propertyId: string
  propertyTitle: string
  type: 'property' | 'campaign' | 'neighborhood'
  status: 'active' | 'expired' | 'inactive'
  scanCount: number
  conversionRate: number
  createdAt: Date
  expiresAt?: Date
}
