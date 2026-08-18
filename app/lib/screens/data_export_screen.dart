import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/utils/haptic_utils.dart';
import '../../widgets/app_toast.dart';

class DataExportScreen extends ConsumerWidget {
  const DataExportScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Data Export'),
        leading: IconButton(
          onPressed: () => context.pop(),
          icon: const Icon(Icons.arrow_back),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.info.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.info.withOpacity(0.2)),
              ),
              child: Row(
                children: [
                  Icon(Icons.info, color: AppColors.info),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'You can request a copy of all your data. This includes your profile, listings, messages, and payments.',
                      style: TextStyle(color: AppColors.textSecondary, fontSize: 14),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Text('Export Format', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            ...['JSON', 'CSV', 'PDF'].map((format) => RadioListTile<String>(
              title: Text(format),
              value: format.toLowerCase(),
              groupValue: 'json',
              onChanged: (v) {},
              activeColor: AppColors.primary,
            )),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () async {
                  HapticUtils.mediumImpact();
                  AppToast.success(context, 'Export request submitted. You will be notified when ready.');
                },
                child: const Text('Request Export'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
