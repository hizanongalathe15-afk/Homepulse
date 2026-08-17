import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_theme.dart';
import '../../models/user.dart';
import '../../widgets/follow_button.dart';
import '../../widgets/user_avatar.dart';
import '../../widgets/app_toast.dart';

class FollowersScreen extends ConsumerWidget {
  final List<User> users;

  const FollowersScreen({
    super.key,
    required this.users,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Followers'),
      ),
      body: users.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.people_outline_rounded, size: 64, color: AppColors.textTertiary),
                  const SizedBox(height: 16),
                  Text('No followers yet', style: theme.textTheme.titleMedium),
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
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        user.name,
                        style: theme.textTheme.titleSmall,
                      ),
                    ),
                    _buildStatusBadge(theme),
                  ],
                ),
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
            isFollowing: false,
            onTap: () {
              AppToast.show(context, 'Followed ${user.name}');
            },
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(ThemeData theme) {
    if (user.isOnline) {
      return Container(
        margin: const EdgeInsets.only(left: 8),
        width: 8,
        height: 8,
        decoration: const BoxDecoration(
          color: AppColors.success,
          shape: BoxShape.circle,
        ),
      );
    }
    if (user.lastSeen != null) {
      return Container(
        margin: const EdgeInsets.only(left: 8),
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
        decoration: BoxDecoration(
          color: AppColors.textTertiary.withOpacity(0.1),
          borderRadius: BorderRadius.circular(4),
        ),
        child: Text(
          _formatLastSeen(user.lastSeen!),
          style: theme.textTheme.labelSmall?.copyWith(
            color: AppColors.textSecondary,
            fontSize: 10,
          ),
        ),
      );
    }
    return const SizedBox.shrink();
  }

  String _formatLastSeen(DateTime lastSeen) {
    final diff = DateTime.now().difference(lastSeen);
    if (diff.inMinutes < 1) return 'just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }
}
