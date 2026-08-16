export interface Banner {
  id: string
  title: string
  imageUrl: string
  targetUrl: string
  placement: 'home' | 'search' | 'property_detail' | 'dashboard'
  status: 'active' | 'paused' | 'expired' | 'draft'
  startDate: Date
  endDate?: Date
  impressions: number
  clicks: number
  ctr: number
  createdAt: Date
}
