import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/services/social_service.dart';

class PropertyLikeButton extends ConsumerStatefulWidget {
  final String propertyId;
  final int initialLikesCount;
  final bool initialIsLiked;
  final VoidCallback? onChanged;
  final double size;

  const PropertyLikeButton({
    super.key,
    required this.propertyId,
    this.initialLikesCount = 0,
    this.initialIsLiked = false,
    this.onChanged,
    this.size = 40,
  });

  @override
  ConsumerState<PropertyLikeButton> createState() => _PropertyLikeButtonState();
}

class _PropertyLikeButtonState extends ConsumerState<PropertyLikeButton> with SingleTickerProviderStateMixin {
  bool _isLiked = false;
  int _likesCount = 0;
  bool _isLoading = false;
  bool _showHeartBurst = false;
  late AnimationController _heartController;
  late Animation<double> _heartScaleAnimation;
  late AnimationController _burstController;
  late Animation<double> _burstOpacityAnimation;

  @override
  void initState() {
    super.initState();
    _isLiked = widget.initialIsLiked;
    _likesCount = widget.initialLikesCount;

    _heartController = AnimationController(duration: const Duration(milliseconds: 300), vsync: this);
    _heartScaleAnimation = Tween<double>(begin: 1.0, end: 1.4).chain(CurveTween(curve: Curves.elasticOut)).animate(_heartController);

    _burstController = AnimationController(duration: const Duration(milliseconds: 800), vsync: this);
    _burstOpacityAnimation = Tween<double>(begin: 1.0, end: 0.0).animate(
      CurvedAnimation(parent: _burstController, curve: Curves.easeOut),
    );
  }

  @override
  void dispose() {
    _heartController.dispose();
    _burstController.dispose();
    super.dispose();
  }

  Future<void> _toggleLike() async {
    if (_isLoading) return;

    setState(() => _isLoading = true);

    try {
      final service = ref.read(socialServiceProvider);

      if (_isLiked) {
        await service.unlikeProperty(widget.propertyId);
        setState(() {
          _isLiked = false;
          _likesCount = (_likesCount - 1).clamp(0, 99999);
        });
      } else {
        await service.likeProperty(widget.propertyId);
        setState(() {
          _isLiked = true;
          _likesCount++;
        });
        _heartController.forward(from: 0.0);
        HapticFeedback.lightImpact();
      }
      widget.onChanged?.call();
    } on Exception catch (_) {
      setState(() => _isLiked = !_isLiked);
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _handleDoubleTap() {
    if (!_isLiked) {
      _toggleLike();
      setState(() => _showHeartBurst = true);
      _burstController.forward(from: 0.0);
      Future.delayed(const Duration(milliseconds: 800), () {
        if (mounted) setState(() => _showHeartBurst = false);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onDoubleTap: _handleDoubleTap,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Visibility(
            visible: _showHeartBurst,
            child: AnimatedBuilder(
              animation: _burstOpacityAnimation,
              builder: (context, child) {
                return Opacity(
                  opacity: _burstOpacityAnimation.value,
                  child: Transform.scale(
                    scale: 1.5 + (1.0 - _burstOpacityAnimation.value) * 0.5,
                    child: Icon(LucideIcons.heart, size: 60, color: AppColors.like),
                  ),
                );
              },
            ),
          ),
          AnimatedBuilder(
            animation: _heartScaleAnimation,
            builder: (context, child) {
              return Transform.scale(
                scale: _heartScaleAnimation.value,
                child: Container(
                  width: widget.size,
                  height: widget.size,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: _isLiked ? AppColors.like.withOpacity(0.12) : Colors.transparent,
                  ),
                  child: _isLoading
                      ? SizedBox(
                          width: widget.size * 0.5,
                          height: widget.size * 0.5,
                          child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.like),
                        )
                      : IconButton(
                          icon: Icon(
                            _isLiked ? LucideIcons.heart : LucideIcons.heart,
                            color: _isLiked ? AppColors.like : AppColors.textSecondary,
                            size: widget.size * 0.55,
                          ),
                          onPressed: _toggleLike,
                          padding: EdgeInsets.zero,
                          splashRadius: widget.size,
                        ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

class PropertyLikeCountBadge extends StatelessWidget {
  final int count;
  final bool isLiked;

  const PropertyLikeCountBadge({
    super.key,
    required this.count,
    this.isLiked = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: isLiked ? AppColors.like.withOpacity(0.1) : AppColors.surfaceVariant,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(LucideIcons.heart, size: 14, color: isLiked ? AppColors.like : AppColors.textSecondary),
          const SizedBox(width: 4),
          Text(
            _formatCount(count),
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: isLiked ? AppColors.like : AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  String _formatCount(int count) {
    if (count >= 1000000) return '${(count / 1000000).toStringAsFixed(1)}M';
    if (count >= 1000) return '${(count / 1000).toStringAsFixed(1)}K';
    return count.toString();
  }
}
