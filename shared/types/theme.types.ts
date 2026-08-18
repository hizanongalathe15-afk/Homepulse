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
  [key: string]: unknown;
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

export interface SystemTheme {
  id: string;
  name: string;
  isActive: boolean;
  colors: ThemeColorPalette;
  typography?: Record<string, unknown>;
  borderRadius?: Record<string, unknown>;
  spacing?: Record<string, unknown>;
  updatedAt: string;
  updatedBy?: { id: string; firstName: string; lastName: string } | null;
}

export interface ThemeConfig {
  colors: ThemeColorPalette;
  typography?: Record<string, unknown>;
  borderRadius?: Record<string, unknown>;
  spacing?: Record<string, unknown>;
}
