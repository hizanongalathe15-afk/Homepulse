import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/state/auth_provider.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/app_toast.dart';
import 'package:homepulse/widgets/loading_spinner.dart';

class ArchiveScreen extends ConsumerWidget {
  const ArchiveScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Archive'),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.archive_rounded, size: 64, color: AppColors.textTertiary),
              const SizedBox(height: 16),
              Text('Your archive is empty', style: theme.textTheme.titleMedium),
              const SizedBox(height: 8),
              Text('Archived properties and chats will appear here.', style: theme.textTheme.bodyMedium),
              const SizedBox(height: 24),
              AppButton(
                text: 'Browse Properties',
                onPressed: () => context.go('/feed'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
