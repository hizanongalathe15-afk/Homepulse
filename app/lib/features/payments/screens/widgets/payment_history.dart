import 'package:flutter/material.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/core/utils/formatters.dart';

class PaymentHistoryWidget extends StatelessWidget {
  final String type;
  final double amount;
  final DateTime date;
  final String status;

  const PaymentHistoryWidget({
    super.key,
    required this.type,
    required this.amount,
    required this.date,
    required this.status,
  });

  @override
  Widget build(BuildContext context) {
    final isCompleted = status.toLowerCase() == 'completed' || status.toLowerCase() == 'success';
    final isPending = status.toLowerCase() == 'pending';

    return AppCard(
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: _getTypeColor(type),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(_getTypeIcon(type), color: Colors.white),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(type.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                Text(formatDate(date), style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(formatCurrency(amount), style: const TextStyle(fontWeight: FontWeight.w600)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: isCompleted
                      ? AppColors.success
                      : isPending
                          ? AppColors.warning
                          : AppColors.error,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(status, style: const TextStyle(fontSize: 10, color: Colors.white)),
              ),
            ],
          ),
        ],
      ),
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
