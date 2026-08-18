import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/models/safety_report.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';

class SafetyReportSection extends ConsumerWidget {
  final String propertyId;

  const SafetyReportSection({
    super.key,
    required this.propertyId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final reportsAsync = ref.watch(safetyReportsProvider(propertyId));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Safety Reports', style: Theme.of(context).textTheme.titleMedium),
            TextButton.icon(
              onPressed: () {},
              icon: Icon(LucideIcons.plus, size: 16),
              label: const Text('Report'),
            ),
          ],
        ),
        const SizedBox(height: 12),
        reportsAsync.when(
          loading: () => const AppCard(
            padding: EdgeInsets.all(40),
            child: Center(child: CircularProgressIndicator()),
          ),
          error: (error, _) => AppCard(
            padding: const EdgeInsets.all(16),
            child: Text('Unable to load safety reports', style: TextStyle(color: AppColors.textSecondary)),
          ),
          data: (reports) {
            if (reports.isEmpty) {
              return AppCard(
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
              );
            }
            return Column(
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
                            Text(report.type.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                            Text(report.description, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary), maxLines: 1, overflow: TextOverflow.ellipsis),
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
            );
          },
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

final safetyReportsProvider = FutureProvider.family<List<SafetyReport>, String>((ref, propertyId) async {
  await Future.delayed(const Duration(milliseconds: 300));
  return [
    SafetyReport(
      id: 'report_1',
      userId: 'user_1',
      neighborhoodId: 'neighborhood_001',
      type: 'noise',
      description: 'Loud music reported in the area',
      status: 'resolved',
      createdAt: DateTime.now().subtract(const Duration(days: 3)),
    ),
    SafetyReport(
      id: 'report_2',
      userId: 'user_2',
      neighborhoodId: 'neighborhood_001',
      type: 'theft',
      description: 'Suspected break-in attempt nearby',
      status: 'investigating',
      createdAt: DateTime.now().subtract(const Duration(days: 7)),
    ),
  ];
});
