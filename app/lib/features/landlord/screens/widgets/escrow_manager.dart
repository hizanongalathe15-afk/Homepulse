import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/formatters.dart';
import '../../../../models/escrow.dart';
import '../../../../state/escrow_provider.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/app_toast.dart';

class EscrowManagerScreen extends ConsumerWidget {
  final String landlordId;

  const EscrowManagerScreen({
    super.key,
    required this.landlordId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final escrowsAsync = ref.watch(escrowProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Escrow Manager'),
      ),
      body: escrowsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48, color: Colors.red),
              const SizedBox(height: 16),
              Text('Failed to load escrow data', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => ref.read(escrowProvider.notifier).loadEscrows(landlordId),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
        data: (escrows) {
          if (escrows.isEmpty) {
            return const Center(child: Text('No escrow transactions found'));
          }

          final pending = escrows.where((e) => e.status == 'pending').toList();
          final released = escrows.where((e) => e.status == 'released').toList();
          final disputed = escrows.where((e) => e.status == 'disputed').toList();

          return RefreshIndicator(
            onRefresh: () => ref.read(escrowProvider.notifier).loadEscrows(landlordId),
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _buildStatsCard(context, pending.length, released.length, disputed.length),
                const SizedBox(height: 24),
                Text(
                  'All Transactions',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),
                ...escrows.map((escrow) => _EscrowTile(
                  escrow: escrow,
                  onRelease: () async {
                    try {
                      await ref.read(escrowProvider.notifier).releaseEscrow(escrow.id);
                      if (context.mounted) {
                        AppToast.success(context, 'Escrow released successfully');
                      }
                    } catch (e) {
                      if (context.mounted) {
                        AppToast.error(context, 'Failed to release escrow');
                      }
                    }
                  },
                  onDispute: () {
                    _showDisputeDialog(context, ref, escrow);
                  },
                )),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildStatsCard(BuildContext context, int pending, int released, int disputed) {
    final theme = Theme.of(context);

    return AppCard(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Expanded(
            child: _StatItem(
              label: 'Pending',
              value: pending.toString(),
              color: AppColors.warning,
            ),
          ),
          Container(width: 1, height: 40, color: theme.dividerColor),
          Expanded(
            child: _StatItem(
              label: 'Released',
              value: released.toString(),
              color: AppColors.success,
            ),
          ),
          Container(width: 1, height: 40, color: theme.dividerColor),
          Expanded(
            child: _StatItem(
              label: 'Disputed',
              value: disputed.toString(),
              color: AppColors.error,
            ),
          ),
        ],
      ),
    );
  }

  void _showDisputeDialog(BuildContext context, WidgetRef ref, Escrow escrow) {
    final reasonController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Raise Dispute'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Dispute escrow ${escrow.id}?'),
            const SizedBox(height: 16),
            TextField(
              controller: reasonController,
              decoration: const InputDecoration(
                labelText: 'Reason',
                hintText: 'Enter dispute reason...',
              ),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              if (reasonController.text.trim().isEmpty) return;
              Navigator.pop(context);
              AppToast.info(context, 'Dispute submitted for review');
            },
            child: const Text('Submit'),
          ),
        ],
      ),
    );
  }
}

class _EscrowTile extends StatelessWidget {
  final Escrow escrow;
  final VoidCallback? onRelease;
  final VoidCallback? onDispute;

  const _EscrowTile({
    required this.escrow,
    this.onRelease,
    this.onDispute,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return AppCard(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  escrow.status.toUpperCase(),
                  style: theme.textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.w600,
                    color: _getStatusColor(escrow.status),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getStatusColor(escrow.status).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    escrow.status.toUpperCase(),
                    style: theme.textTheme.labelSmall?.copyWith(
                      color: _getStatusColor(escrow.status),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Amount',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      formatCurrency(escrow.amount),
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w700,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      'Date',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${escrow.createdAt.day}/${escrow.createdAt.month}/${escrow.createdAt.year}',
                      style: theme.textTheme.bodyMedium,
                    ),
                  ],
                ),
              ],
            ),
            if (escrow.status == 'pending') ...[
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: AppButton(
                      text: 'Release',
                      onPressed: onRelease,
                      isOutlined: true,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: AppButton(
                      text: 'Dispute',
                      onPressed: onDispute,
                      backgroundColor: AppColors.error,
                    ),
                  ),
                ],
              ),
            ],
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
}

class _StatItem extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _StatItem({
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
        ),
      ],
    );
  }
}
