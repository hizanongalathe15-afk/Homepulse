import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class FollowButton extends StatelessWidget {
  final bool isFollowing;
  final VoidCallback? onTap;
  final bool isLoading;

  const FollowButton({
    super.key,
    required this.isFollowing,
    this.onTap,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 40,
      child: ElevatedButton(
        onPressed: isLoading ? null : onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: isFollowing ? AppColors.primary.withOpacity(0.1) : AppColors.primary,
          foregroundColor: isFollowing ? AppColors.primary : AppColors.onPrimary,
          side: isFollowing
              ? const BorderSide(color: AppColors.primary, width: 1.5)
              : BorderSide.none,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
        ),
        child: isLoading
            ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary))
            : Text(
                isFollowing ? 'Following' : 'Follow',
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
              ),
      ),
    );
  }
}
