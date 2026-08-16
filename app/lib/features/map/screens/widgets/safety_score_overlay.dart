import 'dart:ui';
import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/neighborhood.dart';

class SafetyScoreOverlay extends StatelessWidget {
  const SafetyScoreOverlay({super.key});

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      ignoring: true,
      child: CustomPaint(
        size: Size.infinite,
        painter: _SafetyHeatmapPainter(),
        child: Container(),
      ),
    );
  }
}

class _SafetyHeatmapPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..maskFilter = const MaskFilter.blur(BlurStyle.normal, 40);
    final spots = [
      _HeatSpot(Offset(size.width * 0.3, size.height * 0.4), 0.9, AppColors.success),
      _HeatSpot(Offset(size.width * 0.6, size.height * 0.3), 0.7, AppColors.success),
      _HeatSpot(Offset(size.width * 0.7, size.height * 0.6), 0.5, AppColors.warning),
      _HeatSpot(Offset(size.width * 0.2, size.height * 0.7), 0.3, AppColors.error),
      _HeatSpot(Offset(size.width * 0.5, size.height * 0.5), 0.8, AppColors.success),
    ];

    for (final spot in spots) {
      final rect = Rect.fromCircle(center: spot.center, radius: size.shortestSide * 0.25);
      paint.shader = RadialGradient(
        colors: [spot.color.withOpacity(0.4), spot.color.withOpacity(0.0)],
        center: Alignment.center,
        radius: 1,
      ).createShader(rect);
      canvas.drawCircle(spot.center, size.shortestSide * 0.25, paint);
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}

class _HeatSpot {
  final Offset center;
  final double score;
  final Color color;

  _HeatSpot(this.center, this.score, this.color);
}
