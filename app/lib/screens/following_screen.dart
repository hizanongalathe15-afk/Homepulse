import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_theme.dart';
import '../../models/user.dart';
import '../../widgets/follow_button.dart';
import '../../widgets/user_avatar.dart';
import '../../widgets/app_toast.dart';

class FollowingScreen extends ConsumerWidget {
  final List<User> users;

  const FollowingScreen({
    super.key,
    required this.users,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Following'),
      ),
      body: users.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.person_outline_rounded, size: 64, color: AppColors.textTertiary),
                  const SizedBox(height: 16),
                  Text('Not following anyone yet', style: theme.textTheme.titleMedium),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: users.length,
              itemBuilder: (context, index) {
                final user = users[index];
                return _UserTile(user: user);
              },
            ),
    );
  }
}

class _UserTile extends StatelessWidget {
  final User user;

  const _UserTile({required this.user});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: AppTheme.borderRadiusLg,
        border: Border.all(color: AppColors.divider),
      ),
      child: Row(
        children: [
          UserAvatar(
            imageUrl: user.avatarUrl,
            fullName: user.name,
            size: 48,
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(user.name, style: theme.textTheme.titleSmall),
                const SizedBox(height: 4),
                Text(
                  user.role.toUpperCase(),
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          FollowButton(
            isFollowing: true,
            onTap: () {
              AppToast.show(context, 'Unfollowed ${user.name}');
            },
          ),
        ],
      ),
    );
  }
}
