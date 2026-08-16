import 'package:flutter/material.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/models/user.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/user_avatar.dart';
import 'package:homepulse/widgets/rating_stars.dart';
import 'package:homepulse/widgets/verified_badge.dart';

class LandlordProfileWidget extends StatelessWidget {
  final User landlord;
  final double rating;
  final int reviewCount;
  final String responseTime;
  final VoidCallback? onContact;

  const LandlordProfileWidget({
    super.key,
    required this.landlord,
    this.rating = 0.0,
    this.reviewCount = 0,
    this.responseTime = '',
    this.onContact,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          UserAvatar(imageUrl: landlord.avatarUrl, radius: 28),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        landlord.name,
                        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (landlord.isVerified) ...[
                      const SizedBox(width: 6),
                      const VerifiedBadge(size: 16),
                    ],
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    RatingStars(rating: rating > 0 ? rating : 4.0, size: 14),
                    const SizedBox(width: 6),
                    Text(
                      '${rating > 0 ? rating.toStringAsFixed(1) : "4.0"} ($reviewCount reviews)',
                      style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                    ),
                  ],
                ),
                if (responseTime.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(responseTime, style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                ],
              ],
            ),
          ),
          if (onContact != null)
            AppButton(
              text: 'Contact',
              width: 100,
              onPressed: onContact,
            ),
        ],
      ),
    );
  }
}
