import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/state/auth_provider.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/app_toast.dart';
import 'package:homepulse/widgets/loading_spinner.dart';
import 'package:homepulse/services/referral_service.dart';

class ReferralsScreen extends ConsumerWidget {
  const ReferralsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final referralsAsync = ref.watch(referralProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Referrals'),
      ),
      body: RefreshIndicator(
        onRefresh: () async => ref.invalidate(referralProvider),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              AppCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Your Referral Code', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.primary.withOpacity(0.3)),
                      ),
                      child: Text(
                        'HP-XXXXXX',
                        style: theme.textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary,
                          fontFamily: 'monospace',
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    AppButton(
                      text: 'Share Referral Link',
                      onPressed: () {
                        AppToast.show(context, 'Referral link copied to clipboard');
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Text('Referral History', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
              const SizedBox(height: 12),
              referralsAsync.when(
                loading: () => const Center(child: LoadingSpinner()),
                error: (error, _) => Center(child: Text('Failed to load referrals')),
                data: (referrals) {
                  if (referrals.isEmpty) {
                    return const Center(child: Padding(
                      padding: EdgeInsets.all(24),
                      child: Text('No referrals yet. Share your code to earn rewards!'),
                    ));
                  }
                  return ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: referrals.length,
                    itemBuilder: (context, index) {
                      final referral = referrals[index];
                      return AppCard(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: AppColors.primary.withOpacity(0.1),
                            child: Icon(Icons.person_outline_rounded, color: AppColors.primary),
                          ),
                           title: Text('Referral ${referral.code}'),
                          subtitle: Text('Referred on ${referral.createdAt.toString().split(' ')[0]}'),
                          trailing: Text(
                            '+${referral.rewardPoints} pts',
                            style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.secondary),
                          ),
                        ),
                      );
                    },
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
