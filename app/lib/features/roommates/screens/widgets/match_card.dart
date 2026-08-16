import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/roommate_profile.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/user_avatar.dart';
import 'match_chat_button.dart';

class MatchCard extends StatefulWidget {
  final RoommateProfile profile;
  final VoidCallback onSwipeLeft;
  final VoidCallback onSwipeRight;

  const MatchCard({
    super.key,
    required this.profile,
    required this.onSwipeLeft,
    required this.onSwipeRight,
  });

  @override
  State<MatchCard> createState() => _MatchCardState();
}

class _MatchCardState extends State<MatchCard> with SingleTickerProviderStateMixin {
  double _dragOffset = 0;
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(vsync: this, duration: const Duration(milliseconds: 200));
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(_animationController);
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _animateOut(double direction) {
    final targetOffset = direction * MediaQuery.of(context).size.width;
    setState(() => _dragOffset = targetOffset);
  }

  void _animateReset() {
    _animationController.reverse();
    setState(() => _dragOffset = 0);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final rotation = _dragOffset * 0.002;

    return GestureDetector(
      onHorizontalDragEnd: (details) {
        if (_dragOffset > 100) {
          widget.onSwipeRight();
          _animateOut(1);
        } else if (_dragOffset < -100) {
          widget.onSwipeLeft();
          _animateOut(-1);
        } else {
          _animateReset();
        }
      },
      onHorizontalDragUpdate: (details) {
        setState(() => _dragOffset += details.primaryDelta ?? 0);
      },
      child: Transform.translate(
        offset: Offset(_dragOffset, 0),
        child: Transform.rotate(
          angle: rotation,
          child: ScaleTransition(
            scale: _scaleAnimation,
            child: AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (widget.profile.compatibilityScore != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.success.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        '${widget.profile.compatibilityScore!.toInt()}% Match',
                        style: const TextStyle(color: AppColors.success, fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                    ),
                  Row(
                    children: [
                      UserAvatar(
                        imageUrl: '',
                        initials: widget.profile.userId.isNotEmpty ? widget.profile.userId.substring(0, 1) : '?',
                        size: 56,
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.profile.userId,
                              style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              widget.profile.occupation,
                              style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textSecondary),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Icon(Icons.location_on_outlined, size: 14, color: AppColors.textSecondary),
                                const SizedBox(width: 4),
                                Text(
                                  widget.profile.preferredNeighborhood,
                                  style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textSecondary),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    widget.profile.bio,
                    style: theme.textTheme.bodyMedium,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: widget.profile.interests.map((interest) {
                      return Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(interest, style: const TextStyle(color: AppColors.primary, fontSize: 12)),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),
                  MatchChatButton(userId: widget.profile.userId, profile: widget.profile),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
