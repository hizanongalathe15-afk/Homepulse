import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/app_colors.dart';
import '../../models/user.dart';
import '../../widgets/app_input.dart';
import '../../widgets/app_button.dart';
import '../../widgets/app_toast.dart';

class SocialHandlesForm extends StatefulWidget {
  final User user;
  final VoidCallback? onSaved;

  const SocialHandlesForm({
    super.key,
    required this.user,
    this.onSaved,
  });

  @override
  State<SocialHandlesForm> createState() => _SocialHandlesFormState();
}

class _SocialHandlesFormState extends State<SocialHandlesForm> {
  late final TextEditingController _instagramController;
  late final TextEditingController _twitterController;
  late final TextEditingController _facebookController;
  late final TextEditingController _linkedinController;
  late final TextEditingController _tiktokController;
  late final TextEditingController _youtubeController;
  late final TextEditingController _websiteController;

  @override
  void initState() {
    super.initState();
    _instagramController = TextEditingController(text: widget.user.instagram ?? '');
    _twitterController = TextEditingController(text: widget.user.twitter ?? '');
    _facebookController = TextEditingController(text: widget.user.facebook ?? '');
    _linkedinController = TextEditingController(text: widget.user.linkedin ?? '');
    _tiktokController = TextEditingController(text: widget.user.tiktok ?? '');
    _youtubeController = TextEditingController(text: widget.user.youtube ?? '');
    _websiteController = TextEditingController(text: widget.user.website ?? '');
  }

  @override
  void dispose() {
    _instagramController.dispose();
    _twitterController.dispose();
    _facebookController.dispose();
    _linkedinController.dispose();
    _tiktokController.dispose();
    _youtubeController.dispose();
    _websiteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text('Social Handles', style: theme.textTheme.titleMedium),
        const SizedBox(height: 16),
        _SocialInputField(
          controller: _instagramController,
          hintText: 'Instagram username',
          prefixIcon: Icons.camera_alt_outlined,
          prefixColor: const Color(0xFFE1306C),
        ),
        const SizedBox(height: 12),
        _SocialInputField(
          controller: _twitterController,
          hintText: 'Twitter/X username',
          prefixIcon: Icons.alternate_email_rounded,
          prefixColor: const Color(0xFF1DA1F2),
        ),
        const SizedBox(height: 12),
        _SocialInputField(
          controller: _facebookController,
          hintText: 'Facebook username or ID',
          prefixIcon: Icons.facebook_rounded,
          prefixColor: const Color(0xFF1877F2),
        ),
        const SizedBox(height: 12),
        _SocialInputField(
          controller: _linkedinController,
          hintText: 'LinkedIn username',
          prefixIcon: Icons.work_outline_rounded,
          prefixColor: const Color(0xFF0A66C2),
        ),
        const SizedBox(height: 12),
        _SocialInputField(
          controller: _tiktokController,
          hintText: 'TikTok username',
          prefixIcon: Icons.music_note_rounded,
          prefixColor: const Color(0xFF000000),
        ),
        const SizedBox(height: 12),
        _SocialInputField(
          controller: _youtubeController,
          hintText: 'YouTube channel',
          prefixIcon: Icons.play_circle_outline_rounded,
          prefixColor: const Color(0xFFFF0000),
        ),
        const SizedBox(height: 12),
        _SocialInputField(
          controller: _websiteController,
          hintText: 'Website URL',
          prefixIcon: Icons.public_outlined,
          prefixColor: AppColors.primary,
        ),
        const SizedBox(height: 24),
        AppButton(
          text: 'Save Social Handles',
          onPressed: _save,
        ),
      ],
    );
  }

  void _save() {
    final handles = {
      'instagram': _instagramController.text.trim().isEmpty ? null : _instagramController.text.trim(),
      'twitter': _twitterController.text.trim().isEmpty ? null : _twitterController.text.trim(),
      'facebook': _facebookController.text.trim().isEmpty ? null : _facebookController.text.trim(),
      'linkedin': _linkedinController.text.trim().isEmpty ? null : _linkedinController.text.trim(),
      'tiktok': _tiktokController.text.trim().isEmpty ? null : _tiktokController.text.trim(),
      'youtube': _youtubeController.text.trim().isEmpty ? null : _youtubeController.text.trim(),
      'website': _websiteController.text.trim().isEmpty ? null : _websiteController.text.trim(),
    };

    for (final entry in handles.entries) {
      final value = entry.value;
      if (value != null && !_isValidHandle(value)) {
        AppToast.show(
          context,
          'Invalid ${entry.key} handle. Use only letters, numbers, and underscores.',
        );
        return;
      }
    }

    widget.onSaved?.call();
    AppToast.success(context, 'Social handles saved');
  }

  bool _isValidHandle(String value) {
    final regex = RegExp(r'^[a-zA-Z0-9_\.]+$');
    return regex.hasMatch(value);
  }
}

class _SocialInputField extends StatelessWidget {
  final TextEditingController controller;
  final String hintText;
  final IconData prefixIcon;
  final Color prefixColor;

  const _SocialInputField({
    required this.controller,
    required this.hintText,
    required this.prefixIcon,
    required this.prefixColor,
  });

  @override
  Widget build(BuildContext context) {
    return AppInput(
      controller: controller,
      hintText: hintText,
      prefixIcon: Icon(prefixIcon, color: prefixColor, size: 20),
    );
  }
}
