export interface Admin {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'moderator'
  permissions: string[]
  lastLoginAt: Date
  createdAt: Date
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  statusCode: number
  code?: string
}
