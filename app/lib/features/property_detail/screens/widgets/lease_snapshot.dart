import 'package:flutter/material.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/models/lease.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/core/utils/formatters.dart';

class LeaseSnapshotWidget extends StatelessWidget {
  final Lease? lease;
  final VoidCallback? onViewDocument;

  const LeaseSnapshotWidget({
    super.key,
    this.lease,
    this.onViewDocument,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Lease Details', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 12),
        if (lease == null)
          AppCard(
            padding: const EdgeInsets.all(16),
            child: Text(
              'No lease on file. Contact landlord for agreement details.',
              style: TextStyle(color: AppColors.textSecondary),
            ),
          )
        else
          AppCard(
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
                _LeaseRow(label: 'Start Date', value: formatDate(lease!.startDate)),
                const SizedBox(height: 8),
                _LeaseRow(label: 'End Date', value: formatDate(lease!.endDate)),
                const SizedBox(height: 8),
                _LeaseRow(label: 'Rent', value: '${formatCurrency(lease!.amount)} / ${lease!.currency}'),
                const SizedBox(height: 8),
                _LeaseRow(label: 'Status', value: lease!.status),
                if (lease!.documentUrl != null) ...[
                  const SizedBox(height: 12),
                  AppButton(
                    text: 'View Document',
                    isOutlined: true,
                    onPressed: onViewDocument,
                  ),
                ],
              ],
            ),
          ),
      ],
    );
  }
}

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
