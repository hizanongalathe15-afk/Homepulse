import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/qr_code_display.dart';
import 'package:homepulse/core/utils/formatters.dart';

class PropertyQrCode extends ConsumerWidget {
  final String propertyId;

  const PropertyQrCode({
    super.key,
    required this.propertyId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final qrAsync = ref.watch(propertyQrProvider(propertyId));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Property QR Code', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 12),
        qrAsync.when(
          loading: () => const AppCard(
            padding: EdgeInsets.all(40),
            child: Center(child: CircularProgressIndicator()),
          ),
          error: (error, _) => AppCard(
            padding: const EdgeInsets.all(16),
            child: Center(
              child: Column(
                children: [
                  Icon(Icons.qr_code_2_outlined, size: 36, color: AppColors.textSecondary),
                  const SizedBox(height: 8),
                  TextButton.icon(
                    onPressed: () => ref.invalidate(propertyQrProvider(propertyId)),
                    icon: const Icon(Icons.refresh, size: 16),
                    label: const Text('Generate QR'),
                  ),
                ],
              ),
            ),
          ),
          data: (qr) {
            if (qr == null) {
              return AppCard(
                padding: const EdgeInsets.all(16),
                child: Center(
                  child: Column(
                    children: [
                      Icon(Icons.qr_code_2_outlined, size: 36, color: AppColors.textSecondary),
                      const SizedBox(height: 8),
                      TextButton.icon(
                        onPressed: () => ref.invalidate(propertyQrProvider(propertyId)),
                        icon: const Icon(Icons.refresh, size: 16),
                        label: const Text('Generate QR'),
                      ),
                    ],
                  ),
                ),
              );
            }
            return AppCard(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  QRCodeDisplay(
                    data: qr.url,
                    size: 180,
                    backgroundColor: Colors.white,
                    foregroundColor: AppColors.textPrimary,
                  ),
                  const SizedBox(height: 12),
                  Text('Property: $propertyId', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: AppButton(
                          text: 'Share',
                          isOutlined: true,
                          onPressed: () => AppToast.info(context, 'QR code shared'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: AppButton(
                          text: 'Download',
                          onPressed: () => AppToast.success(context, 'QR code saved'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}

final propertyQrProvider = FutureProvider.family<Map<String, dynamic>?, String>((ref, propertyId) async {
  await Future.delayed(const Duration(milliseconds: 300));
  return {
    'id': 'qr_$propertyId',
    'propertyId': propertyId,
    'url': 'https://homepulse.app/property/$propertyId',
    'createdAt': DateTime.now(),
    'isActive': true,
  };
});
