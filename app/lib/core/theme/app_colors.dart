import 'package:flutter/material.dart';
import 'package:homepulse/models/system_theme.dart';

class AppColors {
  AppColors._();

  static const Color primary = Color(0xFF1A5276);
  static const Color primaryLight = Color(0xFF2E86C1);
  static const Color primaryDark = Color(0xFF0E2F44);
  static const Color secondary = Color(0xFF2E86C1);
  static const Color secondaryLight = Color(0xFF5DADE2);
  static const Color secondaryDark = Color(0xFF1A5276);
  static const Color tertiary = Color(0xFFF39C12);
  static const Color tertiaryLight = Color(0xFFF7C548);
  static const Color tertiaryDark = Color(0xFFD68910);
  static const Color background = Color(0xFFFAFAFA);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceVariant = Color(0xFFF0F2F5);
  static const Color error = Color(0xFFE53935);
  static const Color onPrimary = Color(0xFFFFFFFF);
  static const Color onSecondary = Color(0xFFFFFFFF);
  static const Color onBackground = Color(0xFF1A1A1A);
  static const Color onSurface = Color(0xFF1A1A1A);
  static const Color onError = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF1A1A1A);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textTertiary = Color(0xFF9CA3AF);
  static const Color divider = Color(0xFFE5E7EB);
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color info = Color(0xFF3B82F6);

  static const Color like = error;
  static const Color save = tertiary;
  static const Color share = info;
  static const Color verified = success;

  static const Color glassWhite = Color(0xFFFFFFFF);
  static const Color glassBlack = Color(0xFF000000);
  static const Color glassBorderLight = Color(0x3DFFFFFF);
  static const Color glassBorderDark = Color(0x33FFFFFF);

  static const Color darkBackground = Color(0xFF121212);
  static const Color darkSurface = Color(0xFF1E1E1E);
  static const Color darkTextPrimary = Color(0xFFE0E0E0);
  static const Color darkTextSecondary = Color(0xFF9CA3AF);
  static const Color darkDivider = Color(0xFF424242);
  static const Color darkInputFill = Color(0xFF2C2C2C);

  static final AppColors _instance = AppColors._internal();
  AppColors._internal();

  static Color dynamicPrimary(SystemThemeConfig? config) {
    if (config == null || config.colors['primary'] == null) return primary;
    return hexToColor(config.colors['primary']!);
  }

  static Color dynamicColor(SystemThemeConfig? config, String key, Color fallback) {
    if (config == null || config.colors[key] == null) return fallback;
    return hexToColor(config.colors[key]!);
  }
}
