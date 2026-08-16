import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_toast.dart';

class QRScannerTile extends StatelessWidget {
  const QRScannerTile({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return AppCard(
      onTap: () {
        context.push('/scanner');
      },
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(Icons.qr_code_scanner, color: AppColors.primary, size: 28),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('QR Scanner', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
                Text('Scan property or payment QR codes', style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textSecondary)),
              ],
            ),
          ),
          IconButton(
            onPressed: () {
              context.push('/scanner');
            },
            icon: const Icon(Icons.arrow_forward_ios, size: 16, color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }
}
