import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_theme.dart';

class RenterResumeWidget extends StatelessWidget {
  final int reliabilityScore;
  final int completedRentals;
  final double paymentHistoryScore;
  final int onTimePayments;
  final int totalPayments;

  const RenterResumeWidget({
    super.key,
    required this.reliabilityScore,
    required this.completedRentals,
    required this.paymentHistoryScore,
    required this.onTimePayments,
    required this.totalPayments,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.primary.withOpacity(0.05), AppColors.secondary.withOpacity(0.05)],
        ),
        borderRadius: AppTheme.borderRadiusLg,
        border: Border.all(color: AppColors.primary.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.badge, color: AppColors.primary),
              const SizedBox(width: 8),
              Text('Renter Resume', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildMetricCard(context, 'Reliability', '$reliabilityScore/100', Icons.star, AppColors.warning),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildMetricCard(context, 'Completed', '$completedRentals', Icons.check_circle, AppColors.success),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildMetricCard(context, 'Payment Score', '${(paymentHistoryScore * 100).toInt()}%', Icons.payments, AppColors.info),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildMetricCard(context, 'On-Time', '$onTimePayments/$totalPayments', Icons.schedule, AppColors.success),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCard(BuildContext context, String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 4),
          Text(value, style: TextStyle(fontWeight: FontWeight.bold, color: color, fontSize: 16)),
          Text(label, style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
        ],
      ),
    );
  }
}
