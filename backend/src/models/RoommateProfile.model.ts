export class RoommateProfileModel {
  id: string;
  userId: string;
  preferences?: Record<string, unknown>;
  budgetMin?: number;
  budgetMax?: number;
  moveInDate?: Date;
  duration?: string;
  lifestyle: string[];
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateRoommateProfileData {
  userId: string;
  preferences?: Record<string, unknown>;
  budgetMin?: number;
  budgetMax?: number;
  moveInDate?: Date;
  duration?: string;
  lifestyle?: string[];
  bio?: string;
}

export class RoommateFilters {
  city?: string;
  minBudget?: number;
  maxBudget?: number;
  moveInDate?: Date;
  page?: number;
  limit?: number;
}

export class MatchResult {
  userId: string;
  matchScore: number;
  profile: RoommateProfileModel;
}
