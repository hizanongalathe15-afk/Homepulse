import { apiClient } from '@/lib/apiClient'
import type { Report, ReportTemplate } from '@/types/report.types'

export interface GenerateReportInput {
  type: Report['type']
  parameters: Record<string, unknown>
  format: Report['format']
}

export const adminReportService = {
  async getReports(page = 1, limit = 20) {
    const response = await apiClient.get(`/reports?page=${page}&limit=${limit}`)
    return response.data
  },

  async getReport(id: string): Promise<Report> {
    const response = await apiClient.get(`/reports/${id}`)
    return response.data
  },

  async generateReport(input: GenerateReportInput): Promise<Report> {
    const response = await apiClient.post('/reports/generate', input)
    return response.data
  },

  async getTemplates() {
    const response = await apiClient.get('/reports/templates')
    return response.data
  },

  async deleteReport(id: string) {
    await apiClient.delete(`/reports/${id}`)
  },
}
