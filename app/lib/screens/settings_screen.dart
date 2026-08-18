import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/utils/haptic_utils.dart';
import '../../widgets/app_toast.dart';
import '../../state/auth_provider.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
        leading: IconButton(
          onPressed: () => context.pop(),
          icon: const Icon(Icons.arrow_back),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildSectionTitle(context, 'Account'),
          const SizedBox(height: 12),
          _buildTile(context, 'Edit Profile', Icons.person, () => context.push('/profile')),
          _buildTile(context, 'Change Password', Icons.lock, () => context.push('/forgot-password')),
          _buildTile(context, 'ID Verification', Icons.verified, () => context.push('/verify-id')),
          const SizedBox(height: 24),
          _buildSectionTitle(context, 'Privacy & Security'),
          const SizedBox(height: 12),
          _buildTile(context, 'Privacy Settings', Icons.visibility, () => context.push('/privacy')),
          _buildTile(context, 'Data Export', Icons.download, () => context.push('/data-export')),
          _buildTile(context, 'Delete Account', Icons.delete_forever, () => _showDeleteAccountDialog(context)),
          const SizedBox(height: 24),
          _buildSectionTitle(context, 'Preferences'),
          const SizedBox(height: 12),
          _buildTile(context, 'Notifications', Icons.notifications, () {}),
          _buildTile(context, 'Language', Icons.language, () {}),
          const SizedBox(height: 24),
          _buildSectionTitle(context, 'Support'),
          const SizedBox(height: 12),
          _buildTile(context, 'Help & Support', Icons.help, () {}),
          _buildTile(context, 'Terms of Service', Icons.description, () {}),
          _buildTile(context, 'Privacy Policy', Icons.policy, () {}),
          const SizedBox(height: 32),
          Center(
            child: TextButton(
              onPressed: () {
                ref.read(authProvider.notifier).logout();
                AppToast.success(context, 'Logged out');
                context.go('/login');
              },
               child: Text('Log Out', style: TextStyle(color: AppColors.error)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(BuildContext context, String title) {
    return Text(
      title,
      style: Theme.of(context).textTheme.titleSmall?.copyWith(
        fontWeight: FontWeight.w600,
        color: AppColors.textSecondary,
      ),
    );
  }

  Widget _buildTile(BuildContext context, String title, IconData icon, VoidCallback onTap) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(icon, color: AppColors.primary),
        title: Text(title),
        trailing: Icon(Icons.chevron_right, color: AppColors.textSecondary),
        onTap: () {
          HapticUtils.selectionClick();
          onTap();
        },
      ),
    );
  }

  void _showDeleteAccountDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Account'),
        content: const Text('Are you sure you want to delete your account? This action cannot be undone.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              HapticUtils.heavyImpact();
              Navigator.pop(ctx);
              AppToast.info(context, 'Account deletion request submitted');
            },
            style: TextButton.styleFrom(foregroundColor: AppColors.error),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}
