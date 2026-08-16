import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:share_plus/share_plus.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/qr_code.dart';
import '../../../../widgets/qr_code_display.dart';
import '../../../../widgets/app_button.dart';

class QRShare extends ConsumerWidget {
  const QRShare({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final qrData = QRCodeData(
      id: 'qr-${DateTime.now().millisecondsSinceEpoch}',
      propertyId: 'prop-123',
      landlordId: 'landlord-456',
      url: 'https://homepulse.app/property/prop-123',
      createdAt: DateTime.now(),
    );

    return DraggableScrollableSheet(
      initialChildSize: 0.7,
      minChildSize: 0.4,
      maxChildSize: 0.9,
      expand: false,
      builder: (context, scrollController) {
        return Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: AppColors.textSecondary.withOpacity(0.3),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              Text('Share Property', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 24),
              QRCodeDisplay(data: qrData.generateQrString(), size: 200),
              const SizedBox(height: 16),
              Text(qrData.url, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.textSecondary)),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: AppButton(
                      text: 'Share Link',
                      onPressed: () {
                        Share.share('Check out this property: ${qrData.url}');
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('QR saved to gallery')));
                      },
                      child: const Text('Save Image'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
