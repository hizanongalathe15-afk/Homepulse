import 'dart:async';
import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class TypingIndicator extends StatefulWidget {
  final int dotCount;
  final Duration animationDuration;

  const TypingIndicator({
    super.key,
    this.dotCount = 3,
    this.animationDuration = const Duration(milliseconds: 1400),
  });

  @override
  State<TypingIndicator> createState() => _TypingIndicatorState();
}

class _TypingIndicatorState extends State<TypingIndicator> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late List<Animation<double>> _animations;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.animationDuration)..repeat();
    _animations = List.generate(widget.dotCount, (index) {
      final start = index / widget.dotCount;
      final end = start + 1 / widget.dotCount;
      return Tween<double>(begin: 0.3, end: 1.0).animate(
        CurvedAnimation(parent: _controller, curve: Interval(start, end, curve: Curves.easeInOut)),
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
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(widget.dotCount, (index) {
        return AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 2),
              child: Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  color: AppColors.textSecondary.withOpacity(_animations[index].value),
                  shape: BoxShape.circle,
                ),
              ),
            );
          },
        );
      }),
    );
  }
}
