import 'package:flutter/material.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/models/safety_report.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';

class SafetyReportSectionWidget extends StatelessWidget {
  final List<SafetyReport> reports;
  final VoidCallback? onReport;

  const SafetyReportSectionWidget({
    super.key,
    required this.reports,
    this.onReport,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Safety Reports', style: Theme.of(context).textTheme.titleMedium),
            if (onReport != null)
              TextButton.icon(
                onPressed: onReport,
                icon: const Icon(Icons.add, size: 16),
                label: const Text('Report'),
              ),
          ],
        ),
        const SizedBox(height: 12),
        if (reports.isEmpty)
          AppCard(
            padding: const EdgeInsets.all(24),
            child: Center(
              child: Column(
                children: [
                  Icon(Icons.verified_user_outlined, size: 36, color: AppColors.success),
                  const SizedBox(height: 8),
                  Text('No safety incidents reported', style: TextStyle(color: AppColors.success)),
                ],
              ),
            ),
          )
        else
          Column(
            children: reports.map((report) {
              return AppCard(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                child: Row(
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: _getTypeColor(report.type),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(_getTypeIcon(report.type), color: Colors.white, size: 18),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            report.type.toUpperCase(),
                            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                          ),
                          Text(
                            report.description,
                            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: report.status == 'resolved' ? AppColors.success : AppColors.warning,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(report.status, style: const TextStyle(fontSize: 10, color: Colors.white)),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
      ],
    );
  }

  Color _getTypeColor(String type) {
    switch (type.toLowerCase()) {
      case 'theft':
        return AppColors.error;
      case 'noise':
        return AppColors.warning;
      case 'fire':
        return AppColors.error;
      case 'flood':
        return AppColors.info;
      default:
        return AppColors.textSecondary;
    }
  }

  IconData _getTypeIcon(String type) {
    switch (type.toLowerCase()) {
      case 'theft':
        return Icons.warning;
      case 'noise':
        return Icons.volume_up;
      case 'fire':
        return Icons.local_fire_department;
      case 'flood':
        return Icons.water_damage;
      default:
        return Icons.report;
    }
  }
}
