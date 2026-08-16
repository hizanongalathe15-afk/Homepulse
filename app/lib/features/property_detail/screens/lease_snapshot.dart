import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/models/lease.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/core/utils/formatters.dart';

class LeaseSnapshot extends ConsumerWidget {
  final String propertyId;

  const LeaseSnapshot({
    super.key,
    required this.propertyId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final leaseAsync = ref.watch(leaseProvider(propertyId));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Lease Details', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 12),
        leaseAsync.when(
          loading: () => const AppCard(
            padding: EdgeInsets.all(40),
            child: Center(child: CircularProgressIndicator()),
          ),
          error: (error, _) => AppCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.description_outlined, color: AppColors.textSecondary),
                    const SizedBox(width: 8),
                    Text('Standard Lease Agreement', style: TextStyle(color: AppColors.textSecondary)),
                  ],
                ),
                const SizedBox(height: 12),
                Text('A standard 12-month lease applies. Contact the landlord for custom terms.', style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
              ],
            ),
          ),
          data: (lease) {
            if (lease == null) {
              return AppCard(
                padding: const EdgeInsets.all(16),
                child: Text('No lease on file. Contact landlord for agreement details.', style: TextStyle(color: AppColors.textSecondary)),
              );
            }
            return AppCard(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.description, color: AppColors.primary),
                      const SizedBox(width: 8),
                      Text('Lease Agreement', style: Theme.of(context).textTheme.titleSmall),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _LeaseRow(label: 'Start Date', value: formatDate(lease.startDate)),
                  const SizedBox(height: 8),
                  _LeaseRow(label: 'End Date', value: formatDate(lease.endDate)),
                  const SizedBox(height: 8),
                  _LeaseRow(label: 'Rent', value: formatCurrency(lease.amount)),
                  const SizedBox(height: 8),
                  _LeaseRow(label: 'Status', value: lease.status),
                  if (lease.documentUrl != null) ...[
                    const SizedBox(height: 12),
                    AppButton(
                      text: 'View Document',
                      isOutlined: true,
                      onPressed: () {},
                    ),
                  ],
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}

final leaseProvider = FutureProvider.family<Lease?, String>((ref, propertyId) async {
  await Future.delayed(const Duration(milliseconds: 200));
  return Lease(
    id: 'lease_001',
    propertyId: propertyId,
    tenantId: 'tenant_001',
    landlordId: 'landlord_001',
    startDate: DateTime.now(),
    endDate: DateTime.now().add(const Duration(days: 365)),
    amount: 45000,
    currency: 'KES',
    status: 'active',
    documentUrl: 'https://example.com/lease.pdf',
    createdAt: DateTime.now(),
  );
});

class _LeaseRow extends StatelessWidget {
  final String label;
  final String value;

  const _LeaseRow({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: AppColors.textSecondary)),
        Text(value, style: const TextStyle(fontWeight: FontWeight.w500)),
      ],
    );
  }
}
