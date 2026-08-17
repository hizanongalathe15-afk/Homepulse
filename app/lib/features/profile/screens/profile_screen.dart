import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../models/user.dart';
import '../../../../state/auth_provider.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_input.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../widgets/user_avatar.dart';
import '../../../../widgets/verified_badge.dart';
import '../../../../widgets/loading_spinner.dart';
import '../../../../widgets/social_handles_display.dart';
import '../../../../widgets/social_handles_form.dart';
import '../../../../widgets/follow_button.dart';
import '../../../../widgets/block_user_button.dart';
import '../../../../screens/privacy_settings_screen.dart';
import '../../../../screens/followers_screen.dart';
import '../../../../screens/following_screen.dart';
import '../../../../screens/blocked_users_screen.dart';

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
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.error.withOpacity(0.1),
                    borderRadius: AppTheme.borderRadiusXl,
                  ),
                  child: const Icon(Icons.error_outline_rounded, size: 48, color: AppColors.error),
                ),
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
        ),
        data: (user) {
          if (user == null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.person_off_outlined, size: 64, color: AppColors.textTertiary),
                  const SizedBox(height: 16),
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
          expandedHeight: 220,
          pinned: true,
          flexibleSpace: FlexibleSpaceBar(
            title: Text(user.name, style: const TextStyle(fontWeight: FontWeight.w700)),
            background: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppColors.primary,
                    AppColors.secondary,
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
                    if (user.isOnline)
                      Container(
                        margin: const EdgeInsets.only(left: 8),
                        width: 10,
                        height: 10,
                        decoration: const BoxDecoration(
                          color: AppColors.success,
                          shape: BoxShape.circle,
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 4),
                if (user.showEmail)
                  Text(
                    user.email,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                if (user.showPhone)
                  Text(
                    user.phone,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                if (user.lastSeen != null && user.showLastSeen) ...[
                  const SizedBox(height: 4),
                  Text(
                    'Last seen ${_formatLastSeen(user.lastSeen!)}',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: AppColors.textTertiary,
                    ),
                  ),
                ],
                const SizedBox(height: 20),
                Row(
                  children: [
                    Expanded(
                      child: AppTheme.glassCard(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: [
                            Text(
                              user.totalProperties.toString(),
                              style: theme.textTheme.titleLarge?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: AppColors.textPrimary,
                              ),
                            ),
                            Text(
                              'Properties',
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: AppTheme.glassCard(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: [
                            Text(
                              user.rating?.toStringAsFixed(1) ?? '0.0',
                              style: theme.textTheme.titleLarge?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: AppColors.textPrimary,
                              ),
                            ),
                            Text(
                              'Rating',
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: AppTheme.glassCard(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: [
                            Text(
                              user.responseTimeMinutes?.toString() ?? '--',
                              style: theme.textTheme.titleLarge?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: AppColors.textPrimary,
                              ),
                            ),
                            Text(
                              'Min Response',
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                _buildFollowSection(context, theme, user),
                const SizedBox(height: 24),
                if (user.bio != null && user.bio!.isNotEmpty) ...[
                  Text(
                    'Bio',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(user.bio!, style: theme.textTheme.bodyMedium),
                  const SizedBox(height: 16),
                ],
                SocialHandlesDisplay(user: user),
                const SizedBox(height: 24),
                _buildSettingsSection(context, theme, user),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildFollowSection(BuildContext context, ThemeData theme, User user) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          children: [
            Expanded(
              child: Column(
                children: [
                  Text(
                    '1.2k',
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextButton(
                    onPressed: () => context.push('/followers'),
                    child: const Text('Followers'),
                  ),
                ],
              ),
            ),
            Expanded(
              child: Column(
                children: [
                  Text(
                    '340',
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextButton(
                    onPressed: () => context.push('/following'),
                    child: const Text('Following'),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: FollowButton(
                isFollowing: false,
                onTap: () {},
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: BlockUserButton(
                isBlocked: false,
                onTap: () {},
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSettingsSection(BuildContext context, ThemeData theme, User user) {
    final settings = [
      {
        'icon': Icons.person_outline_rounded,
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
        'icon': Icons.lock_outline_rounded,
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
        'onTap': () => _showPrivacySettings(context),
      },
      {
        'icon': Icons.people_outline_rounded,
        'title': 'Blocked Users',
        'subtitle': 'Manage blocked users',
        'onTap': () => context.push('/blocked-users'),
      },
      {
        'icon': Icons.history_outlined,
        'title': 'Activity History',
        'subtitle': 'View your activity history',
        'onTap': () => context.push('/history'),
      },
      {
        'icon': Icons.help_outline_rounded,
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
        ...settings.map((setting) => AppTheme.glassCard(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: Icon(setting['icon'] as IconData, color: AppColors.primary),
            title: Text(setting['title'] as String),
            subtitle: Text(setting['subtitle'] as String),
            trailing: const Icon(Icons.chevron_right_rounded, color: AppColors.textSecondary),
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
    final bioController = TextEditingController(text: user.bio ?? '');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
          top: 24,
          left: 24,
          right: 24,
        ),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.textTertiary,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Edit Profile',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            AppInput(
              controller: nameController,
              hintText: 'Full name',
              prefixIcon: const Icon(Icons.person_outline_rounded),
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
            const SizedBox(height: 12),
            AppInput(
              controller: bioController,
              hintText: 'Bio',
              prefixIcon: const Icon(Icons.text_fields_outlined),
              maxLines: 3,
            ),
            const SizedBox(height: 12),
            TextButton.icon(
              onPressed: () {
                Navigator.of(context).pop();
                showModalBottomSheet(
                  context: context,
                  isScrollControlled: true,
                  backgroundColor: Colors.transparent,
                  builder: (ctx) => Container(
                    padding: EdgeInsets.only(
                      bottom: MediaQuery.of(context).viewInsets.bottom,
                      top: 24,
                      left: 24,
                      right: 24,
                    ),
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.surface,
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                    ),
                    child: SocialHandlesForm(
                      user: user,
                      onSaved: () {
                        Navigator.of(ctx).pop();
                      },
                    ),
                  ),
                );
              },
              icon: const Icon(Icons.link_outlined),
              label: const Text('Edit Social Handles'),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: AppButton(
                text: 'Save Changes',
                onPressed: () {
                  AppToast.success(context, 'Profile updated');
                  Navigator.of(context).pop();
                },
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  void _showPrivacySettings(BuildContext context) {
    context.push('/privacy');
  }

  String _formatLastSeen(DateTime lastSeen) {
    final diff = DateTime.now().difference(lastSeen);
    if (diff.inMinutes < 1) return 'just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }
}
