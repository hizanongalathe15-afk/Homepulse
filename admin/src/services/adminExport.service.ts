import { apiClient } from '@/lib/apiClient'

export const adminExportService = {
  async exportCSV(endpoint: string, filters?: Record<string, unknown>) {
    const response = await apiClient.post('/export/csv', { endpoint, filters }, { responseType: 'blob' })
    return response.data
  },

  async exportPDF(endpoint: string, filters?: Record<string, unknown>) {
    const response = await apiClient.post('/export/pdf', { endpoint, filters }, { responseType: 'blob' })
    return response.data
  },
}
