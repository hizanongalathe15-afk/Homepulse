import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/formatters.dart';
import '../../../../models/escrow.dart';
import '../../../../state/escrow_provider.dart';
import '../../../../widgets/app_card.dart';

class RevenueAnalyticsScreen extends ConsumerWidget {
  final String landlordId;

  const RevenueAnalyticsScreen({
    super.key,
    required this.landlordId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final escrowsAsync = ref.watch(escrowProvider);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Revenue Analytics'),
      ),
      body: escrowsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(LucideIcons.circle_alert, size: 48, color: Colors.red),
              const SizedBox(height: 16),
              Text('Failed to load analytics', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => ref.invalidate(escrowProvider),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
        data: (escrows) {
          final totalRevenue = escrows.fold<double>(0, (sum, e) => sum + e.amount);
          final pendingRevenue = escrows.where((e) => e.status == 'pending').fold<double>(0, (sum, e) => sum + e.amount);
          final releasedRevenue = escrows.where((e) => e.status == 'released').fold<double>(0, (sum, e) => sum + e.amount);
          final transactionCount = escrows.length;

          return RefreshIndicator(
            onRefresh: () async {
              ref.invalidate(escrowProvider);
            },
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Row(
                  children: [
                    Expanded(
                      child: _MetricCard(
                        title: 'Total Revenue',
                        value: formatCurrency(totalRevenue),
                        color: AppColors.success,
                        icon: Icons.trending_up_rounded,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _MetricCard(
                        title: 'Pending',
                        value: formatCurrency(pendingRevenue),
                        color: AppColors.warning,
                        icon: Icons.pending_rounded,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: _MetricCard(
                        title: 'Released',
                        value: formatCurrency(releasedRevenue),
                        color: AppColors.info,
                        icon: LucideIcons.circle_check,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _MetricCard(
                        title: 'Transactions',
                        value: transactionCount.toString(),
                        color: AppColors.secondary,
                        icon: Icons.receipt_long_rounded,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                Text(
                  'Revenue Breakdown',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 16),
                AppCard(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      _ProgressBar(
                        label: 'Released',
                        value: releasedRevenue,
                        total: totalRevenue,
                        color: AppColors.success,
                      ),
                      const SizedBox(height: 16),
                      _ProgressBar(
                        label: 'Pending',
                        value: pendingRevenue,
                        total: totalRevenue,
                        color: AppColors.warning,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  'Recent Transactions',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),
                ...escrows.take(5).map((escrow) => _TransactionTile(escrow: escrow)),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  final String title;
  final String value;
  final Color color;
  final IconData icon;

  const _MetricCard({
    required this.title,
    required this.value,
    required this.color,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 20, color: color),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  title,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: color,
                    fontWeight: FontWeight.w500,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}

class _ProgressBar extends StatelessWidget {
  final String label;
  final double value;
  final double total;
  final Color color;

  const _ProgressBar({
    required this.label,
    required this.value,
    required this.total,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final progress = total > 0 ? (value / total).clamp(0.0, 1.0) : 0.0;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: theme.textTheme.bodySmall?.copyWith(
                fontWeight: FontWeight.w500,
              ),
            ),
            Text(
              formatCurrency(value),
              style: theme.textTheme.bodySmall?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: progress,
            minHeight: 8,
            backgroundColor: theme.colorScheme.surfaceContainerHighest,
            valueColor: AlwaysStoppedAnimation<Color>(color),
          ),
        ),
      ],
    );
  }
}

class _TransactionTile extends StatelessWidget {
  final Escrow escrow;

  const _TransactionTile({required this.escrow});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final statusColor = _getStatusColor(escrow.status);

    return AppCard(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: statusColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                _getStatusIcon(escrow.status),
                color: statusColor,
                size: 20,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                   Text(
                     'TRANSACTION',
                     style: theme.textTheme.titleSmall?.copyWith(
                       fontWeight: FontWeight.w600,
                     ),
                   ),
                  const SizedBox(height: 4),
                  Text(
                    formatCurrency(escrow.amount),
                    style: theme.textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: statusColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                escrow.status.toUpperCase(),
                style: theme.textTheme.labelSmall?.copyWith(
                  color: statusColor,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'released':
        return AppColors.success;
      case 'pending':
        return AppColors.warning;
      case 'disputed':
        return AppColors.error;
      default:
        return AppColors.textSecondary;
    }
  }

  IconData _getStatusIcon(String status) {
    switch (status.toLowerCase()) {
      case 'released':
        return LucideIcons.circle_check;
      case 'pending':
        return Icons.pending_rounded;
      case 'disputed':
        return Icons.warning_rounded;
      default:
        return Icons.help_outline_rounded;
    }
  }
}
