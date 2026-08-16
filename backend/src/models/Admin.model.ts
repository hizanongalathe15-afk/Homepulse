export class AdminModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  isVerified: boolean;
  createdAt: Date;
}

export class DashboardStats {
  totalUsers: number;
  totalProperties: number;
  totalListings: number;
  totalRevenue: number;
  activeListings: number;
  pendingApprovals: number;
  totalPayments: number;
  recentActivity: Array<{ id: string; type: string; message: string; timestamp: Date }>;
}

export class UserFilters {
  role?: string;
  status?: string;
  search?: string;
  city?: string;
  page?: number;
  limit?: number;
  offset?: number;
}

export class AdminPropertyFilters {
  status?: string;
  city?: string;
  landlordId?: string;
  page?: number;
  limit?: number;
  offset?: number;
}
