import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app_colors.dart';

class AppTheme {
  AppTheme._();

  static BorderRadius get borderRadiusLg => const BorderRadius.all(Radius.circular(12));
  static BorderRadius get borderRadiusXl => const BorderRadius.all(Radius.circular(16));
  static BorderRadius get borderRadiusFull => const BorderRadius.all(Radius.circular(999));

  static List<BoxShadow> get elevationShadows => [
        BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 2, offset: const Offset(0, 1)),
        BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 4, offset: const Offset(0, 2)),
        BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 8, offset: const Offset(0, 4)),
        BoxShadow(color: Colors.black.withOpacity(0.10), blurRadius: 16, offset: const Offset(0, 8)),
        BoxShadow(color: Colors.black.withOpacity(0.12), blurRadius: 24, offset: const Offset(0, 12)),
        BoxShadow(color: Colors.black.withOpacity(0.14), blurRadius: 32, offset: const Offset(0, 16)),
        BoxShadow(color: Colors.black.withOpacity(0.16), blurRadius: 40, offset: const Offset(0, 20)),
        BoxShadow(color: Colors.black.withOpacity(0.18), blurRadius: 48, offset: const Offset(0, 24)),
      ];

  static Widget glassCard({
    required Widget child,
    double blurSigma = 16,
    BorderRadius? borderRadius,
    EdgeInsetsGeometry? padding,
    EdgeInsetsGeometry? margin,
    VoidCallback? onTap,
    double? width,
    double? height,
  }) {
    final radius = borderRadius ?? borderRadiusXl;
    return GestureDetector(
      onTap: onTap,
      child: ClipRRect(
        borderRadius: radius,
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: blurSigma, sigmaY: blurSigma),
          child: Container(
            width: width,
            height: height,
            padding: padding,
            margin: margin,
            decoration: BoxDecoration(
              color: AppColors.surface.withOpacity(0.65),
              borderRadius: radius,
              border: Border.all(
                color: AppColors.glassBorderLight,
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.08),
                  blurRadius: 24,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: child,
          ),
        ),
      ),
    );
  }

  static ThemeData get lightTheme {
    final textTheme = TextTheme(
      displayLarge: const TextStyle(fontFamily: 'Inter', fontSize: 57, fontWeight: FontWeight.w400, color: AppColors.textPrimary, height: 1.12),
      displayMedium: const TextStyle(fontFamily: 'Inter', fontSize: 45, fontWeight: FontWeight.w400, color: AppColors.textPrimary, height: 1.16),
      displaySmall: const TextStyle(fontFamily: 'Inter', fontSize: 36, fontWeight: FontWeight.w400, color: AppColors.textPrimary, height: 1.22),
      headlineLarge: const TextStyle(fontFamily: 'Inter', fontSize: 32, fontWeight: FontWeight.w700, color: AppColors.textPrimary, height: 1.25),
      headlineMedium: const TextStyle(fontFamily: 'Inter', fontSize: 28, fontWeight: FontWeight.w600, color: AppColors.textPrimary, height: 1.29),
      headlineSmall: const TextStyle(fontFamily: 'Inter', fontSize: 24, fontWeight: FontWeight.w600, color: AppColors.textPrimary, height: 1.33),
      titleLarge: const TextStyle(fontFamily: 'Inter', fontSize: 22, fontWeight: FontWeight.w600, color: AppColors.textPrimary, height: 1.27),
      titleMedium: const TextStyle(fontFamily: 'Inter', fontSize: 16, fontWeight: FontWeight.w500, color: AppColors.textPrimary, height: 1.50),
      titleSmall: const TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textSecondary, height: 1.43),
      bodyLarge: const TextStyle(fontFamily: 'Inter', fontSize: 16, fontWeight: FontWeight.w400, color: AppColors.textPrimary, height: 1.50),
      bodyMedium: const TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w400, color: AppColors.textPrimary, height: 1.43),
      bodySmall: const TextStyle(fontFamily: 'Inter', fontSize: 12, fontWeight: FontWeight.w400, color: AppColors.textSecondary, height: 1.33),
      labelLarge: const TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textPrimary, height: 1.43),
      labelMedium: const TextStyle(fontFamily: 'Inter', fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.textSecondary, height: 1.33),
      labelSmall: const TextStyle(fontFamily: 'Inter', fontSize: 10, fontWeight: FontWeight.w500, color: AppColors.textSecondary, height: 1.20),
    );

    return ThemeData(
      useMaterial3: true,
      fontFamily: 'Inter',
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primary,
        brightness: Brightness.light,
        primary: AppColors.primary,
        onPrimary: AppColors.onPrimary,
        secondary: AppColors.secondary,
        onSecondary: AppColors.onSecondary,
        tertiary: AppColors.tertiary,
        error: AppColors.error,
        onError: AppColors.onError,
        background: AppColors.background,
        onBackground: AppColors.onBackground,
        surface: AppColors.surface,
        onSurface: AppColors.onSurface,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.primary.withOpacity(0.75),
        foregroundColor: AppColors.onPrimary,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: textTheme.titleLarge?.copyWith(
          fontWeight: FontWeight.w600,
          color: AppColors.onPrimary,
        ),
      ),
      cardTheme: CardThemeData(
        color: AppColors.surface.withOpacity(0.75),
        elevation: 0,
        shadowColor: Colors.transparent,
        shape: RoundedRectangleBorder(borderRadius: borderRadiusXl),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: AppColors.onPrimary,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: borderRadiusLg),
          textStyle: textTheme.labelLarge,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primary,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: borderRadiusLg),
          side: const BorderSide(color: AppColors.primary, width: 1.5),
          textStyle: textTheme.labelLarge,
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primary,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(borderRadius: borderRadiusLg),
          textStyle: textTheme.labelLarge,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surfaceVariant,
        border: OutlineInputBorder(
          borderRadius: borderRadiusLg,
          borderSide: const BorderSide(color: AppColors.divider),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: borderRadiusLg,
          borderSide: const BorderSide(color: AppColors.primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: borderRadiusLg,
          borderSide: const BorderSide(color: AppColors.error),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      textTheme: textTheme,
      dividerTheme: const DividerThemeData(
        color: AppColors.divider,
        thickness: 1,
        space: 1,
      ),
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.surfaceVariant,
        selectedColor: AppColors.primaryLight,
        labelStyle: textTheme.labelMedium,
        shape: RoundedRectangleBorder(borderRadius: borderRadiusFull),
        side: BorderSide.none,
      ),
      scaffoldBackgroundColor: AppColors.background,
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.surface,
        elevation: 0,
        type: BottomNavigationBarType.fixed,
      ),
    );
  }

  static ThemeData get darkTheme {
    final textTheme = TextTheme(
      displayLarge: const TextStyle(fontFamily: 'Inter', fontSize: 57, fontWeight: FontWeight.w400, color: Color(0xFFE0E0E0), height: 1.12),
      displayMedium: const TextStyle(fontFamily: 'Inter', fontSize: 45, fontWeight: FontWeight.w400, color: Color(0xFFE0E0E0), height: 1.16),
      displaySmall: const TextStyle(fontFamily: 'Inter', fontSize: 36, fontWeight: FontWeight.w400, color: Color(0xFFE0E0E0), height: 1.22),
      headlineLarge: const TextStyle(fontFamily: 'Inter', fontSize: 32, fontWeight: FontWeight.w700, color: Color(0xFFE0E0E0), height: 1.25),
      headlineMedium: const TextStyle(fontFamily: 'Inter', fontSize: 28, fontWeight: FontWeight.w600, color: Color(0xFFE0E0E0), height: 1.29),
      headlineSmall: const TextStyle(fontFamily: 'Inter', fontSize: 24, fontWeight: FontWeight.w600, color: Color(0xFFE0E0E0), height: 1.33),
      titleLarge: const TextStyle(fontFamily: 'Inter', fontSize: 22, fontWeight: FontWeight.w600, color: Color(0xFFE0E0E0), height: 1.27),
      titleMedium: const TextStyle(fontFamily: 'Inter', fontSize: 16, fontWeight: FontWeight.w500, color: Color(0xFFE0E0E0), height: 1.50),
      titleSmall: const TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w500, color: Color(0xFF9CA3AF), height: 1.43),
      bodyLarge: const TextStyle(fontFamily: 'Inter', fontSize: 16, fontWeight: FontWeight.w400, color: Color(0xFFE0E0E0), height: 1.50),
      bodyMedium: const TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w400, color: Color(0xFFE0E0E0), height: 1.43),
      bodySmall: const TextStyle(fontFamily: 'Inter', fontSize: 12, fontWeight: FontWeight.w400, color: Color(0xFF9CA3AF), height: 1.33),
      labelLarge: const TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w500, color: Color(0xFFE0E0E0), height: 1.43),
      labelMedium: const TextStyle(fontFamily: 'Inter', fontSize: 12, fontWeight: FontWeight.w500, color: Color(0xFF9CA3AF), height: 1.33),
      labelSmall: const TextStyle(fontFamily: 'Inter', fontSize: 10, fontWeight: FontWeight.w500, color: Color(0xFF9CA3AF), height: 1.20),
    );

    return ThemeData(
      useMaterial3: true,
      fontFamily: 'Inter',
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primaryLight,
        brightness: Brightness.dark,
        primary: AppColors.primaryLight,
        onPrimary: AppColors.primaryDark,
        secondary: AppColors.secondaryLight,
        onSecondary: AppColors.primaryDark,
        tertiary: AppColors.tertiary,
        error: AppColors.error,
        onError: Colors.white,
        background: const Color(0xFF121212),
        onBackground: const Color(0xFFE0E0E0),
        surface: const Color(0xFF1E1E1E),
        onSurface: const Color(0xFFE0E0E0),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: const Color(0xFF1E1E1E).withOpacity(0.75),
        foregroundColor: const Color(0xFFE0E0E0),
        elevation: 0,
        centerTitle: true,
        titleTextStyle: textTheme.titleLarge?.copyWith(
          fontWeight: FontWeight.w600,
          color: const Color(0xFFE0E0E0),
        ),
      ),
      cardTheme: CardThemeData(
        color: const Color(0xFF1E1E1E).withOpacity(0.75),
        elevation: 0,
        shadowColor: Colors.transparent,
        shape: RoundedRectangleBorder(borderRadius: borderRadiusXl),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryLight,
          foregroundColor: AppColors.primaryDark,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: borderRadiusLg),
          textStyle: textTheme.labelLarge,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primaryLight,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: borderRadiusLg),
          side: const BorderSide(color: AppColors.primaryLight, width: 1.5),
          textStyle: textTheme.labelLarge,
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primaryLight,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(borderRadius: borderRadiusLg),
          textStyle: textTheme.labelLarge,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFF2C2C2C),
        border: OutlineInputBorder(
          borderRadius: borderRadiusLg,
          borderSide: const BorderSide(color: Color(0xFF424242)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: borderRadiusLg,
          borderSide: const BorderSide(color: AppColors.primaryLight, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: borderRadiusLg,
          borderSide: const BorderSide(color: AppColors.error),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      textTheme: textTheme,
      dividerTheme: const DividerThemeData(
        color: Color(0xFF424242),
        thickness: 1,
        space: 1,
      ),
      chipTheme: ChipThemeData(
        backgroundColor: const Color(0xFF2C2C2C),
        selectedColor: AppColors.primaryLight,
        labelStyle: textTheme.labelMedium,
        shape: RoundedRectangleBorder(borderRadius: borderRadiusFull),
        side: BorderSide.none,
      ),
      scaffoldBackgroundColor: const Color(0xFF121212),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Color(0xFF1E1E1E),
        elevation: 0,
        type: BottomNavigationBarType.fixed,
      ),
    );
  }
}

final themeModeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.system);
