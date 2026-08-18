import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../state/escrow_provider.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../widgets/loading_spinner.dart';
import '../../../../core/utils/formatters.dart';

class EscrowStatus extends ConsumerWidget {
  final String landlordId;
  const EscrowStatus({super.key, required this.landlordId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final escrowsAsync = ref.watch(escrowProvider);

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Escrow Status', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
              TextButton(
                onPressed: () {
                  AppToast.info(context, 'Manage escrow');
                },
                child: const Text('Manage'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          escrowsAsync.when(
            loading: () => const Center(child: LoadingSpinner(size: 24)),
            error: (error, _) => const Text('Failed to load escrow data'),
            data: (escrows) {
              final pending = escrows.where((e) => e.status == 'pending').toList();
              final released = escrows.where((e) => e.status == 'released').toList();
              final totalAmount = escrows.fold<double>(0, (sum, e) => sum + e.amount);
              return Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: _EscrowStat(
                          label: 'Pending',
                          value: pending.length.toString(),
                          amount: pending.fold<double>(0, (sum, e) => sum + e.amount),
                          color: AppColors.warning,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _EscrowStat(
                          label: 'Released',
                          value: released.length.toString(),
                          amount: released.fold<double>(0, (sum, e) => sum + e.amount),
                          color: AppColors.success,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Total Escrow', style: TextStyle(fontWeight: FontWeight.w600)),
                        Text(
                          formatCurrency(totalAmount),
                          style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  if (escrows.isNotEmpty)
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: escrows.length,
                      separatorBuilder: (context, index) => const Divider(),
                      itemBuilder: (context, index) {
                        final escrow = escrows[index];
                        return ListTile(
                          dense: true,
                          leading: Icon(
                            escrow.status == 'released' ? LucideIcons.circle_check : Icons.pending,
                            color: escrow.status == 'released' ? AppColors.success : AppColors.warning,
                          ),
                          title: Text('Property ${escrow.propertyId}'),
                          subtitle: Text('Created ${formatDate(escrow.createdAt)}'),
                          trailing: Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(formatCurrency(escrow.amount), style: const TextStyle(fontWeight: FontWeight.w600)),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: escrow.status == 'released' ? AppColors.success.withOpacity(0.1) : AppColors.warning.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  escrow.status,
                                  style: TextStyle(fontSize: 11, color: escrow.status == 'released' ? AppColors.success : AppColors.warning),
                                ),
                              ),
                            ],
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

class _EscrowStat extends StatelessWidget {
  final String label;
  final String value;
  final double amount;
  final Color color;
  const _EscrowStat({required this.label, required this.value, required this.amount, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color)),
          Text(label, style: TextStyle(fontSize: 12, color: color)),
          const SizedBox(height: 4),
          Text(formatCurrency(amount), style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
        ],
      ),
    );
  }
}
