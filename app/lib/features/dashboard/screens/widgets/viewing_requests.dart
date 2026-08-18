import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../core/utils/formatters.dart';

class ViewingRequests extends ConsumerWidget {
  final String userId;
  const ViewingRequests({super.key, required this.userId});

  static final List<Map<String, dynamic>> _requests = [
    {'id': 'vr1', 'userName': 'Alice Mwangi', 'property': '2BR Apartment - Kilimani', 'date': DateTime.now().add(const Duration(days: 1)), 'time': '10:00 AM', 'status': 'pending', 'rating': 4.5},
    {'id': 'vr2', 'userName': 'James Kipchoge', 'property': 'Studio - Westlands', 'date': DateTime.now().add(const Duration(days: 3)), 'time': '2:00 PM', 'status': 'confirmed', 'rating': 4.0},
    {'id': 'vr3', 'userName': 'Sarah Njeri', 'property': '3BR House - Karen', 'date': DateTime.now().subtract(const Duration(days: 1)), 'time': '11:00 AM', 'status': 'completed', 'rating': 5.0},
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final pending = _requests.where((r) => r['status'] == 'pending').toList();
    final confirmed = _requests.where((r) => r['status'] == 'confirmed').toList();

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Viewing Requests', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
              TextButton(
                onPressed: () {
                  AppToast.info(context, 'View all requests');
                },
                child: const Text('View All'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.warning.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    children: [
                      Text('${pending.length}', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.warning)),
                      Text('Pending', style: theme.textTheme.bodySmall?.copyWith(color: AppColors.warning)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.success.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    children: [
                      Text('${confirmed.length}', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.success)),
                      Text('Confirmed', style: theme.textTheme.bodySmall?.copyWith(color: AppColors.success)),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (_requests.isEmpty)
            Center(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text('No viewing requests', style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary)),
              ),
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _requests.length,
              separatorBuilder: (context, index) => const Divider(),
              itemBuilder: (context, index) {
                final request = _requests[index];
                return ListTile(
                  dense: true,
                  leading: CircleAvatar(
                    radius: 20,
                    backgroundColor: AppColors.primary,
                    child: Text((request['userName'] as String)[0].toUpperCase(), style: const TextStyle(color: Colors.white, fontSize: 14)),
                  ),
                  title: Text(request['property'] as String),
                  subtitle: Text('${request['userName']} - ${formatDate(request['date'] as DateTime)} at ${request['time']}'),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (request['status'] == 'pending') ...[
                        IconButton(
                          onPressed: () {
                            AppToast.success(context, 'Request accepted');
                          },
                          icon: const Icon(Icons.check_circle, color: AppColors.success),
                        ),
                        IconButton(
                          onPressed: () {
                            AppToast.error(context, 'Request declined');
                          },
                          icon: const Icon(Icons.cancel, color: AppColors.error),
                        ),
                      ] else if (request['status'] == 'confirmed')
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.success.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text('Confirmed', style: TextStyle(fontSize: 11, color: AppColors.success)),
                        )
                      else
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.textSecondary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text('Completed', style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                        ),
                    ],
                  ),
                );
              },
            ),
        ],
      ),
    );
  }
}
