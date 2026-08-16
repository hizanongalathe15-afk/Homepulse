export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: 'tenant' | 'landlord' | 'agent' | 'admin'
  status: 'active' | 'suspended' | 'pending' | 'inactive'
  verified: boolean
  trustScore: number
  createdAt: Date
  updatedAt: Date
}

export interface UserFilters {
  search?: string
  role?: User['role']
  status?: User['status']
  verified?: boolean
  dateFrom?: string
  dateTo?: string
}
