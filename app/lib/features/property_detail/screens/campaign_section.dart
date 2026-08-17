import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/services/banner_service.dart';

class CampaignSection extends ConsumerWidget {
  final String propertyId;

  const CampaignSection({
    super.key,
    required this.propertyId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final campaignsAsync = ref.watch(bannerProvider);

    final activeCampaigns = campaignsAsync.valueOrNull
        ?.where((b) => b.isActive && b.position == 'property_detail')
        .toList() ?? [];

    if (activeCampaigns.isEmpty) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Promotions', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 12),
        ...activeCampaigns.map((campaign) {
          return AppCard(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                     Container(
                       width: 40,
                       height: 40,
                       decoration: BoxDecoration(
                         color: AppColors.tertiary.withOpacity(0.1),
                         borderRadius: BorderRadius.circular(8),
                       ),
                       child: const Icon(Icons.local_offer, color: AppColors.tertiary),
                     ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(campaign.title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                          const SizedBox(height: 2),
                          Text(campaign.description, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                        ],
                      ),
                    ),
                  ],
                ),
                if (campaign.deepLink != null) ...[
                  const SizedBox(height: 12),
                  AppButton(
                    text: 'Learn More',
                    isOutlined: true,
                    onPressed: () {},
                  ),
                ],
              ],
            ),
          );
        }).toList(),
      ],
    );
  }
}
