export class ReviewModel {
  id: string;
  targetId: string;
  targetType: string;
  authorId: string;
  rating: number;
  comment?: string;
  images: string[];
  helpful: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateReviewData {
  authorId: string;
  targetId: string;
  targetType: string;
  rating: number;
  comment?: string;
  images?: string[];
}

export class UpdateReviewData {
  rating?: number;
  comment?: string;
  images?: string[];
}

export class ReviewFilters {
  targetId?: string;
  targetType?: string;
  authorId?: string;
  rating?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
}
