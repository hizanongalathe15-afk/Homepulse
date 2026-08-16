import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class VideoActions extends StatelessWidget {
  final VoidCallback onLike;
  final VoidCallback onSave;
  final VoidCallback onShare;
  final VoidCallback onComment;

  const VideoActions({
    super.key,
    required this.onLike,
    required this.onSave,
    required this.onShare,
    required this.onComment,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _ActionButton(icon: Icons.favorite_border, label: 'Like', color: AppColors.like, onTap: onLike),
          _ActionButton(icon: Icons.comment_outlined, label: 'Comment', color: AppColors.textSecondary, onTap: onComment),
          _ActionButton(icon: Icons.bookmark_border, label: 'Save', color: AppColors.save, onTap: onSave),
          _ActionButton(icon: Icons.share_outlined, label: 'Share', color: AppColors.share, onTap: onShare),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        child: Row(
          children: [
            Icon(icon, size: 20, color: color),
            const SizedBox(width: 4),
            Text(label, style: TextStyle(fontSize: 12, color: color)),
          ],
        ),
      ),
    );
  }
}
