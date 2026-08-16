import 'package:flutter/material.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/widgets/app_card.dart';

class InvoiceGeneratorWidget extends StatelessWidget {
  final String invoiceNumber;
  final String tenantName;
  final String propertyName;
  final double amount;
  final String dueDate;
  final String status;
  final VoidCallback? onDownload;
  final VoidCallback? onShare;

  const InvoiceGeneratorWidget({
    super.key,
    required this.invoiceNumber,
    required this.tenantName,
    required this.propertyName,
    required this.amount,
    required this.dueDate,
    required this.status,
    this.onDownload,
    this.onShare,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.receipt, color: Colors.white),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('INVOICE', style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.primary)),
                    Text(invoiceNumber, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: status == 'Paid'
                      ? AppColors.success.withOpacity(0.1)
                      : AppColors.warning.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  status,
                  style: TextStyle(
                    color: status == 'Paid' ? AppColors.success : AppColors.warning,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          _InvoiceRow(label: 'Tenant', value: tenantName),
          const SizedBox(height: 8),
          _InvoiceRow(label: 'Property', value: propertyName),
          const SizedBox(height: 8),
          _InvoiceRow(label: 'Due Date', value: dueDate),
          const SizedBox(height: 8),
          _InvoiceRow(label: 'Status', value: status),
          const SizedBox(height: 16),
          const Divider(),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Total Amount', style: TextStyle(fontWeight: FontWeight.w600)),
              Text(
                'KES ${amount.toStringAsFixed(0)}',
                style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
              ),
            ],
          ),
          if (onDownload != null || onShare != null) ...[
            const SizedBox(height: 16),
            Row(
              children: [
                if (onShare != null)
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: onShare,
                      icon: const Icon(Icons.share, size: 18),
                      label: const Text('Share'),
                    ),
                  ),
                if (onShare != null && onDownload != null)
                  const SizedBox(width: 12),
                if (onDownload != null)
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: onDownload,
                      icon: const Icon(Icons.download, size: 18),
                      label: const Text('Download'),
                    ),
                  ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _InvoiceRow extends StatelessWidget {
  final String label;
  final String value;

  const _InvoiceRow({
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
