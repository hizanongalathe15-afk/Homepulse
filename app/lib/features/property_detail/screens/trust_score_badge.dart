import 'package:flutter/material.dart';
import 'package:homepulse/core/theme/app_colors.dart';

class TrustScoreBadge extends StatelessWidget {
  final double score;
  final double size;

  const TrustScoreBadge({
    super.key,
    required this.score,
    this.size = 80,
  });

  @override
  Widget build(BuildContext context) {
    final normalizedScore = score.clamp(0.0, 5.0);
    final percentage = normalizedScore / 5.0;
    final color = _getScoreColor(normalizedScore);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Trust Score', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 12),
        AppCard(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              SizedBox(
                width: size,
                height: size,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: size,
                      height: size,
                      child: CircularProgressIndicator(
                        value: percentage,
                        strokeWidth: 6,
                        backgroundColor: AppColors.divider,
                        valueColor: AlwaysStoppedAnimation<Color>(color),
                      ),
                    ),
                    Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          normalizedScore.toStringAsFixed(1),
                          style: TextStyle(fontSize: size * 0.35, fontWeight: FontWeight.bold, color: color),
                        ),
                        Text('Score', style: TextStyle(fontSize: size * 0.15, color: AppColors.textSecondary)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(_getScoreLabel(normalizedScore), style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16, color: color)),
                    const SizedBox(height: 4),
                    Text(_getScoreDescription(normalizedScore), style: TextStyle(fontSize: 13, color: AppColors.textSecondary)),
                    const SizedBox(height: 8),
                    LinearProgressIndicator(
                      value: percentage,
                      backgroundColor: AppColors.divider,
                      valueColor: AlwaysStoppedAnimation<Color>(color),
                      minHeight: 6,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Color _getScoreColor(double score) {
    if (score >= 4.5) return AppColors.success;
    if (score >= 3.5) return AppColors.info;
    if (score >= 2.5) return AppColors.warning;
    return AppColors.error;
  }

  String _getScoreLabel(double score) {
    if (score >= 4.5) return 'Excellent';
    if (score >= 3.5) return 'Good';
    if (score >= 2.5) return 'Fair';
    if (score >= 1.5) return 'Poor';
    return 'Very Poor';
  }

  String _getScoreDescription(double score) {
    if (score >= 4.5) return 'Highly trusted landlord with excellent history';
    if (score >= 3.5) return 'Generally positive feedback from tenants';
    if (score >= 2.5) return 'Mixed reviews, proceed with caution';
    if (score >= 1.5) return 'Several concerns reported';
    return 'Significant issues reported by tenants';
  }
}
