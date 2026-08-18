import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/user.dart';
import '../../../state/auth_provider.dart';
import '../../../widgets/user_avatar.dart';

class ProfileDropdown extends ConsumerWidget {
  final User? user;
  final bool showInAppBar;

  const ProfileDropdown({
    super.key,
    this.user,
    this.showInAppBar = true,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentUser = user ?? ref.watch(authProvider).valueOrNull;

    if (currentUser == null) {
      return IconButton(
        icon: const Icon(Icons.login),
        onPressed: () => context.push('/login'),
      );
    }

    final userName = currentUser.name;

    if (showInAppBar) {
      return PopupMenuButton<String>(
        onSelected: (value) => _handleSelection(context, ref, value),
        offset: const Offset(0, 56),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            color: Theme.of(context).colorScheme.surface.withOpacity(0.7),
            border: Border.all(color: Theme.of(context).colorScheme.outline.withOpacity(0.3)),
          ),
          child: Row(
            children: [
              UserAvatar(
                imageUrl: currentUser.avatarUrl,
                fullName: userName,
                size: 32,
                backgroundColor: AppColors.primary,
                textColor: Colors.white,
              ),
              const SizedBox(width: 8),
              Text(
                userName,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w500),
                overflow: TextOverflow.ellipsis,
                maxLines: 1,
              ),
              const SizedBox(width: 4),
              const Icon(Icons.arrow_drop_down, size: 16),
            ],
          ),
        ),
        itemBuilder: (context) => _buildMenuItems(currentUser),
      );
    }

    return PopupMenuButton<String>(
      onSelected: (value) => _handleSelection(context, ref, value),
      offset: const Offset(-12, 56),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: UserAvatar(
        imageUrl: currentUser.avatarUrl,
        fullName: userName,
        size: 40,
        backgroundColor: AppColors.primary,
        textColor: Colors.white,
      ),
      itemBuilder: (context) => _buildMenuItems(currentUser),
    );
  }

  List<PopupMenuEntry<String>> _buildMenuItems(User user) {
    return [
      PopupMenuItem(
        value: 'profile',
        child: Row(
          children: const [
            Icon(Icons.person_outline, size: 18, color: AppColors.textPrimary),
            SizedBox(width: 8),
            Text('My Profile'),
          ],
        ),
      ),
      PopupMenuItem(
        value: 'settings',
        child: Row(
          children: const [
            Icon(Icons.settings_outlined, size: 18, color: AppColors.textPrimary),
            SizedBox(width: 8),
            Text('Settings'),
          ],
        ),
      ),
      PopupMenuItem(
        value: 'saved',
        child: Row(
          children: const [
            Icon(Icons.bookmark_outline, size: 18, color: AppColors.textPrimary),
            SizedBox(width: 8),
            Text('Saved Properties'),
          ],
        ),
      ),
      const PopupMenuDivider(),
      PopupMenuItem(
        value: 'logout',
        child: Row(
          children: const [
            Icon(Icons.logout, size: 18, color: AppColors.error),
            SizedBox(width: 8),
            Text('Logout', style: TextStyle(color: AppColors.error)),
          ],
        ),
      ),
    ];
  }

  void _handleSelection(BuildContext context, WidgetRef ref, String value) {
    switch (value) {
      case 'profile':
        context.push('/profile');
        break;
      case 'settings':
        context.push('/profile?tab=settings');
        break;
      case 'saved':
        context.push('/profile?tab=saved');
        break;
      case 'logout':
        ref.read(authProvider.notifier).logout();
        context.go('/login');
        break;
    }
  }
}
