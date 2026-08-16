export class NeighborhoodModel {
  id: string;
  name: string;
  city: string;
  description?: string;
  averageRent: number;
  safetyScore: number;
  amenities: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class CreateNeighborhoodData {
  name: string;
  city: string;
  description?: string;
  averageRent: number;
  safetyScore: number;
  amenities?: string[];
  images?: string[];
}
