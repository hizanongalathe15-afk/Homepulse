import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/user.dart';
import '../../../../state/auth_provider.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/loading_spinner.dart';
import '../../../../widgets/user_avatar.dart';
import '../../../../widgets/verified_badge.dart';
import '../../../../widgets/antigravity_scroll.dart';
import '../../../../widgets/profile_dropdown.dart';
import 'widgets/escrow_status.dart';
import 'widgets/my_qr_code.dart';
import 'widgets/payment_history.dart';
import 'widgets/qr_scanner_tile.dart';
import 'widgets/referral_panel.dart';
import 'widgets/renter_resume.dart';
import 'widgets/saved_properties.dart';
import 'widgets/saved_searches.dart';
import 'widgets/smart_calendar.dart';
import 'widgets/viewing_requests.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final authState = ref.watch(authProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
         actions: [
           const ProfileDropdown(showInAppBar: false),
          ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(authProvider);
          await Future.delayed(const Duration(milliseconds: 500));
        },
        child: authState.when(
          loading: () => const Center(child: LoadingSpinner()),
          error: (error, _) => Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(LucideIcons.circle_alert, size: 48, color: Colors.red),
                const SizedBox(height: 16),
                Text('Error loading dashboard', style: theme.textTheme.titleMedium),
                const SizedBox(height: 8),
                ElevatedButton(
                  onPressed: () => ref.invalidate(authProvider),
                  child: const Text('Retry'),
                ),
              ],
            ),
          ),
          data: (user) {
            if (user == null) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Please sign in', style: theme.textTheme.titleMedium),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () => context.go('/login'),
                      child: const Text('Sign In'),
                    ),
                  ],
                ),
              );
            }
            return _buildDashboard(context, user, theme);
          },
        ),
      ),
    );
  }

  Widget _buildDashboard(BuildContext context, User user, ThemeData theme) {
    return AntigravityListView(
      padding: const EdgeInsets.all(16),
      staggerDelay: 0.15,
      floatIntensity: 0.6,
      children: [
        AppCard(
          glass: true,
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  UserAvatar(
                    imageUrl: user.avatarUrl,
                    fullName: user.name,
                    size: 56,
                    backgroundColor: AppColors.primary,
                    textColor: Colors.white,
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                user.name,
                                style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                              ),
                            ),
                            if (user.isVerified) const SizedBox(width: 8),
                            if (user.isVerified) const VerifiedBadge(size: 20),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          user.role[0].toUpperCase() + user.role.substring(1),
                          style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          childAspectRatio: 1.6,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          children: [
            _DashboardTile(
              icon: LucideIcons.scan,
              label: 'Scan QR',
              color: AppColors.primary,
              onTap: () => context.push('/scanner'),
            ),
            _DashboardTile(
              icon: LucideIcons.heart,
              label: 'Saved Properties',
              color: AppColors.secondary,
              onTap: () {},
            ),
              _DashboardTile(
                icon: LucideIcons.search,
                label: 'Saved Searches',
                color: AppColors.tertiary,
                onTap: () {},
              ),
            _DashboardTile(
              icon: Icons.event_outlined,
              label: 'Viewing Requests',
              color: AppColors.info,
              onTap: () {},
            ),
          ],
        ),
        const SizedBox(height: 24),
        const QRScannerTile(),
        const SizedBox(height: 16),
        const MyQRCode(),
        const SizedBox(height: 16),
        const EscrowStatus(landlordId: ''),
        const SizedBox(height: 16),
        const PaymentHistory(userId: ''),
        const SizedBox(height: 16),
        const ReferralPanel(userId: ''),
        const SizedBox(height: 16),
        const RenterResume(userId: ''),
        const SizedBox(height: 16),
        const SavedProperties(userId: ''),
        const SizedBox(height: 16),
        const SavedSearches(userId: ''),
        const SizedBox(height: 16),
        const SmartCalendar(userId: ''),
        const SizedBox(height: 16),
        const ViewingRequests(userId: ''),
      ],
    );
  }
}

class _DashboardTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  const _DashboardTile({required this.icon, required this.label, required this.color, required this.onTap});

  @override
   Widget build(BuildContext context) {
    return AppCard(
      glass: true,
      padding: const EdgeInsets.all(16),
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 12),
          Text(label, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
