import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../widgets/verified_badge.dart';

class TrustBadgeOverlay extends StatelessWidget {
  final bool isVerified;

  const TrustBadgeOverlay({
    super.key,
    required this.isVerified,
  });

  @override
  Widget build(BuildContext context) {
    if (!isVerified) return const SizedBox.shrink();
    return Positioned(
      top: 8,
      left: 8,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: AppColors.verified,
          borderRadius: BorderRadius.circular(4),
        ),
        child: const Row(
          children: [
            VerifiedBadge(size: 12),
            SizedBox(width: 4),
            Text('Verified', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }
}
