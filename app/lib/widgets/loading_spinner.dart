import 'dart:math';
import 'package:flutter/material.dart';

class LoadingSpinner extends StatelessWidget {
  final double size;
  final Color? color;
  final double strokeWidth;
  final String? semanticLabel;

  const LoadingSpinner({
    super.key,
    this.size = 40.0,
    this.color,
    this.strokeWidth = 4.0,
    this.semanticLabel,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final effectiveColor = color ?? theme.colorScheme.primary;

    return SizedBox(
      width: size,
      height: size,
      child: Semantics(
        label: semanticLabel ?? 'Loading',
        child: CircularProgressIndicator(
          strokeWidth: strokeWidth,
          valueColor: AlwaysStoppedAnimation<Color>(effectiveColor),
        ),
      ),
    );
  }
}

class LoadingSpinnerDots extends StatefulWidget {
  final int dotCount;
  final double dotSize;
  final Color? color;
  final String? semanticLabel;

  const LoadingSpinnerDots({
    super.key,
    this.dotCount = 3,
    this.dotSize = 8.0,
    this.color,
    this.semanticLabel,
  });

  @override
  State<LoadingSpinnerDots> createState() => _LoadingSpinnerDotsState();
}

class _LoadingSpinnerDotsState extends State<LoadingSpinnerDots>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late List<Animation<double>> _animations;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    )..repeat();

    _animations = List.generate(widget.dotCount, (index) {
      final start = index / widget.dotCount;
      return Tween<double>(begin: 0.3, end: 1.0).animate(
        CurvedAnimation(
          parent: _controller,
          curve: Interval(start, start + 0.5, curve: Curves.easeInOut),
        ),
      );
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final effectiveColor = widget.color ?? theme.colorScheme.primary;

    return Semantics(
      label: widget.semanticLabel ?? 'Loading',
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: List.generate(widget.dotCount, (index) {
          return AnimatedBuilder(
            animation: _animations[index],
            builder: (context, child) {
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 4),
                width: widget.dotSize,
                height: widget.dotSize,
                decoration: BoxDecoration(
                  color: effectiveColor.withOpacity(_animations[index].value),
                  shape: BoxShape.circle,
                ),
              );
            },
          );
        }),
      ),
    );
  }
}
