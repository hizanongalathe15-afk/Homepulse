import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/user.dart';
import '../../../../state/auth_provider.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../widgets/loading_spinner.dart';
import '../../../../widgets/qr_code_display.dart';
import '../../../../core/utils/qr_generator.dart';

class MyQRCode extends ConsumerWidget {
  const MyQRCode({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final authState = ref.watch(authProvider);

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('My QR Code', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
              TextButton(
                onPressed: () {
                  AppToast.info(context, 'Regenerate QR code');
                },
                child: const Text('Refresh'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          authState.when(
            loading: () => Center(child: LoadingSpinner(size: 24)),
            error: (error, _) => const Text('Failed to load'),
            data: (user) {
              if (user == null) return const Text('Not logged in');
              final qrPayload = {'userId': user.id, 'name': user.name, 'role': user.role};
              final qrString = QRGenerator.generateDataUrl(type: 'verification', id: user.id, payload: qrPayload);
              return Center(
                child: Column(
                  children: [
                    QRCodeDisplay(data: qrString, size: 160),
                    const SizedBox(height: 12),
                    Text(user.name, style: theme.textTheme.titleSmall),
                    Text(user.role[0].toUpperCase() + user.role.substring(1), style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textSecondary)),
                  ],
                ),
              );
            },
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton.icon(
                onPressed: () {
                  AppToast.success(context, 'QR code saved');
                },
                icon: const Icon(Icons.download_outlined),
                label: const Text('Save'),
              ),
              const SizedBox(width: 12),
              OutlinedButton.icon(
                onPressed: () {
                  AppToast.info(context, 'Share link copied');
                },
                icon: const Icon(Icons.share_outlined),
                label: const Text('Share'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
