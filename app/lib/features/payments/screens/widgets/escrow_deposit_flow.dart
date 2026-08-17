import 'package:flutter/material.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/widgets/app_card.dart';

class EscrowDepositFlowWidget extends StatelessWidget {
  final double amount;
  final String propertyId;
  final String status;
  final VoidCallback? onDeposit;
  final VoidCallback? onRelease;

  const EscrowDepositFlowWidget({
    super.key,
    required this.amount,
    required this.propertyId,
    required this.status,
    this.onDeposit,
    this.onRelease,
  });

  @override
  Widget build(BuildContext context) {
    final isPending = status.toLowerCase() == 'pending';
    final isReleased = status.toLowerCase() == 'released';

    return AppCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.secondary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.account_balance, color: AppColors.secondary),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Escrow Deposit', style: const TextStyle(fontWeight: FontWeight.w600)),
                    Text('Property: $propertyId', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: isPending
                      ? AppColors.warning.withOpacity(0.1)
                      : isReleased
                          ? AppColors.success.withOpacity(0.1)
                          : AppColors.error.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  status,
                  style: TextStyle(
                    color: isPending
                        ? AppColors.warning
                        : isReleased
                            ? AppColors.success
                            : AppColors.error,
                    fontSize: 12,
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
              Text('Amount', style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
              Text(
                'KES ${amount.toStringAsFixed(0)}',
                style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
              ),
            ],
          ),
          const SizedBox(height: 12),
          if (isPending && onRelease != null)
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: onRelease,
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.secondary,
                  side: const BorderSide(color: AppColors.secondary),
                ).copyWith(
                  padding: WidgetStatePropertyAll(const EdgeInsets.symmetric(vertical: 12)),
                ),
                child: const Text('Release Funds'),
              ),
            ),
          if (!isPending && onDeposit != null)
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: onDeposit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.secondary,
                  foregroundColor: Colors.white,
                ).copyWith(
                  padding: WidgetStatePropertyAll(const EdgeInsets.symmetric(vertical: 12)),
                ),
                child: const Text('Deposit to Escrow'),
              ),
            ),
        ],
      ),
    );
  }
}
