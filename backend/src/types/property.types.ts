export interface PropertyType {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  price: number;
  currency: string;
  city: string;
  neighborhood?: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  yearBuilt?: number;
  furnishedLevel?: string;
  floorNumber?: string;
  totalFloors?: number;
  parkingSpaces?: number;
  isPetFriendly?: boolean;
  isWheelchairAccessible?: boolean;
  airConditioning?: boolean;
  balcony?: boolean;
  terrace?: boolean;
  garden?: boolean;
  pool?: boolean;
  gym?: boolean;
  elevator?: boolean;
  laundry?: boolean;
  dishwasher?: boolean;
  wifi?: boolean;
  security?: boolean;
  fencing?: boolean;
  images: string[];
  amenities: string[];
  latitude?: number;
  longitude?: number;
  landlordId: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface PropertyFilters {
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  furnishedLevel?: string;
  amenities?: string[];
  page?: number;
  limit?: number;
}

export interface CreatePropertyData {
  title: string;
  description?: string;
  type: string;
  price: number;
  currency?: string;
  city: string;
  neighborhood?: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  yearBuilt?: number;
  furnishedLevel?: string;
  floorNumber?: string;
  totalFloors?: number;
  parkingSpaces?: number;
  isPetFriendly?: boolean;
  isWheelchairAccessible?: boolean;
  airConditioning?: boolean;
  balcony?: boolean;
  terrace?: boolean;
  garden?: boolean;
  pool?: boolean;
  gym?: boolean;
  elevator?: boolean;
  laundry?: boolean;
  dishwasher?: boolean;
  wifi?: boolean;
  security?: boolean;
  fencing?: boolean;
  images?: string[];
  amenities?: string[];
  latitude?: number;
  longitude?: number;
  landlordId: string;
}

export interface PropertyImageType {
  id: string;
  propertyId: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
  order: number;
  createdAt: Date;
}

export interface PropertyVideoType {
  id: string;
  propertyId: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  createdAt: Date;
}

export interface PropertyViewType {
  id: string;
  propertyId: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}
