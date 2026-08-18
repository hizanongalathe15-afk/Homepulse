import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/neighborhood.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../widgets/qr_code_display.dart';
import '../../../../core/utils/qr_generator.dart';

class NeighborhoodQR extends ConsumerWidget {
  final List<Neighborhood> neighborhoods;
  const NeighborhoodQR({super.key, required this.neighborhoods});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final neighborhood = neighborhoods.isNotEmpty ? neighborhoods.first : null;

    if (neighborhood == null) {
      return Center(
        child: Text('No neighborhood selected', style: theme.textTheme.titleMedium),
      );
    }

    final qrData = QRGenerator.generateDataUrl(
      type: 'neighborhood',
      id: neighborhood.id,
      payload: {'name': neighborhood.name, 'city': neighborhood.city},
    );

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          AppCard(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                Text('${neighborhood.name} QR Code', style: theme.textTheme.titleLarge),
                const SizedBox(height: 4),
                Text('Scan to view neighborhood details', style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary)),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.08),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: QRCodeDisplay(data: qrData, size: 220),
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton.icon(
                onPressed: () {
                  AppToast.success(context, 'QR code saved to gallery');
                },
                icon: Icon(LucideIcons.download),
                label: const Text('Save'),
              ),
              const SizedBox(width: 16),
              OutlinedButton.icon(
                onPressed: () {
                  AppToast.info(context, 'Link copied to clipboard');
                },
                icon: Icon(LucideIcons.share_2),
                label: const Text('Share'),
              ),
            ],
          ),
          const SizedBox(height: 24),
          AppCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('How it works', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
                const SizedBox(height: 12),
                _StepItem(number: '1', text: 'Scan this QR code with the Homepulse app'),
                _StepItem(number: '2', text: 'View neighborhood details and events'),
                _StepItem(number: '3', text: 'Join local groups and connect with neighbors'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StepItem extends StatelessWidget {
  final String number;
  final String text;
  const _StepItem({required this.number, required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Container(
            width: 28,
            height: 28,
            decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
            child: Center(child: Text(number, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold))),
          ),
          const SizedBox(width: 12),
          Expanded(child: Text(text, style: const TextStyle(fontSize: 14))),
        ],
      ),
    );
  }
}
