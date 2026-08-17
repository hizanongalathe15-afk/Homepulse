import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_theme.dart';
import '../../models/user.dart';
import '../../widgets/block_user_button.dart';
import '../../widgets/user_avatar.dart';
import '../../widgets/app_toast.dart';

class BlockedUsersScreen extends ConsumerWidget {
  final List<User> users;

  const BlockedUsersScreen({
    super.key,
    required this.users,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Blocked Users'),
        actions: [
          if (users.isNotEmpty)
            TextButton(
               onPressed: () => _showUnblockAllDialog(context),
              child: const Text('Unblock All'),
            ),
        ],
      ),
      body: users.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.block_outlined, size: 64, color: AppColors.textTertiary),
                  const SizedBox(height: 16),
                  Text('No blocked users', style: theme.textTheme.titleMedium),
                ],
              ),
            )
          : Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: users.length,
                    itemBuilder: (context, index) {
                      final user = users[index];
                      return _BlockedUserTile(user: user);
                    },
                  ),
                ),
              ],
            ),
    );
  }

  void _showUnblockAllDialog(BuildContext ctx) {
    showDialog(
      context: ctx,
      builder: (context) => AlertDialog(
        title: const Text('Unblock All Users'),
        content: const Text('Are you sure you want to unblock all users?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              AppToast.show(ctx, 'All users unblocked');
            },
            child: const Text('Unblock All'),
          ),
        ],
      ),
    );
  }
}

class _BlockedUserTile extends StatelessWidget {
  final User user;

  const _BlockedUserTile({required this.user});

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
          BlockUserButton(
            isBlocked: true,
            onTap: () {
              AppToast.show(context, 'Unblocked ${user.name}');
            },
          ),
        ],
      ),
    );
  }
}
