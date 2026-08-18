import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import '../../../../models/property.dart';
import '../../../../widgets/rating_stars.dart';
import '../../../../widgets/property_like_button.dart';

class VideoActions extends StatelessWidget {
  final Property property;
  final VoidCallback? onLike;
  final VoidCallback? onSave;
  final VoidCallback? onShare;
  final VoidCallback? onComment;

  const VideoActions({
    super.key,
    required this.property,
    this.onLike,
    this.onSave,
    this.onShare,
    this.onComment,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      children: [
        PropertyLikeButton(
          propertyId: property.id,
          initialLikesCount: property.metrics?.saves ?? 0,
          size: 48,
        ),
        const SizedBox(height: 16),
        _ActionButton(
          icon: LucideIcons.bookmark,
          label: 'Save',
          onTap: onSave,
        ),
        const SizedBox(height: 16),
        _ActionButton(
          icon: LucideIcons.message_circle,
          label: 'Comment',
          onTap: onComment,
        ),
        const SizedBox(height: 16),
        _ActionButton(
          icon: LucideIcons.share_2,
          label: 'Share',
          onTap: onShare,
        ),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: theme.colorScheme.surfaceContainerHighest.withOpacity(0.5),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            children: [
              RatingStars(
                rating: property.rating,
                size: 20,
                readOnly: true,
              ),
              const SizedBox(height: 4),
              Text(
                '${property.reviewCount} reviews',
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback? onTap;

  const _ActionButton({
    required this.icon,
    required this.label,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 48,
        height: 48,
        decoration: BoxDecoration(
          color: theme.colorScheme.surfaceContainerHighest.withOpacity(0.5),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: theme.colorScheme.onSurface, size: 24),
      ),
    );
  }
}
