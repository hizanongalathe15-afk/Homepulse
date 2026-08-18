import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/state/auth_provider.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/app_toast.dart';
import 'package:homepulse/services/safety_service.dart';

class SOSScreen extends ConsumerWidget {
  const SOSScreen({super.key});

  Future<void> _triggerSOS(BuildContext context, WidgetRef ref) async {
    try {
      final service = SafetyService();
      await service.triggerSOS();
      if (mounted) {
        AppToast.success(context, 'SOS alert sent. Help is on the way.');
      }
    } catch (e) {
      if (mounted) {
        AppToast.error(context, 'Failed to send SOS alert');
      }
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
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
                    onPressed: () => _triggerSOS(context, ref),
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
