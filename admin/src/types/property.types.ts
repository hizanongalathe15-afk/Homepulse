export interface Property {
  id: string
  title: string
  description: string
  type: 'apartment' | 'house' | 'commercial' | 'land'
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  price: number
  currency: string
  location: {
    city: string
    neighborhood: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  landlordId: string
  landlordName: string
  images: string[]
  amenities: string[]
  createdAt: Date
  updatedAt: Date
}

export interface PropertyFilters {
  search?: string
  type?: Property['type']
  status?: Property['status']
  city?: string
  minPrice?: number
  maxPrice?: number
  landlordId?: string
}
