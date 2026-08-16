import 'package:flutter/material.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/widgets/app_card.dart';

class StripePaymentWidget extends StatelessWidget {
  final String cardLast4;
  final double? amount;
  final String? propertyId;
  final VoidCallback? onPay;

  const StripePaymentWidget({
    super.key,
    required this.cardLast4,
    this.amount,
    this.propertyId,
    this.onPay,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.credit_card, color: AppColors.primary),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Stripe', style: const TextStyle(fontWeight: FontWeight.w600)),
                Text('**** **** **** $cardLast4', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
              ],
            ),
          ),
          if (amount != null)
            Text(
              '\$${amount!.toStringAsFixed(2)}',
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
          const SizedBox(width: 8),
          ElevatedButton(
            onPressed: onPay,
            style: ElevatedButton(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
            ).copyWith(minimumSize: const MaterialStatePropertyAll(Size(80, 36))),
            child: const Text('Pay', style: TextStyle(fontSize: 12)),
          ),
        ],
      ),
    );
  }
}
