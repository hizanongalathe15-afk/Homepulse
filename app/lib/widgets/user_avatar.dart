import 'package:flutter/material.dart';

class UserAvatar extends StatelessWidget {
  final String? imageUrl;
  final String? initials;
  final String? fullName;
  final double size;
  final double? radius;
  final Color backgroundColor;
  final Color textColor;
  final bool showOnlineIndicator;
  final bool isOnline;
  final Color onlineIndicatorColor;
  final Color offlineIndicatorColor;
  final String? semanticLabel;

  const UserAvatar({
    super.key,
    this.imageUrl,
    this.initials,
    this.fullName,
    this.size = 40.0,
    this.radius,
    this.backgroundColor = Colors.grey,
    this.textColor = Colors.white,
    this.showOnlineIndicator = false,
    this.isOnline = false,
    this.onlineIndicatorColor = Colors.green,
    this.offlineIndicatorColor = Colors.grey,
    this.semanticLabel,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final effectiveBackgroundColor = backgroundColor;
    final effectiveTextColor = textColor;
    final double effectiveSize = radius != null ? radius! * 2 : size;

    final effectiveSemanticLabel = semanticLabel ??
        (fullName != null ? 'Profile photo of $fullName' : 'Profile photo');

    final avatar = Semantics(
      label: effectiveSemanticLabel,
      image: true,
      child: Container(
        width: effectiveSize,
        height: effectiveSize,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: effectiveBackgroundColor,
        ),
        child: _buildAvatarContent(context, effectiveTextColor, effectiveSize),
      ),
    );

    if (!showOnlineIndicator) {
      return avatar;
    }

    return Stack(
      clipBehavior: Clip.none,
      children: [
        avatar,
        Positioned(
          bottom: 0,
          right: 0,
          child: Container(
            width: effectiveSize * 0.3,
            height: effectiveSize * 0.3,
            decoration: BoxDecoration(
              color: isOnline ? onlineIndicatorColor : offlineIndicatorColor,
              shape: BoxShape.circle,
              border: Border.all(color: theme.colorScheme.surface, width: 2),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAvatarContent(BuildContext context, Color textColor, double size) {
    if (imageUrl != null && imageUrl!.isNotEmpty) {
      return ClipOval(
        child: Image.network(
          imageUrl!,
          fit: BoxFit.cover,
          width: size,
          height: size,
          loadingBuilder: (context, child, progress) {
            if (progress == null) return child;
            return Center(
              child: SizedBox(
                width: size * 0.4,
                height: size * 0.4,
                child: CircularProgressIndicator(strokeWidth: 2, color: textColor),
              ),
            );
          },
          errorBuilder: (context, error, stackTrace) {
            return Center(
              child: Text(
                _getInitials(),
                style: TextStyle(
                  color: textColor,
                  fontSize: size * 0.4,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
              ),
            );
          },
        ),
      );
    }

    return Center(
      child: Text(
        _getInitials(),
        style: TextStyle(
          color: textColor,
          fontSize: size * 0.4,
          fontWeight: FontWeight.w600,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }

  String _getInitials() {
    if (initials != null && initials!.isNotEmpty) {
      return initials!.toUpperCase();
    }
    if (fullName != null && fullName!.isNotEmpty) {
      final parts = fullName!.trim().split(' ');
      if (parts.length >= 2) {
        return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
      }
      return fullName!.substring(0, 1).toUpperCase();
    }
    return '?';
  }
}
