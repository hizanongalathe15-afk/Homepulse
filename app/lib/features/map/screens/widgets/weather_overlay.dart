import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class WeatherOverlay extends StatelessWidget {
  const WeatherOverlay({super.key});

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: 100,
      left: 16,
      child: IgnorePointer(
        ignoring: true,
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.surface.withOpacity(0.9),
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Row(
            children: [
              const Icon(Icons.wb_sunny, color: AppColors.warning, size: 28),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('24C', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  Text('Partly Cloudy', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
