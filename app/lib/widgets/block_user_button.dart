import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../widgets/app_toast.dart';

class BlockUserButton extends StatelessWidget {
  final bool isBlocked;
  final VoidCallback? onTap;
  final bool isLoading;

  const BlockUserButton({
    super.key,
    required this.isBlocked,
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
          backgroundColor: isBlocked ? AppColors.surfaceVariant : AppColors.error,
          foregroundColor: isBlocked ? AppColors.textSecondary : Colors.white,
          side: isBlocked
              ? const BorderSide(color: AppColors.divider, width: 1.5)
              : BorderSide.none,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
        ),
        child: isLoading
            ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.error))
            : Text(
                isBlocked ? 'Blocked' : 'Block User',
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
              ),
      ),
    );
  }
}
