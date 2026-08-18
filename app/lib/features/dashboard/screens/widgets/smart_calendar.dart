import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/app_toast.dart';

class SmartCalendar extends ConsumerWidget {
  final String userId;
  const SmartCalendar({super.key, required this.userId});

  static final List<Map<String, dynamic>> _viewings = [
    {'id': 'v1', 'property': '2BR Apartment - Kilimani', 'date': DateTime.now().add(const Duration(days: 2)), 'time': '10:00 AM', 'status': 'confirmed'},
    {'id': 'v2', 'property': 'Studio - Westlands', 'date': DateTime.now().add(const Duration(days: 5)), 'time': '2:00 PM', 'status': 'pending'},
    {'id': 'v3', 'property': '3BR House - Karen', 'date': DateTime.now().subtract(const Duration(days: 1)), 'time': '11:00 AM', 'status': 'completed'},
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final today = DateTime.now();
    final thisWeek = _viewings.where((v) {
      final d = v['date'] as DateTime;
      return d.isAfter(today.subtract(const Duration(days: 1))) && d.isBefore(today.add(const Duration(days: 7)));
    }).toList();

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Smart Calendar', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
              TextButton(
                onPressed: () {
                  AppToast.info(context, 'Open full calendar');
                },
                child: const Text('Calendar'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (thisWeek.isEmpty)
            Center(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text('No viewings this week', style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary)),
              ),
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: thisWeek.length,
              separatorBuilder: (context, index) => const Divider(),
              itemBuilder: (context, index) {
                final viewing = thisWeek[index];
                final date = viewing['date'] as DateTime;
                final isToday = date.year == today.year && date.month == today.month && date.day == today.day;
                return ListTile(
                  dense: true,
                  leading: Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: isToday ? AppColors.primary.withOpacity(0.1) : AppColors.background,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          DateFormat('MMM').format(date),
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isToday ? AppColors.primary : AppColors.textSecondary),
                        ),
                        Text(
                          DateFormat('dd').format(date),
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: isToday ? AppColors.primary : AppColors.textPrimary),
                        ),
                      ],
                    ),
                  ),
                  title: Text(viewing['property'] as String),
                  subtitle: Text(viewing['time'] as String),
                  trailing: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: viewing['status'] == 'confirmed' ? AppColors.success.withOpacity(0.1) : viewing['status'] == 'pending' ? AppColors.warning.withOpacity(0.1) : AppColors.textSecondary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      viewing['status'] as String,
                      style: TextStyle(fontSize: 11, color: viewing['status'] == 'confirmed' ? AppColors.success : viewing['status'] == 'pending' ? AppColors.warning : AppColors.textSecondary),
                    ),
                  ),
                );
              },
            ),
          const SizedBox(height: 16),
          AppButton(
            text: 'Schedule Viewing',
            onPressed: () {
              AppToast.info(context, 'Schedule a property viewing');
            },
          ),
        ],
      ),
    );
  }
}
