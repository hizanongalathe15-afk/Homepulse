import 'dart:math';
import 'package:flutter/material.dart';

class AppSkeleton extends StatefulWidget {
  final double? width;
  final double height;
  final BorderRadius borderRadius;
  final bool isCircle;

  const AppSkeleton({
    super.key,
    this.width,
    this.height = 16,
    this.borderRadius = const BorderRadius.all(Radius.circular(8)),
    this.isCircle = false,
  });

  const AppSkeleton.circle({
    super.key,
    double size = 40,
  })  : width = size,
        height = size,
        borderRadius = BorderRadius.circular(size / 2),
        isCircle = true;

  const AppSkeleton.text({
    super.key,
    this.width,
    this.height = 16,
  })  : borderRadius = const BorderRadius.all(Radius.circular(4)),
        isCircle = false;

  const AppSkeleton.title({
    super.key,
    this.width,
    this.height = 24,
  })  : borderRadius = const BorderRadius.all(Radius.circular(6)),
        isCircle = false;

  @override
  State<AppSkeleton> createState() => _AppSkeletonState();
}

class _AppSkeletonState extends State<AppSkeleton> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final baseColor = theme.colorScheme.surfaceContainerHighest;
    final highlightColor = theme.colorScheme.surfaceContainerHighest.withOpacity(0.5);

    final stops = [
      (_animationController.value - 0.5).clamp(0.0, 1.0),
      _animationController.value.clamp(0.0, 1.0),
      (_animationController.value + 0.5).clamp(0.0, 1.0),
    ];

    return AnimatedBuilder(
      animation: _animationController,
      builder: (context, child) {
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            borderRadius: widget.isCircle ? null : widget.borderRadius,
            shape: widget.isCircle ? BoxShape.circle : BoxShape.rectangle,
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [baseColor, highlightColor, baseColor],
              stops: stops,
            ),
          ),
        );
      },
    );
  }
}

class AppCardSkeleton extends StatelessWidget {
  final bool hasImage;
  final bool hasTextLines;
  final int textLines;

  const AppCardSkeleton({
    super.key,
    this.hasImage = true,
    this.hasTextLines = true,
    this.textLines = 3,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (hasImage)
            AppSkeleton(
              width: double.infinity,
              height: 180,
              borderRadius: const BorderRadius.all(Radius.circular(12)),
            ),
          if (hasImage) const SizedBox(height: 16),
          AppSkeleton(width: double.infinity, height: 24, borderRadius: const BorderRadius.all(Radius.circular(6))),
          const SizedBox(height: 12),
          if (hasTextLines)
            ...List.generate(textLines, (index) {
              return Padding(
                padding: EdgeInsets.only(bottom: index < textLines - 1 ? 8 : 0),
                child: AppSkeleton(
                  width: index == textLines - 1 ? null : double.infinity,
                  height: 16,
                  borderRadius: const BorderRadius.all(Radius.circular(4)),
                ),
              );
            }),
        ],
      ),
    );
  }
}
