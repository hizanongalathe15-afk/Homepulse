export class PropertyModel {
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
  area?: number;
  images: string[];
  amenities: string[];
  latitude?: number;
  longitude?: number;
  landlordId: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export class CreatePropertyData {
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
  area?: number;
  images?: string[];
  amenities?: string[];
  latitude?: number;
  longitude?: number;
  landlordId: string;
}

export class PropertyFilters {
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  page?: number;
  limit?: number;
}
