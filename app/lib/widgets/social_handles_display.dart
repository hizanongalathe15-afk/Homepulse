import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../models/user.dart';
import '../../widgets/app_toast.dart';

class SocialHandlesDisplay extends StatelessWidget {
  final User user;
  final EdgeInsetsGeometry? padding;
  final double iconSize;

  const SocialHandlesDisplay({
    super.key,
    required this.user,
    this.padding,
    this.iconSize = 22,
  });

  @override
  Widget build(BuildContext context) {
    final handles = <_SocialHandle>[
      if (user.instagram != null && user.instagram!.isNotEmpty)
        _SocialHandle(
          label: 'Instagram',
          icon: Icons.camera_alt_outlined,
          url: 'https://instagram.com/${user.instagram!.replaceFirst("@", "")}',
          color: const Color(0xFFE1306C),
        ),
      if (user.twitter != null && user.twitter!.isNotEmpty)
        _SocialHandle(
          label: 'Twitter',
          icon: Icons.alternate_email_rounded,
          url: 'https://twitter.com/${user.twitter!.replaceFirst("@", "")}',
          color: const Color(0xFF1DA1F2),
        ),
      if (user.facebook != null && user.facebook!.isNotEmpty)
        _SocialHandle(
          label: 'Facebook',
          icon: Icons.facebook_rounded,
          url: 'https://facebook.com/${user.facebook!}',
          color: const Color(0xFF1877F2),
        ),
      if (user.linkedin != null && user.linkedin!.isNotEmpty)
        _SocialHandle(
          label: 'LinkedIn',
          icon: Icons.work_outline_rounded,
          url: 'https://linkedin.com/in/${user.linkedin!}',
          color: const Color(0xFF0A66C2),
        ),
      if (user.tiktok != null && user.tiktok!.isNotEmpty)
        _SocialHandle(
          label: 'TikTok',
          icon: Icons.music_note_rounded,
          url: 'https://tiktok.com/@${user.tiktok!.replaceFirst("@", "")}',
          color: const Color(0xFF000000),
        ),
      if (user.youtube != null && user.youtube!.isNotEmpty)
        _SocialHandle(
          label: 'YouTube',
          icon: Icons.play_circle_outline_rounded,
          url: 'https://youtube.com/@${user.youtube!}',
          color: const Color(0xFFFF0000),
        ),
      if (user.website != null && user.website!.isNotEmpty)
        _SocialHandle(
          label: 'Website',
          icon: Icons.public_outlined,
          url: user.website!.startsWith('http') ? user.website! : 'https://${user.website!}',
          color: AppColors.primary,
        ),
    ];

    if (handles.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: padding ?? const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Wrap(
        spacing: 12,
        runSpacing: 12,
        children: handles.map((handle) {
          return InkWell(
            onTap: () => _launchUrl(context, handle.url),
            borderRadius: BorderRadius.circular(12),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: AppColors.surfaceVariant.withOpacity(0.5),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.divider),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(handle.icon, size: iconSize, color: handle.color),
                  const SizedBox(width: 8),
                  Text(
                    handle.label,
                    style: TextStyle(
                      fontSize: 13,
                      color: AppColors.textSecondary,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  void _launchUrl(BuildContext context, String url) {
    AppToast.show(context, 'Opening $url');
  }
}

class _SocialHandle {
  final String label;
  final IconData icon;
  final String url;
  final Color color;

  _SocialHandle({
    required this.label,
    required this.icon,
    required this.url,
    required this.color,
  });
}
