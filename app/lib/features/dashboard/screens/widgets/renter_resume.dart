import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../services/lease_service.dart';
import '../../../../services/review_service.dart' as app_review;

class RenterResume extends ConsumerWidget {
  final String userId;
  const RenterResume({super.key, required this.userId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final authState = ref.watch(authProvider);
    final leasesAsync = ref.watch(tenantLeasesProvider(userId));
    final reviewsAsync = ref.watch(app_review.userReviewsProvider(userId));

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Renter Resume', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
              TextButton(
                onPressed: () {
                  AppToast.info(context, 'View full rental history');
                },
                child: const Text('View All'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          authState.when(
            loading: () => const Center(child: LoadingSpinner(size: 24)),
            error: (error, _) => const Text('Failed to load'),
            data: (user) {
              if (user == null) return const Text('Not logged in');
              return Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: leasesAsync.when(
                          loading: () => const _ResumeStat(label: 'Active Leases', value: '...', icon: Icons.home_outlined),
                          error: (_, __) => const _ResumeStat(label: 'Active Leases', value: '0', icon: Icons.home_outlined),
                          data: (leases) {
                            final activeLeases = leases.where((l) => l.status == 'active').length;
                            return _ResumeStat(label: 'Active Leases', value: '$activeLeases', icon: Icons.home_outlined);
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: leasesAsync.when(
                          loading: () => const _ResumeStat(label: 'Total Leases', value: '...', icon: Icons.description_outlined),
                          error: (_, __) => const _ResumeStat(label: 'Total Leases', value: '0', icon: Icons.description_outlined),
                          data: (leases) {
                            return _ResumeStat(label: 'Total Leases', value: '${leases.length}', icon: Icons.description_outlined);
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: reviewsAsync.when(
                          loading: () => const _ResumeStat(label: 'Avg Rating', value: '...', icon: Icons.star_outline),
                          error: (_, __) => const _ResumeStat(label: 'Avg Rating', value: '0', icon: Icons.star_outline),
                          data: (reviews) {
                            final avgRating = reviews.isNotEmpty
                                ? reviews.map((r) => r.rating).reduce((a, b) => a + b) / reviews.length
                                : 0.0;
                            return _ResumeStat(label: 'Avg Rating', value: avgRating.toStringAsFixed(1), icon: Icons.star_outline);
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 8),
                  Text('Recent Leases', style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  leasesAsync.when(
                    loading: () => const Center(child: LoadingSpinner(size: 24)),
                    error: (error, _) => Text('Error: $error'),
                    data: (leases) {
                      if (leases.isEmpty) {
                        return const Text('No leases yet', style: TextStyle(color: AppColors.textSecondary));
                      }
                      return ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: leases.length > 5 ? 5 : leases.length,
                        separatorBuilder: (context, index) => const Divider(),
                        itemBuilder: (context, index) {
                          final lease = leases[index];
                          return ListTile(
                            dense: true,
                            leading: Icon(
                              lease.status == 'active' ? Icons.home_work : Icons.home,
                              color: lease.status == 'active' ? AppColors.primary : AppColors.textSecondary,
                            ),
                            title: Text('Property ${lease.propertyId}'),
                            subtitle: Text('${formatDate(lease.startDate)} - ${formatDate(lease.endDate)}'),
                            trailing: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: lease.status == 'active' ? AppColors.success.withOpacity(0.1) : AppColors.textSecondary.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                lease.status,
                                style: TextStyle(fontSize: 11, color: lease.status == 'active' ? AppColors.success : AppColors.textSecondary),
                              ),
                            ),
                          );
                        },
                      );
                    },
                  ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

class _ResumeStat extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  const _ResumeStat({required this.label, required this.value, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 20, color: AppColors.primary),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
      ],
    );
  }
}
