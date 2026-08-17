import 'dart:ui';
import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';

class GlassContainer extends StatelessWidget {
  final Widget child;
  final double? borderRadius;
  final Color? backgroundColor;
  final double borderOpacity;
  final double blurSigma;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final Border? border;
  final BoxShadow? boxShadow;
  final bool withGlow;
  final Color? glowColor;
  final VoidCallback? onTap;
  final double? width;
  final double? height;

  const GlassContainer({
    super.key,
    required this.child,
    this.borderRadius,
    this.backgroundColor,
    this.borderOpacity = 0.1,
    this.blurSigma = 12,
    this.padding,
    this.margin,
    this.border,
    this.boxShadow,
    this.withGlow = false,
    this.glowColor,
    this.onTap,
    this.width,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final resolvedBackgroundColor = backgroundColor ??
        (isDark
            ? AppColors.surface.withOpacity(0.12)
            : AppColors.surface.withOpacity(0.25));
    final resolvedBorderColor = isDark
        ? Colors.white.withOpacity(borderOpacity)
        : Colors.white.withOpacity(borderOpacity * 2);
    final resolvedBorderRadius = borderRadius ?? 16.0;

    final resolvedBoxShadow = boxShadow ??
        BoxShadow(
          color: Colors.black.withOpacity(isDark ? 0.3 : 0.08),
          blurRadius: 24,
          offset: const Offset(0, 8),
        );

    final resolvedGlow = withGlow
        ? BoxShadow(
            color: (glowColor ?? AppColors.primary).withOpacity(0.25),
            blurRadius: 24,
            spreadRadius: 1,
          )
        : const BoxShadow(color: Colors.transparent);

    final effectivePadding = padding ?? const EdgeInsets.all(0);

    return GestureDetector(
      onTap: onTap,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(resolvedBorderRadius),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: blurSigma, sigmaY: blurSigma),
          child: Container(
            width: width,
            height: height,
            margin: margin,
            padding: effectivePadding,
            decoration: BoxDecoration(
              color: resolvedBackgroundColor,
              borderRadius: BorderRadius.circular(resolvedBorderRadius),
              border: border ??
                  Border.all(
                    color: resolvedBorderColor,
                    width: 1,
                  ),
              boxShadow: [resolvedBoxShadow, resolvedGlow],
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}

class GlassAppBar extends StatelessWidget implements PreferredSizeWidget {
  final Widget? title;
  final List<Widget>? actions;
  final Widget? leading;
  final double height;

  const GlassAppBar({
    super.key,
    this.title,
    this.actions,
    this.leading,
    this.height = 64,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: const BorderRadius.vertical(
        bottom: Radius.circular(20),
      ),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
        child: AppBar(
          backgroundColor: Theme.of(context).colorScheme.surface.withOpacity(0.25),
          foregroundColor: Theme.of(context).colorScheme.onSurface,
          elevation: 0,
          toolbarHeight: height,
          title: title,
          actions: actions,
          leading: leading,
          bottom: PreferredSize(
            preferredSize: const Size.fromHeight(1),
            child: Container(
              width: double.infinity,
              height: 1,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Colors.transparent,
                    Colors.white.withOpacity(0.1),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(height);
}
