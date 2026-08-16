import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/models/payment.dart';
import 'package:homepulse/services/payment_service.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/core/utils/formatters.dart';

class PaymentHistory extends ConsumerWidget {
  final List<Payment> payments;

  const PaymentHistory({super.key, required this.payments});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedStatus = ref.watch(_paymentStatusFilterProvider);

    final filtered = selectedStatus == null
        ? payments
        : payments.where((p) => p.status.toLowerCase() == selectedStatus.toLowerCase()).toList();

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _FilterChip(label: 'All', isSelected: selectedStatus == null, onSelected: () => ref.read(_paymentStatusFilterProvider.notifier).state = null),
                const SizedBox(width: 8),
                _FilterChip(label: 'Completed', isSelected: selectedStatus == 'completed', onSelected: () => ref.read(_paymentStatusFilterProvider.notifier).state = 'completed'),
                const SizedBox(width: 8),
                _FilterChip(label: 'Pending', isSelected: selectedStatus == 'pending', onSelected: () => ref.read(_paymentStatusFilterProvider.notifier).state = 'pending'),
                const SizedBox(width: 8),
                _FilterChip(label: 'Failed', isSelected: selectedStatus == 'failed', onSelected: () => ref.read(_paymentStatusFilterProvider.notifier).state = 'failed'),
              ],
            ),
          ),
        ),
        Expanded(
          child: filtered.isEmpty
              ? Center(
                  child: Column(
                    children: [
                      Icon(Icons.receipt_long_outlined, size: 48, color: AppColors.textSecondary),
                      const SizedBox(height: 16),
                      Text('No transactions found', style: Theme.of(context).textTheme.bodyMedium),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final payment = filtered[index];
                    return AppCard(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: _getTypeColor(payment.type),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Icon(_getTypeIcon(payment.type), color: Colors.white),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(payment.type.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                                const SizedBox(height: 2),
                                Text('ID: ${payment.id}', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                              ],
                            ),
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(formatCurrency(payment.amount), style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                              const SizedBox(height: 2),
                              Text(formatDate(payment.createdAt), style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }

  Color _getTypeColor(String type) {
    switch (type.toLowerCase()) {
      case 'mpesa':
        return AppColors.success;
      case 'stripe':
        return AppColors.primary;
      case 'escrow':
        return AppColors.secondary;
      default:
        return AppColors.textSecondary;
    }
  }

  IconData _getTypeIcon(String type) {
    switch (type.toLowerCase()) {
      case 'mpesa':
        return Icons.phone_android;
      case 'stripe':
        return Icons.credit_card;
      case 'escrow':
        return Icons.account_balance;
      default:
        return Icons.payment;
    }
  }
}

final _paymentStatusFilterProvider = StateProvider<String?>((ref) => null);

class _FilterChip extends ConsumerWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onSelected;

  const _FilterChip({
    required this.label,
    required this.isSelected,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) => onSelected(),
      selectedColor: AppColors.primary.withOpacity(0.2),
      checkmarkColor: AppColors.primary,
      labelStyle: TextStyle(color: isSelected ? AppColors.primary : AppColors.textSecondary),
      side: BorderSide(color: isSelected ? AppColors.primary : AppColors.divider),
    );
  }
}
