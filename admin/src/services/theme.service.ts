import { apiClient } from '@/lib/apiClient'
import type { SystemTheme } from '../../../shared/types/theme.types'

export class ThemeService {
  async getTheme(): Promise<SystemTheme> {
    const response = await apiClient.get('/theme')
    return response.data.data as SystemTheme
  }

  async updateTheme(theme: Partial<SystemTheme>): Promise<SystemTheme> {
    const response = await apiClient.put('/admin/theme', theme)
    return response.data.data as SystemTheme
  }

  async resetTheme(): Promise<SystemTheme> {
    const response = await apiClient.post('/admin/theme/reset')
    return response.data.data as SystemTheme
  }

  getDefaultColors(): Record<string, string> {
    return {
      primary: '#1A5276',
      primaryLight: '#2E86C1',
      primaryDark: '#0E2F44',
      secondary: '#2E86C1',
      secondaryLight: '#5DADE2',
      secondaryDark: '#1A5276',
      tertiary: '#F39C12',
      tertiaryLight: '#F7C548',
      tertiaryDark: '#D68910',
      background: '#FAFAFA',
      surface: '#FFFFFF',
      surfaceVariant: '#F0F2F5',
      error: '#E53935',
      onPrimary: '#FFFFFF',
      onSecondary: '#FFFFFF',
      onBackground: '#1A1A1A',
      onSurface: '#1A1A1A',
      onError: '#FFFFFF',
      textPrimary: '#1A1A1A',
      textSecondary: '#6B7280',
      textTertiary: '#9CA3AF',
      divider: '#E5E7EB',
      success: '#10B981',
      warning: '#F59E0B',
      info: '#3B82F6',
    }
  }
}

export const themeService = new ThemeService()
