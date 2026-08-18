import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';

export interface ThemeColorPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  tertiary: string;
  tertiaryLight: string;
  tertiaryDark: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  error: string;
  onPrimary: string;
  onSecondary: string;
  onBackground: string;
  onSurface: string;
  onError: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  divider: string;
  success: string;
  warning: string;
  info: string;
}

export interface ThemeTypography {
  fontFamily: string;
  displayLarge: Record<string, unknown>;
  displayMedium: Record<string, unknown>;
  displaySmall: Record<string, unknown>;
  headlineLarge: Record<string, unknown>;
  headlineMedium: Record<string, unknown>;
  headlineSmall: Record<string, unknown>;
  titleLarge: Record<string, unknown>;
  titleMedium: Record<string, unknown>;
  titleSmall: Record<string, unknown>;
  bodyLarge: Record<string, unknown>;
  bodyMedium: Record<string, unknown>;
  bodySmall: Record<string, unknown>;
  labelLarge: Record<string, unknown>;
  labelMedium: Record<string, unknown>;
  labelSmall: Record<string, unknown>;
}

export interface ThemeBorderRadius {
  small: string;
  medium: string;
  large: string;
  xl: string;
  full: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeConfig {
  colors: ThemeColorPalette;
  typography?: ThemeTypography;
  borderRadius?: ThemeBorderRadius;
  spacing?: ThemeSpacing;
}

export interface SystemTheme {
  id: string;
  name: string;
  isActive: boolean;
  colors: ThemeColorPalette;
  typography?: Record<string, unknown>;
  borderRadius?: Record<string, unknown>;
  spacing?: Record<string, unknown>;
  updatedAt: Date;
  updatedBy?: { id: string; firstName: string; lastName: string } | null;
}

const defaultColors: ThemeColorPalette = {
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
};

const defaultTheme: ThemeConfig = {
  colors: defaultColors,
  typography: {
    fontFamily: 'Inter',
  },
  borderRadius: {
    small: '0.25rem',
    medium: '0.5rem',
    large: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
};

export class ThemeService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getActiveTheme(): Promise<SystemTheme> {
    try {
      let theme = await this.prisma.systemTheme.findFirst({
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' },
        include: {
          updatedBy: { select: { id: true, firstName: true, lastName: true } },
        },
      });

      if (!theme) {
        theme = await this.prisma.systemTheme.create({
          data: {
            name: 'Default',
            isActive: true,
            colors: defaultColors,
            typography: defaultTheme.typography,
            borderRadius: defaultTheme.borderRadius,
            spacing: defaultTheme.spacing,
          },
          include: {
            updatedBy: { select: { id: true, firstName: true, lastName: true } },
          },
        });
      }

      return theme as SystemTheme;
    } catch (error) {
      logger.error('Failed to get active theme:', error);
      throw new AppError('Failed to fetch theme', 500);
    }
  }

  async saveTheme(data: {
    name: string;
    colors: ThemeColorPalette;
    typography?: ThemeTypography;
    borderRadius?: ThemeBorderRadius;
    spacing?: ThemeSpacing;
  }, adminId: string): Promise<SystemTheme> {
    try {
      const existing = await this.prisma.systemTheme.findFirst({
        where: { isActive: true },
      });

      let theme: any;

      if (existing) {
        theme = await this.prisma.systemTheme.update({
          where: { id: existing.id },
          data: {
            name: data.name,
            colors: data.colors,
            typography: data.typography ? data.typography as any : undefined,
            borderRadius: data.borderRadius ? data.borderRadius as any : undefined,
            spacing: data.spacing ? data.spacing as any : undefined,
            updatedById: adminId,
          },
          include: {
            updatedBy: { select: { id: true, firstName: true, lastName: true } },
          },
        });
      } else {
        theme = await this.prisma.systemTheme.create({
          data: {
            name: data.name,
            isActive: true,
            colors: data.colors,
            typography: data.typography ? data.typography as any : undefined,
            borderRadius: data.borderRadius ? data.borderRadius as any : undefined,
            spacing: data.spacing ? data.spacing as any : undefined,
            updatedById: adminId,
          },
          include: {
            updatedBy: { select: { id: true, firstName: true, lastName: true } },
          },
        });
      }

      logger.info(`Theme updated by admin ${adminId}`, { themeName: data.name });

      return theme as SystemTheme;
    } catch (error) {
      logger.error('Failed to save theme:', error);
      throw new AppError('Failed to save theme', 500);
    }
  }

  async resetTheme(adminId: string): Promise<SystemTheme> {
    try {
      const existing = await this.prisma.systemTheme.findFirst({
        where: { isActive: true },
      });

      let theme: any;

      if (existing) {
        theme = await this.prisma.systemTheme.update({
          where: { id: existing.id },
          data: {
            name: 'Default',
            colors: defaultColors,
            typography: defaultTheme.typography,
            borderRadius: defaultTheme.borderRadius,
            spacing: defaultTheme.spacing,
            updatedById: adminId,
          },
          include: {
            updatedBy: { select: { id: true, firstName: true, lastName: true } },
          },
        });
      } else {
        theme = await this.prisma.systemTheme.create({
          data: {
            name: 'Default',
            isActive: true,
            colors: defaultColors,
            typography: defaultTheme.typography,
            borderRadius: defaultTheme.borderRadius,
            spacing: defaultTheme.spacing,
            updatedById: adminId,
          },
          include: {
            updatedBy: { select: { id: true, firstName: true, lastName: true } },
          },
        });
      }

      logger.info(`Theme reset by admin ${adminId}`);

      return theme as SystemTheme;
    } catch (error) {
      logger.error('Failed to reset theme:', error);
      throw new AppError('Failed to reset theme', 500);
    }
  }

  async getThemeHistory(limit = 20): Promise<SystemTheme[]> {
    try {
      const history = await this.prisma.systemTheme.findMany({
        orderBy: { updatedAt: 'desc' },
        take: limit,
        include: {
          updatedBy: { select: { id: true, firstName: true, lastName: true } },
        },
      });

      return history as SystemTheme[];
    } catch (error) {
      logger.error('Failed to get theme history:', error);
      throw new AppError('Failed to fetch theme history', 500);
    }
  }
}

export const getDefaultTheme = (): ThemeConfig => defaultTheme;
