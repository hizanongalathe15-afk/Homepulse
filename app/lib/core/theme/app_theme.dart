import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app_colors.dart';
import 'package:homepulse/models/system_theme.dart';

class AppTheme {
  AppTheme._();

  static BorderRadius get borderRadiusLg => const BorderRadius.all(Radius.circular(12));
  static BorderRadius get borderRadiusXl => const BorderRadius.all(Radius.circular(16));
  static BorderRadius get borderRadiusFull => const BorderRadius.all(Radius.circular(999));

  static BorderRadius get radiusMd => const BorderRadius.all(Radius.circular(8));
  static BorderRadius get radiusLg => const BorderRadius.all(Radius.circular(12));
  static BorderRadius get radiusXl => const BorderRadius.all(Radius.circular(16));
  static BorderRadius get radius2xl => const BorderRadius.all(Radius.circular(20));
  static BorderRadius get radius3xl => const BorderRadius.all(Radius.circular(24));
  static BorderRadius get radiusFull => const BorderRadius.all(Radius.circular(999));

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

  static Color _cc(Map<String, String> c, String key, String fallback) {
    return hexToColor(c[key] ?? fallback);
  }

  static Map<String, String> _lightColors(SystemThemeConfig config) => config.colors;

  static Map<String, String> _darkColors(SystemThemeConfig config) {
    final c = Map<String, String>.from(config.colors);
    c.addAll({
      'background': '#121212',
      'surface': '#1E1E1E',
      'surfaceVariant': '#2C2C2C',
      'onBackground': '#E0E0E0',
      'onSurface': '#E0E0E0',
      'onError': '#FFFFFF',
      'textPrimary': '#E0E0E0',
      'textSecondary': '#9CA3AF',
      'textTertiary': '#6B7280',
      'divider': '#424242',
    });
    return c;
  }

  static ThemeData generateLightTheme(SystemThemeConfig config) {
    final c = _lightColors(config);

    final textTheme = _buildTextTheme(
      _cc(c, 'textPrimary', '#1A1A1A'),
      _cc(c, 'textPrimary', '#1A1A1A'),
      _cc(c, 'textSecondary', '#6B7280'),
      _cc(c, 'textTertiary', '#9CA3AF'),
    );

    return ThemeData(
      useMaterial3: true,
      fontFamily: config.typography?['fontFamily'] as String? ?? 'Inter',
      colorScheme: ColorScheme.fromSeed(
        seedColor: _cc(c, 'primary', '#1A5276'),
        brightness: Brightness.light,
        primary: _cc(c, 'primary', '#1A5276'),
        onPrimary: _cc(c, 'onPrimary', '#FFFFFF'),
        secondary: _cc(c, 'secondary', '#2E86C1'),
        onSecondary: _cc(c, 'onSecondary', '#FFFFFF'),
        tertiary: _cc(c, 'tertiary', '#F39C12'),
        error: _cc(c, 'error', '#E53935'),
        onError: _cc(c, 'onError', '#FFFFFF'),
        background: _cc(c, 'background', '#FAFAFA'),
        onBackground: _cc(c, 'onBackground', '#1A1A1A'),
        surface: _cc(c, 'surface', '#FFFFFF'),
        onSurface: _cc(c, 'onSurface', '#1A1A1A'),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: _cc(c, 'primary', '#1A5276').withOpacity(0.75),
        foregroundColor: _cc(c, 'onPrimary', '#FFFFFF'),
        elevation: 0,
        centerTitle: true,
        titleTextStyle: textTheme.titleLarge?.copyWith(
          fontWeight: FontWeight.w600,
          color: _cc(c, 'onPrimary', '#FFFFFF'),
        ),
      ),
      cardTheme: CardThemeData(
        color: _cc(c, 'surface', '#FFFFFF').withOpacity(0.75),
        elevation: 0,
        shadowColor: Colors.transparent,
        shape: RoundedRectangleBorder(borderRadius: borderRadiusXl),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: _cc(c, 'primary', '#1A5276'),
          foregroundColor: _cc(c, 'onPrimary', '#FFFFFF'),
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: borderRadiusLg),
          textStyle: textTheme.labelLarge,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: _cc(c, 'primary', '#1A5276'),
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: borderRadiusLg),
          side: BorderSide(color: _cc(c, 'primary', '#1A5276'), width: 1.5),
          textStyle: textTheme.labelLarge,
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: _cc(c, 'primary', '#1A5276'),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(borderRadius: borderRadiusLg),
          textStyle: textTheme.labelLarge,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: _cc(c, 'surfaceVariant', '#F0F2F5'),
        border: OutlineInputBorder(
          borderRadius: borderRadiusLg,
          borderSide: BorderSide(color: _cc(c, 'divider', '#E5E7EB')),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: borderRadiusLg,
          borderSide: BorderSide(color: _cc(c, 'primary', '#1A5276'), width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: borderRadiusLg,
          borderSide: BorderSide(color: _cc(c, 'error', '#E53935')),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      textTheme: textTheme,
      dividerTheme: DividerThemeData(
        color: _cc(c, 'divider', '#E5E7EB'),
        thickness: 1,
        space: 1,
      ),
      chipTheme: ChipThemeData(
        backgroundColor: _cc(c, 'surfaceVariant', '#F0F2F5'),
        selectedColor: _cc(c, 'primaryLight', '#2E86C1'),
        labelStyle: textTheme.labelMedium,
        shape: RoundedRectangleBorder(borderRadius: borderRadiusFull),
        side: BorderSide.none,
      ),
      scaffoldBackgroundColor: _cc(c, 'background', '#FAFAFA'),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: _cc(c, 'surface', '#FFFFFF'),
        elevation: 0,
        type: BottomNavigationBarType.fixed,
      ),
      progressIndicatorTheme: ProgressIndicatorThemeData(
        color: _cc(c, 'primary', '#1A5276'),
      ),
      scrollbarTheme: ScrollbarThemeData(
        thumbColor: WidgetStateProperty.all(
          _cc(c, 'textTertiary', '#9CA3AF').withOpacity(0.3),
        ),
      ),
    );
  }

  static ThemeData generateDarkTheme(SystemThemeConfig config) {
    final c = _darkColors(config);

    final textTheme = _buildTextTheme(
      _cc(c, 'textPrimary', '#1A1A1A'),
      _cc(c, 'textPrimary', '#1A1A1A'),
      _cc(c, 'textSecondary', '#6B7280'),
      _cc(c, 'textTertiary', '#9CA3AF'),
    );

    return ThemeData(
      useMaterial3: true,
      fontFamily: config.typography?['fontFamily'] as String? ?? 'Inter',
      colorScheme: ColorScheme.fromSeed(
        seedColor: _cc(c, 'primaryLight', '#2E86C1'),
        brightness: Brightness.dark,
        primary: _cc(c, 'primaryLight', '#2E86C1'),
        onPrimary: _cc(c, 'primaryDark', '#0E2F44'),
        secondary: _cc(c, 'secondaryLight', '#5DADE2'),
        onSecondary: _cc(c, 'primaryDark', '#0E2F44'),
        tertiary: _cc(c, 'tertiary', '#F39C12'),
        error: _cc(c, 'error', '#E53935'),
        onError: Colors.white,
        background: _cc(c, 'background', '#FAFAFA'),
        onBackground: _cc(c, 'onBackground', '#1A1A1A'),
        surface: _cc(c, 'surface', '#FFFFFF'),
        onSurface: _cc(c, 'onSurface', '#1A1A1A'),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: _cc(c, 'surface', '#FFFFFF').withOpacity(0.75),
        foregroundColor: _cc(c, 'onBackground', '#1A1A1A'),
        elevation: 0,
        centerTitle: true,
        titleTextStyle: textTheme.titleLarge?.copyWith(
          fontWeight: FontWeight.w600,
          color: _cc(c, 'onBackground', '#1A1A1A'),
        ),
      ),
      cardTheme: CardThemeData(
        color: _cc(c, 'surface', '#FFFFFF').withOpacity(0.75),
        elevation: 0,
        shadowColor: Colors.transparent,
        shape: RoundedRectangleBorder(borderRadius: borderRadiusXl),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: _cc(c, 'primaryLight', '#2E86C1'),
          foregroundColor: _cc(c, 'primaryDark', '#0E2F44'),
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: borderRadiusLg),
          textStyle: textTheme.labelLarge,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: _cc(c, 'primaryLight', '#2E86C1'),
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: borderRadiusLg),
          side: BorderSide(color: _cc(c, 'primaryLight', '#2E86C1'), width: 1.5),
          textStyle: textTheme.labelLarge,
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: _cc(c, 'primaryLight', '#2E86C1'),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(borderRadius: borderRadiusLg),
          textStyle: textTheme.labelLarge,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: _cc(c, 'surfaceVariant', '#2C2C2C'),
        border: OutlineInputBorder(
          borderRadius: borderRadiusLg,
          borderSide: BorderSide(color: _cc(c, 'divider', '#424242')),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: borderRadiusLg,
          borderSide: BorderSide(color: _cc(c, 'primaryLight', '#2E86C1'), width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: borderRadiusLg,
          borderSide: BorderSide(color: _cc(c, 'error', '#E53935')),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      textTheme: textTheme,
      dividerTheme: DividerThemeData(
        color: _cc(c, 'divider', '#424242'),
        thickness: 1,
        space: 1,
      ),
      chipTheme: ChipThemeData(
        backgroundColor: _cc(c, 'surfaceVariant', '#2C2C2C'),
        selectedColor: _cc(c, 'primaryLight', '#2E86C1'),
        labelStyle: textTheme.labelMedium,
        shape: RoundedRectangleBorder(borderRadius: borderRadiusFull),
        side: BorderSide.none,
      ),
      scaffoldBackgroundColor: _cc(c, 'background', '#121212'),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: _cc(c, 'surface', '#1E1E1E'),
        elevation: 0,
        type: BottomNavigationBarType.fixed,
      ),
      progressIndicatorTheme: ProgressIndicatorThemeData(
        color: _cc(c, 'primaryLight', '#2E86C1'),
      ),
      scrollbarTheme: ScrollbarThemeData(
        thumbColor: WidgetStateProperty.all(
          _cc(c, 'textTertiary', '#9CA3AF').withOpacity(0.3),
        ),
      ),
    );
  }

  static TextTheme _buildTextTheme(
    Color textPrimary,
    Color onPrimary,
    Color textSecondary,
    Color textTertiary,
  ) {
    return TextTheme(
      displayLarge: TextStyle(fontFamily: 'Inter', fontSize: 57, fontWeight: FontWeight.w400, color: textPrimary, height: 1.12),
      displayMedium: TextStyle(fontFamily: 'Inter', fontSize: 45, fontWeight: FontWeight.w400, color: textPrimary, height: 1.16),
      displaySmall: TextStyle(fontFamily: 'Inter', fontSize: 36, fontWeight: FontWeight.w400, color: textPrimary, height: 1.22),
      headlineLarge: TextStyle(fontFamily: 'Inter', fontSize: 32, fontWeight: FontWeight.w700, color: textPrimary, height: 1.25),
      headlineMedium: TextStyle(fontFamily: 'Inter', fontSize: 28, fontWeight: FontWeight.w600, color: textPrimary, height: 1.29),
      headlineSmall: TextStyle(fontFamily: 'Inter', fontSize: 24, fontWeight: FontWeight.w600, color: textPrimary, height: 1.33),
      titleLarge: TextStyle(fontFamily: 'Inter', fontSize: 22, fontWeight: FontWeight.w600, color: textPrimary, height: 1.27),
      titleMedium: TextStyle(fontFamily: 'Inter', fontSize: 16, fontWeight: FontWeight.w500, color: textPrimary, height: 1.50),
      titleSmall: TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w500, color: textSecondary, height: 1.43),
      bodyLarge: TextStyle(fontFamily: 'Inter', fontSize: 16, fontWeight: FontWeight.w400, color: textPrimary, height: 1.50),
      bodyMedium: TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w400, color: textPrimary, height: 1.43),
      bodySmall: TextStyle(fontFamily: 'Inter', fontSize: 12, fontWeight: FontWeight.w400, color: textSecondary, height: 1.33),
      labelLarge: TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w500, color: textPrimary, height: 1.43),
      labelMedium: TextStyle(fontFamily: 'Inter', fontSize: 12, fontWeight: FontWeight.w500, color: textSecondary, height: 1.33),
      labelSmall: TextStyle(fontFamily: 'Inter', fontSize: 10, fontWeight: FontWeight.w500, color: textSecondary, height: 1.20),
    );
  }

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
}

final themeModeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.system);
