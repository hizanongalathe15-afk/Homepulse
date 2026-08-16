import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../state/escrow_provider.dart';
import '../../../../models/escrow.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_button.dart';
import '../../../../core/utils/formatters.dart';

class EscrowManagerScreen extends ConsumerWidget {
  const EscrowManagerScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final escrowsAsync = ref.watch(escrowProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Escrow Management')),
      body: escrowsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Error: $error')),
        data: (escrows) {
          final pending = escrows.where((e) => e.status == 'pending').toList();
          final released = escrows.where((e) => e.status == 'released').toList();
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _buildSectionHeader(context, 'Pending Release', pending.length),
              ...pending.map((e) => _EscrowCard(escrow: e)),
              const SizedBox(height: 24),
              _buildSectionHeader(context, 'Released', released.length),
              ...released.map((e) => _EscrowCard(escrow: e)),
            ],
          );
        },
      ),
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title, int count) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: Colors.orange[100],
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text('$count', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
          ),
        ],
      ),
    );
  }
}

class _EscrowCard extends ConsumerWidget {
  final Escrow escrow;

  const _EscrowCard({required this.escrow});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
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
                Text('Property: ${escrow.propertyId}', style: const TextStyle(fontWeight: FontWeight.w600)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: escrow.status == 'released' ? Colors.green[100] : Colors.orange[100],
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(escrow.status, style: TextStyle(color: escrow.status == 'released' ? Colors.green : Colors.orange, fontSize: 12, fontWeight: FontWeight.w600)),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text('Amount: ${formatCurrency(escrow.amount)}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
            const SizedBox(height: 4),
            Text('Tenant: ${escrow.tenantId}', style: const TextStyle(color: Colors.grey, fontSize: 12)),
            if (escrow.status == 'pending') ...[
              const SizedBox(height: 12),
              AppButton(
                text: 'Release Funds',
                width: double.infinity,
                onPressed: () {
                  ref.read(escrowProvider.notifier).releaseEscrow(escrow.id);
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Funds released')));
                },
              ),
            ],
          ],
        ),
      ),
    );
  }
}
