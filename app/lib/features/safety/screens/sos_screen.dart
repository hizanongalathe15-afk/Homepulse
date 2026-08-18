import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/state/auth_provider.dart';
import 'package:homepulse/services/safety_service.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/app_toast.dart';

class SOSScreen extends ConsumerStatefulWidget {
  const SOSScreen({super.key});

  @override
  ConsumerState<SOSScreen> createState() => _SOSScreenState();
}

class _SOSScreenState extends ConsumerState<SOSScreen> {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Emergency SOS'),
        backgroundColor: AppColors.error,
        foregroundColor: Colors.white,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 180,
                height: 180,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.error.withOpacity(0.1),
                  border: Border.all(color: AppColors.error, width: 4),
                ),
                child: Center(
                  child: TextButton(
                    onPressed: () async {
                      try {
                        await ref.read(safetyProvider.notifier).triggerSos(
                          message: 'Emergency SOS triggered from app',
                        );
                        if (mounted) {
                          AppToast.success(context, 'SOS alert sent. Help is on the way.');
                        }
                      } catch (e) {
                        if (mounted) {
                          AppToast.error(context, 'Failed to send SOS alert');
                        }
                      }
                    },
                    style: TextButton.styleFrom(
                      backgroundColor: AppColors.error,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
                      shape: const CircleBorder(),
                    ),
                    child: const Text(
                      'SOS',
                      style: TextStyle(fontSize: 36, fontWeight: FontWeight.w800),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 32),
              Text(
                'Press SOS to send an emergency alert with your location to emergency contacts and admin.',
                style: theme.textTheme.bodyLarge?.copyWith(color: AppColors.textSecondary),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Text(
                'Use only in case of genuine emergency.',
                style: theme.textTheme.bodySmall?.copyWith(color: AppColors.error),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
