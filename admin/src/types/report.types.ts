export interface Report {
  id: string
  name: string
  type: 'user_activity' | 'revenue' | 'property_performance' | 'dispute_summary' | 'custom'
  format: 'pdf' | 'csv' | 'excel'
  status: 'generating' | 'completed' | 'failed'
  generatedBy: string
  parameters: Record<string, unknown>
  fileUrl?: string
  createdAt: Date
  completedAt?: Date
}

export interface ReportTemplate {
  id: string
  name: string
  description: string
  type: Report['type']
  defaultParameters: Record<string, unknown>
  isPublic: boolean
  createdAt: Date
}
