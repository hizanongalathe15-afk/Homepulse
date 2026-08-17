import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/user.dart';
import '../../../../state/auth_provider.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_input.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../widgets/user_avatar.dart';
import '../../../../widgets/verified_badge.dart';
import '../../../../widgets/loading_spinner.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final theme = Theme.of(context);

    return Scaffold(
      body: authState.when(
        loading: () => const Center(child: LoadingSpinner()),
        error: (error, _) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48, color: Colors.red),
              const SizedBox(height: 16),
              Text('Error loading profile', style: theme.textTheme.titleMedium),
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
                  Text('Not logged in', style: theme.textTheme.titleMedium),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => context.go('/login'),
                    child: const Text('Sign In'),
                  ),
                ],
              ),
            );
          }
          return _buildProfile(context, ref, user, theme);
        },
      ),
    );
  }

  Widget _buildProfile(BuildContext context, WidgetRef ref, User user, ThemeData theme) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          expandedHeight: 200,
          pinned: true,
          flexibleSpace: FlexibleSpaceBar(
            title: Text(user.name),
            background: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppColors.primary,
                    AppColors.primaryDark,
                  ],
                ),
              ),
              child: Center(
                child: UserAvatar(
                  imageUrl: user.avatarUrl,
                  fullName: user.name,
                  size: 80,
                  backgroundColor: AppColors.onPrimary.withOpacity(0.2),
                  textColor: AppColors.onPrimary,
                ),
              ),
            ),
          ),
          actions: [
            IconButton(
              onPressed: () => _showEditProfile(context, user),
              icon: const Icon(Icons.edit_outlined),
              tooltip: 'Edit Profile',
            ),
            IconButton(
              onPressed: () {
                ref.read(authProvider.notifier).logout();
                AppToast.success(context, 'Logged out successfully');
                context.go('/login');
              },
              icon: const Icon(Icons.logout_outlined),
              tooltip: 'Logout',
            ),
          ],
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        user.name,
                        style: theme.textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    if (user.isVerified) const VerifiedBadge(size: 20),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  user.email,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  user.phone,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    _buildStatCard(context, '12', 'Properties', Icons.home_outlined),
                    const SizedBox(width: 12),
                    _buildStatCard(context, '48', 'Reviews', Icons.star_outline),
                    const SizedBox(width: 12),
                    _buildStatCard(context, '5', 'Saved', Icons.bookmark_outline),
                  ],
                ),
                const SizedBox(height: 24),
                _buildSettingsSection(context, theme, user),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard(BuildContext context, String value, String label, IconData icon) {
    final theme = Theme.of(context);
    return Expanded(
      child: AppCard(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, color: AppColors.primary, size: 24),
            const SizedBox(height: 8),
            Text(
              value,
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            Text(
              label,
              style: theme.textTheme.bodySmall?.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsSection(BuildContext context, ThemeData theme, User user) {
    final settings = [
      {
        'icon': Icons.person_outline,
        'title': 'Edit Profile',
        'subtitle': 'Update your personal information',
        'onTap': () => _showEditProfile(context, user),
      },
      {
        'icon': Icons.notifications_outlined,
        'title': 'Notifications',
        'subtitle': 'Manage notification preferences',
        'onTap': () {},
      },
      {
        'icon': Icons.lock_outline,
        'title': 'Change Password',
        'subtitle': 'Update your password',
        'onTap': () => context.push('/forgot-password'),
      },
      {
        'icon': Icons.verified_user_outlined,
        'title': 'ID Verification',
        'subtitle': user.isVerified ? 'Verified' : 'Verify your identity',
        'onTap': () => context.push('/verify-id'),
      },
      {
        'icon': Icons.privacy_tip_outlined,
        'title': 'Privacy',
        'subtitle': 'Privacy settings',
        'onTap': () {},
      },
      {
        'icon': Icons.help_outline,
        'title': 'Help & Support',
        'subtitle': 'Get help',
        'onTap': () {},
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          'Settings',
          style: theme.textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 12),
        ...settings.map((setting) => AppCard(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: Icon(setting['icon'] as IconData, color: AppColors.primary),
            title: Text(setting['title'] as String),
            subtitle: Text(setting['subtitle'] as String),
            trailing: const Icon(Icons.chevron_right, color: AppColors.textSecondary),
            onTap: setting['onTap'] as VoidCallback,
          ),
        )),
      ],
    );
  }

  void _showEditProfile(BuildContext context, User user) {
    final nameController = TextEditingController(text: user.name);
    final emailController = TextEditingController(text: user.email);
    final phoneController = TextEditingController(text: user.phone);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
          top: 24,
          left: 24,
          right: 24,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Edit Profile',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            AppInput(
              controller: nameController,
              hintText: 'Full name',
              prefixIcon: const Icon(Icons.person_outline),
            ),
            const SizedBox(height: 12),
            AppInput(
              controller: emailController,
              hintText: 'Email',
              prefixIcon: const Icon(Icons.email_outlined),
            ),
            const SizedBox(height: 12),
            AppInput(
              controller: phoneController,
              hintText: 'Phone',
              prefixIcon: const Icon(Icons.phone_outlined),
            ),
            const SizedBox(height: 24),
            AppButton(
              text: 'Save Changes',
              onPressed: () {
                AppToast.success(context, 'Profile updated');
                Navigator.of(context).pop();
              },
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}