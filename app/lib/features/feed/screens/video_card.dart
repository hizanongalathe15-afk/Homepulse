import 'package:flutter/material.dart';
import '../../../../models/property.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/user_avatar.dart';
import '../../../../widgets/rating_stars.dart';
import '../../../../widgets/verified_badge.dart';
import '../../../../core/utils/formatters.dart';
import 'video_actions.dart';
import 'trust_badge_overlay.dart';
import 'video_comments.dart';

class VideoCard extends StatelessWidget {
  final Property property;
  final VoidCallback onLike;
  final VoidCallback onSave;
  final VoidCallback onShare;

  const VideoCard({
    super.key,
    required this.property,
    required this.onLike,
    required this.onSave,
    required this.onShare,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      glass: true,
      margin: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              Container(
                height: 220,
                width: double.infinity,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  image: DecorationImage(
                    image: NetworkImage(property.imageUrls.first),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              TrustBadgeOverlay(isVerified: property.isVerified),
              Positioned(
                top: 8,
                right: 8,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.6),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    formatCurrency(property.price) + '/month',
                    style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                UserAvatar(imageUrl: '', radius: 16),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              property.title,
                              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          if (property.isVerified) ...[
                            const SizedBox(width: 4),
                            const VerifiedBadge(size: 14),
                          ],
                        ],
                      ),
                      Text(
                        property.location,
                        style: const TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
                RatingStars(rating: property.rating, size: 12),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Text(
              property.description,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 13, color: Colors.black54),
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: property.tags.map((tag) => Chip(
              label: Text(tag, style: const TextStyle(fontSize: 11)),
              visualDensity: VisualDensity.compact,
            )).toList(),
          ),
          VideoActions(
            onLike: onLike,
            onSave: onSave,
            onShare: onShare,
            onComment: () {
              showModalBottomSheet(
                context: context,
                isScrollControlled: true,
                backgroundColor: Colors.transparent,
                builder: (ctx) => const VideoComments(),
              );
            },
          ),
        ],
      ),
    );
  }
}
