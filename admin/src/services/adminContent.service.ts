import { apiClient } from '@/lib/apiClient'

export const adminContentService = {
  async getBlogPosts(page = 1, limit = 20) {
    const response = await apiClient.get(`/content/blog?page=${page}&limit=${limit}`)
    return response.data
  },

  async createBlogPost(data: Record<string, unknown>) {
    const response = await apiClient.post('/content/blog', data)
    return response.data
  },

  async updateBlogPost(id: string, data: Record<string, unknown>) {
    const response = await apiClient.patch(`/content/blog/${id}`, data)
    return response.data
  },

  async getAnnouncements() {
    const response = await apiClient.get('/content/announcements')
    return response.data
  },

  async createAnnouncement(data: Record<string, unknown>) {
    const response = await apiClient.post('/content/announcements', data)
    return response.data
  },
}
