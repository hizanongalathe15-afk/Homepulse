import 'package:flutter/material.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/qr_code_display.dart';
import 'package:homepulse/core/utils/formatters.dart';

class QrCodePaymentWidget extends StatelessWidget {
  final String qrData;
  final double amount;
  final String propertyId;
  final VoidCallback? onRegenerate;
  final VoidCallback? onDone;

  const QrCodePaymentWidget({
    super.key,
    required this.qrData,
    required this.amount,
    required this.propertyId,
    this.onRegenerate,
    this.onDone,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          QRCodeDisplay(
            data: qrData,
            size: 200,
            backgroundColor: Colors.white,
            foregroundColor: AppColors.textPrimary,
          ),
          const SizedBox(height: 16),
          Text(
            'Scan to pay ${formatCurrency(amount)}',
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 4),
          Text(
            'Property: $propertyId',
            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              if (onRegenerate != null)
                Expanded(
                  child: OutlinedButton(
                    onPressed: onRegenerate,
                    child: const Text('Regenerate'),
                  ),
                ),
              if (onRegenerate != null && onDone != null)
                const SizedBox(width: 12),
              if (onDone != null)
                Expanded(
                  child: ElevatedButton(
                    onPressed: onDone,
                    child: const Text('Done'),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
