import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../services/analytics_service.dart';
import '../../../../services/escrow_service.dart';
import '../../../../state/escrow_provider.dart';
import '../../../../widgets/app_card.dart';

class RevenueAnalyticsScreen extends ConsumerWidget {
  const RevenueAnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final analyticsFuture = ref.read(analyticsServiceProvider).getRevenue('landlord_1');
    final escrowsAsync = ref.watch(escrowProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Revenue Analytics')),
      body: FutureBuilder(
        future: analyticsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          final analytics = snapshot.data;
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              if (analytics != null) ...[
                AppCard(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      const Text('Total Revenue', style: TextStyle(fontSize: 14, color: Colors.grey)),
                      const SizedBox(height: 8),
                      Text('KES 1.2M', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold, color: Colors.green)),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _AnalyticsStat(label: 'Views', value: '${analytics['views'] ?? 0}'),
                           _AnalyticsStat(label: 'Inquiries', value: '${analytics['inquiries'] ?? 0}'),
                           _AnalyticsStat(label: 'Saves', value: '${analytics['saves'] ?? 0}'),
                           _AnalyticsStat(label: 'Shares', value: '${analytics['shares'] ?? 0}'),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                const Text('Monthly Breakdown', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                const SizedBox(height: 12),
                ...List.generate(6, (index) {
                  final month = DateTime.now().subtract(Duration(days: 30 * index));
                  final revenue = 180000 - index * 20000;
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      children: [
                        SizedBox(width: 80, child: Text('${month.month}/${month.year}', style: const TextStyle(fontSize: 12))),
                        Expanded(
                          child: LinearProgressIndicator(
                            value: revenue / 200000,
                            backgroundColor: Colors.grey[300],
                            valueColor: const AlwaysStoppedAnimation<Color>(Colors.green),
                          ),
                        ),
                        const SizedBox(width: 12),
                        SizedBox(width: 80, child: Text('KES ${revenue.toStringAsFixed(0)}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500))),
                      ],
                    ),
                  );
                }),
              ],
              const SizedBox(height: 24),
              const Text('Escrow Transactions', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              const SizedBox(height: 12),
              escrowsAsync.when(
                loading: () => const CircularProgressIndicator(),
                error: (_, __) => const Text('Failed to load escrow data'),
                data: (escrows) {
                  return Column(
                    children: escrows.map((e) {
                      return ListTile(
                        title: Text('Property ${e.propertyId}'),
                        subtitle: Text('KES ${e.amount.toStringAsFixed(0)}'),
                        trailing: Chip(
                          label: Text(e.status),
                          backgroundColor: e.status == 'released' ? Colors.green[100] : Colors.orange[100],
                        ),
                      );
                    }).toList(),
                  );
                },
              ),
            ],
          );
        },
      ),
    );
  }
}

class _AnalyticsStat extends StatelessWidget {
  final String label;
  final String value;

  const _AnalyticsStat({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
      ],
    );
  }
}
