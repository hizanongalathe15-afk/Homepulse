import 'package:flutter/material.dart';

class VerifiedBadge extends StatelessWidget {
  final double size;
  final Color backgroundColor;
  final Color iconColor;
  final String? semanticLabel;

  const VerifiedBadge({
    super.key,
    this.size = 20.0,
    this.backgroundColor = Colors.blue,
    this.iconColor = Colors.white,
    this.semanticLabel = 'Verified account',
  });

  @override
  Widget build(BuildContext context) {
    final effectiveBackgroundColor = backgroundColor;
    final effectiveIconColor = iconColor;

    return Semantics(
      label: semanticLabel,
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          color: effectiveBackgroundColor,
          shape: BoxShape.circle,
        ),
        child: Icon(
          Icons.verified_rounded,
          size: size * 0.7,
          color: effectiveIconColor,
        ),
      ),
    );
  }
}
