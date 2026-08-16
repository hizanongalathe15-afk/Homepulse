import 'package:flutter/material.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/qr_code_display.dart';
import 'package:homepulse/core/utils/formatters.dart';

class PropertyQrCodeWidget extends StatelessWidget {
  final String propertyId;
  final String qrUrl;
  final VoidCallback? onShare;
  final VoidCallback? onDownload;

  const PropertyQrCodeWidget({
    super.key,
    required this.propertyId,
    required this.qrUrl,
    this.onShare,
    this.onDownload,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Property QR Code', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 12),
        AppCard(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              QRCodeDisplay(
                data: qrUrl,
                size: 180,
                backgroundColor: Colors.white,
                foregroundColor: AppColors.textPrimary,
              ),
              const SizedBox(height: 12),
              Text('Property: $propertyId',
                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
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
          ),
        ),
      ],
    );
  }
}
