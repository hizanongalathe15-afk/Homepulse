import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../services/referral_service.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../widgets/loading_spinner.dart';

class ReferralPanel extends ConsumerWidget {
  final String userId;
  const ReferralPanel({super.key, required this.userId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final referralsAsync = ref.watch(referralProvider);

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Referrals', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
              TextButton(
                onPressed: () {
                  AppToast.info(context, 'View referral history');
                },
                child: const Text('History'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          referralsAsync.when(
            loading: () => const Center(child: LoadingSpinner(size: 24)),
            error: (error, _) => Center(
              child: Column(
                children: [
                  const Text('Failed to load referrals'),
                  const SizedBox(height: 8),
                  ElevatedButton(onPressed: () => ref.invalidate(referralProvider), child: const Text('Retry')),
                ],
              ),
            ),
            data: (referrals) {
              final latestReferral = referrals.isNotEmpty ? referrals.first : null;
              final totalPoints = referrals.fold<int>(0, (sum, r) => sum + r.rewardPoints);
              return Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Your Code', style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textSecondary)),
                            const SizedBox(height: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                              decoration: BoxDecoration(
                                color: AppColors.primary.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: AppColors.primary.withOpacity(0.3)),
                              ),
                              child: Text(
                                latestReferral?.code ?? 'HP-XXXXXX',
                                style: const TextStyle(fontFamily: 'monospace', fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.primary),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('Points', style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textSecondary)),
                          const SizedBox(height: 4),
                          Text(
                            '$totalPoints',
                            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.secondary),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: AppButton(
                          text: 'Generate Code',
                          onPressed: () async {
                            try {
                              final newReferral = await ref.read(referralProvider.notifier).generateReferralCode();
                              generatedCode = newReferral.code;
                              AppToast.success(context, 'New code generated: ${newReferral.code}');
                            } catch (e) {
                              AppToast.error(context, 'Failed to generate code');
                            }
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {
                            AppToast.info(context, 'Referral link copied');
                          },
                          child: const Text('Copy Link'),
                        ),
                      ),
                    ],
                  ),
                  if (referrals.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    const Divider(),
                    const SizedBox(height: 8),
                    Text('Recent Referrals', style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600)),
                    const SizedBox(height: 8),
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: referrals.take(3).length,
                      separatorBuilder: (context, index) => const Divider(),
                      itemBuilder: (context, index) {
                        final referral = referrals[index];
                        return ListTile(
                          dense: true,
                          title: Text(referral.code),
                          subtitle: Text(referral.status[0].toUpperCase() + referral.status.substring(1)),
                          trailing: Text('+${referral.rewardPoints}', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.success)),
                        );
                      },
                    ),
                  ],
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}
