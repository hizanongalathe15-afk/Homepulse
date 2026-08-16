import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/lease.dart';
import '../../../../models/review.dart';
import '../../../../models/user.dart';
import '../../../../state/auth_provider.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../widgets/loading_spinner.dart';
import '../../../../widgets/rating_stars.dart';
import '../../../../core/utils/formatters.dart';

class RenterResume extends ConsumerWidget {
  final String userId;
  const RenterResume({super.key, required this.userId});

  static final List<Lease> _mockLeases = [
    Lease(
      id: 'lease_1',
      propertyId: 'prop_1',
      tenantId: 'tenant_1',
      landlordId: 'landlord_1',
      startDate: DateTime(2023, 1, 1),
      endDate: DateTime(2024, 1, 1),
      amount: 45000,
      currency: 'KES',
      status: 'active',
      createdAt: DateTime(2022, 12, 15),
    ),
    Lease(
      id: 'lease_2',
      propertyId: 'prop_2',
      tenantId: 'tenant_1',
      landlordId: 'landlord_2',
      startDate: DateTime(2022, 1, 1),
      endDate: DateTime(2023, 1, 1),
      amount: 40000,
      currency: 'KES',
      status: 'completed',
      createdAt: DateTime(2021, 12, 15),
    ),
  ];

  static final List<Review> _mockReviews = [
    Review(id: 'r1', propertyId: 'prop_1', userId: 'tenant_1', userName: 'You', rating: 5, comment: 'Great place, highly recommended!', createdAt: DateTime.now().subtract(const Duration(days: 30))),
    Review(id: 'r2', propertyId: 'prop_3', userId: 'tenant_1', userName: 'You', rating: 4, comment: 'Nice neighborhood and amenities.', createdAt: DateTime.now().subtract(const Duration(days: 60))),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final authState = ref.watch(authProvider);

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
              final totalLeases = _mockLeases.length;
              final activeLeases = _mockLeases.where((l) => l.status == 'active').length;
              final avgRating = _mockReviews.isNotEmpty ? _mockReviews.map((r) => r.rating).reduce((a, b) => a + b) / _mockReviews.length : 0.0;
              return Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: _ResumeStat(label: 'Active Leases', value: '$activeLeases', icon: Icons.home_outlined),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _ResumeStat(label: 'Total Leases', value: '$totalLeases', icon: Icons.description_outlined),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _ResumeStat(label: 'Avg Rating', value: avgRating.toStringAsFixed(1), icon: Icons.star_outline),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 8),
                  Text('Recent Leases', style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _mockLeases.length,
                    separatorBuilder: (context, index) => const Divider(),
                    itemBuilder: (context, index) {
                      final lease = _mockLeases[index];
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
