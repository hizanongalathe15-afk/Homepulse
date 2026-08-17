export interface Property {
  id: string
  title: string
  description?: string
  type: string
  status: string
  price: number
  currency: string
  city: string
  neighborhood?: string
  address?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  images: string[]
  amenities: string[]
  landlordId: string
  landlord?: {
    firstName: string
    lastName: string
    email: string
  }
  landlordName?: string
  isVerified?: boolean
  views?: number
  likes?: number
  createdAt: string
  updatedAt: string
}

export interface PropertyFilters {
  search?: string
  type?: string
  status?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  landlordId?: string
  page?: number
  limit?: number
}
