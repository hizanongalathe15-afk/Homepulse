import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_theme.dart';
import '../../models/user.dart';
import '../../state/auth_provider.dart';
import '../../widgets/app_button.dart';
import '../../widgets/app_toast.dart';

class PrivacySettingsScreen extends ConsumerStatefulWidget {
  const PrivacySettingsScreen({super.key});

  @override
  ConsumerState<PrivacySettingsScreen> createState() => _PrivacySettingsScreenState();
}

class _PrivacySettingsScreenState extends ConsumerState<PrivacySettingsScreen> {
  late User _currentUser;
  late bool _showEmail;
  late bool _showPhone;
  late String _locationVisibility;
  late bool _profilePictureVisible;
  late bool _reviewsVisible;
  late bool _bioVisible;
  late bool _socialHandlesVisible;
  late String _activityStatus;

  @override
  void initState() {
    super.initState();
    final user = ref.read(authProvider).value;
    _currentUser = user ?? User(
      id: '',
      name: '',
      email: '',
      phone: '',
      createdAt: DateTime.now(),
    );
    _showEmail = _currentUser.showEmail;
    _showPhone = _currentUser.showPhone;
    _locationVisibility = _currentUser.showLocation ? 'Show city' : 'Hidden';
    _profilePictureVisible = true;
    _reviewsVisible = true;
    _bioVisible = true;
    _socialHandlesVisible = true;
    _activityStatus = _currentUser.showLastSeen ? 'Show last seen' : 'Hidden';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Privacy Settings'),
        actions: [
          TextButton(
            onPressed: _save,
            child: const Text('Save'),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildSectionTitle(theme, 'Contact Information'),
          _buildPrivacyCard(
            context,
            title: 'Email',
            subtitle: 'Control who can see your email address',
            trailing: DropdownButton<String>(
              value: _showEmail ? 'Public' : 'Hidden',
              items: const [
                DropdownMenuItem(value: 'Public', child: Text('Public')),
                DropdownMenuItem(value: 'Hidden', child: Text('Hidden')),
                DropdownMenuItem(value: 'Landlords', child: Text('Only Landlords')),
              ],
              onChanged: (value) {
                if (value != null) {
                  setState(() => _showEmail = value == 'Public' || value == 'Landlords');
                }
              },
            ),
          ),
          const SizedBox(height: 12),
          _buildPrivacyCard(
            context,
            title: 'Phone',
            subtitle: 'Show your phone number to others',
            trailing: Switch(
              value: _showPhone,
              onChanged: (value) => setState(() => _showPhone = value),
            ),
          ),
          const SizedBox(height: 12),
          _buildPrivacyCard(
            context,
            title: 'Location',
            subtitle: 'Show your city and neighborhood',
            trailing: DropdownButton<String>(
              value: _locationVisibility,
              items: const [
                DropdownMenuItem(value: 'Show city', child: Text('Show City')),
                DropdownMenuItem(value: 'Hidden', child: Text('Hidden')),
              ],
              onChanged: (value) {
                if (value != null) {
                  setState(() => _locationVisibility = value);
                }
              },
            ),
          ),
          const SizedBox(height: 24),
          _buildSectionTitle(theme, 'Profile Visibility'),
          _buildPrivacyCard(
            context,
            title: 'Profile Picture',
            subtitle: 'Show your profile picture',
            trailing: Switch(
              value: _profilePictureVisible,
              onChanged: (value) => setState(() => _profilePictureVisible = value),
            ),
          ),
          const SizedBox(height: 12),
          _buildPrivacyCard(
            context,
            title: 'Reviews',
            subtitle: 'Show your reviews',
            trailing: Switch(
              value: _reviewsVisible,
              onChanged: (value) => setState(() => _reviewsVisible = value),
            ),
          ),
          const SizedBox(height: 12),
          _buildPrivacyCard(
            context,
            title: 'Bio',
            subtitle: 'Show your bio',
            trailing: Switch(
              value: _bioVisible,
              onChanged: (value) => setState(() => _bioVisible = value),
            ),
          ),
          const SizedBox(height: 12),
          _buildPrivacyCard(
            context,
            title: 'Social Handles',
            subtitle: 'Show social media links',
            trailing: Switch(
              value: _socialHandlesVisible,
              onChanged: (value) => setState(() => _socialHandlesVisible = value),
            ),
          ),
          const SizedBox(height: 24),
          _buildSectionTitle(theme, 'Activity Status'),
          _buildPrivacyCard(
            context,
            title: 'Activity Status',
            subtitle: 'Let others see when you were last active',
            trailing: DropdownButton<String>(
              value: _activityStatus,
              items: const [
                DropdownMenuItem(value: 'Show last seen', child: Text('Show Last Seen')),
                DropdownMenuItem(value: 'Hidden', child: Text('Hidden')),
              ],
              onChanged: (value) {
                if (value != null) {
                  setState(() => _activityStatus = value);
                }
              },
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(ThemeData theme, String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(
        title,
        style: theme.textTheme.titleMedium?.copyWith(
          fontWeight: FontWeight.w600,
          color: AppColors.textPrimary,
        ),
      ),
    );
  }

  Widget _buildPrivacyCard(BuildContext context, {
    required String title,
    required String subtitle,
    required Widget trailing,
  }) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: AppTheme.borderRadiusLg,
        border: Border.all(color: AppColors.divider),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: theme.textTheme.titleSmall),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),
          trailing,
        ],
      ),
    );
  }

  void _save() {
    AppToast.success(context, 'Privacy settings saved');
    Navigator.of(context).pop();
  }
}
