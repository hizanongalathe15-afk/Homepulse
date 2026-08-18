import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/neighborhood.dart';
import '../../../../services/community_service.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_toast.dart';

class CommunityGroups extends ConsumerWidget {
  final List<Neighborhood> neighborhoods;
  const CommunityGroups({super.key, required this.neighborhoods});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final groups = <Map<String, dynamic>>[
      {'id': 'g1', 'name': 'Kilimani Residents', 'members': 245, 'description': 'General discussion for Kilimani residents', 'neighborhood': 'Kilimani'},
      {'id': 'g2', 'name': 'Westlands Community', 'members': 189, 'description': 'Westlands neighborhood chat', 'neighborhood': 'Westlands'},
      {'id': 'g3', 'name': 'Karen Estate Watch', 'members': 320, 'description': 'Safety and security updates for Karen', 'neighborhood': 'Karen'},
      {'id': 'g4', 'name': 'Lavington Neighbors', 'members': 156, 'description': 'Local events and recommendations', 'neighborhood': 'Lavington'},
      {'id': 'g5', 'name': 'South B Connect', 'members': 412, 'description': 'Community support and networking', 'neighborhood': 'South B'},
    ];

    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(communityProvider),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: groups.length,
        itemBuilder: (context, index) {
          final group = groups[index];
          return AppCard(
            margin: const EdgeInsets.only(bottom: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(Icons.group_outlined, color: AppColors.primary),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(group['name'] as String, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
                          const SizedBox(height: 2),
                          Text(
                            '${group['members']} members',
                            style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textSecondary),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        AppToast.info(context, 'Joined ${group['name']}');
                      },
                      child: const Text('Join'),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  group['description'] as String,
                  style: theme.textTheme.bodyMedium,
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Icon(Icons.location_on_outlined, size: 16, color: AppColors.textSecondary),
                    const SizedBox(width: 4),
                    Text(group['neighborhood'] as String, style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textSecondary)),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
