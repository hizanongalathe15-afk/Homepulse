import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../state/landlord_provider.dart';
import '../../../../state/auth_provider.dart';
import '../../../../state/escrow_provider.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/loading_spinner.dart';
import 'add_property.dart';
import 'property_manager.dart';
import 'escrow_manager.dart';
import 'revenue_analytics.dart';
import 'verification_status.dart';
import 'qr_code_generator.dart';
import 'tenant_requests.dart';

class LandlordHomeScreen extends ConsumerWidget {
  const LandlordHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final landlordId = authState.value?.id ?? '';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Landlord Dashboard'),
        actions: [
          IconButton(
            onPressed: () => ref.read(authProvider.notifier).logout(),
            icon: const Icon(Icons.logout),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildWelcomeCard(context, authState.value?.name ?? 'Landlord'),
            const SizedBox(height: 24),
            _buildStatsGrid(context),
            const SizedBox(height: 24),
            _buildQuickActions(context),
            const SizedBox(height: 24),
            const RevenueAnalyticsPreview(landlordId: ''),
            const SizedBox(height: 24),
            const EscrowManagerPreview(landlordId: ''),
          ],
        ),
      ),
    );
  }

  Widget _buildWelcomeCard(BuildContext context, String name) {
    return AppCard(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Welcome back, $name', style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 4),
                const Text('Manage your properties and track performance', style: TextStyle(color: Colors.grey)),
              ],
            ),
          ),
          Container(
            width: 48,
            height: 48,
            decoration: const BoxDecoration(
              color: Colors.blue,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.home, color: Colors.white),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsGrid(BuildContext context) {
    final stats = [
      {'label': 'Properties', 'value': '12', 'icon': Icons.home, 'color': Colors.blue},
      {'label': 'Inquiries', 'value': '28', 'icon': Icons.chat, 'color': Colors.green},
      {'label': 'Revenue', 'value': 'KES 240K', 'icon': Icons.attach_money, 'color': Colors.orange},
      {'label': 'Tenants', 'value': '8', 'icon': Icons.people, 'color': Colors.purple},
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 1.5,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: stats.length,
      itemBuilder: (context, index) {
        final stat = stats[index];
        return AppCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(stat['icon'] as IconData, color: stat['color'] as Color, size: 24),
              const SizedBox(height: 8),
              Text(stat['value'] as String, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              Text(stat['label'] as String, style: const TextStyle(fontSize: 12, color: Colors.grey)),
            ],
          ),
        );
      },
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    final actions = [
      {'title': 'Add Property', 'icon': Icons.add_circle, 'screen': const AddPropertyScreen()},
      {'title': 'Manage Properties', 'icon': Icons.list, 'screen': const PropertyManager()},
      {'title': 'QR Generator', 'icon': Icons.qr_code, 'screen': const QRCodeGeneratorScreen()},
      {'title': 'Tenant Requests', 'icon': Icons.person_search, 'screen': const TenantRequestsScreen()},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Quick Actions', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
        const SizedBox(height: 12),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
          ),
          itemCount: actions.length,
          itemBuilder: (context, index) {
            final action = actions[index];
            return InkWell(
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => action['screen'] as Widget));
              },
              borderRadius: BorderRadius.circular(12),
              child: AppCard(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Icon(action['icon'] as IconData, color: Colors.blue, size: 24),
                    const SizedBox(width: 12),
                    Expanded(child: Text(action['title'] as String, style: const TextStyle(fontWeight: FontWeight.w500))),
                    const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}

class RevenueAnalyticsPreview extends ConsumerWidget {
  final String landlordId;
  const RevenueAnalyticsPreview({super.key, required this.landlordId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final analyticsAsync = ref.watch(escrowProvider);

    return AppCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Revenue Overview', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              TextButton(onPressed: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const RevenueAnalyticsScreen()));
              }, child: const Text('View All')),
            ],
          ),
          const SizedBox(height: 16),
          analyticsAsync.when(
            loading: () => const LoadingSpinner(size: 24),
            error: (_, __) => const Text('Failed to load'),
            data: (escrows) {
              final total = escrows.fold<double>(0, (sum, e) => sum + e.amount);
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('KES ${total.toStringAsFixed(0)}', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.green)),
                  const SizedBox(height: 4),
                  Text('${escrows.length} active transactions', style: const TextStyle(color: Colors.grey)),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

class EscrowManagerPreview extends ConsumerWidget {
  final String landlordId;
  const EscrowManagerPreview({super.key, required this.landlordId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final escrowsAsync = ref.watch(escrowProvider);

    return AppCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Escrow Status', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              TextButton(onPressed: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const EscrowManagerScreen()));
              }, child: const Text('Manage')),
            ],
          ),
          const SizedBox(height: 12),
          escrowsAsync.when(
            loading: () => const LoadingSpinner(size: 24),
            error: (_, __) => const Text('Failed to load'),
            data: (escrows) {
              final pending = escrows.where((e) => e.status == 'pending').length;
              final released = escrows.where((e) => e.status == 'released').length;
              return Row(
                children: [
                  Expanded(
                    child: _EscrowStat(
                      label: 'Pending',
                      value: pending.toString(),
                      color: Colors.orange,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _EscrowStat(
                      label: 'Released',
                      value: released.toString(),
                      color: Colors.green,
                    ),
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
  final Color color;

  const _EscrowStat({
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color)),
          Text(label, style: TextStyle(fontSize: 12, color: color)),
        ],
      ),
    );
  }
}
