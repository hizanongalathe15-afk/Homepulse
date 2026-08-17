import 'package:flutter/material.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/models/comment.dart';
import 'package:homepulse/widgets/user_avatar.dart';

class CommentLikedBy extends StatelessWidget {
  final List<PropertyComment> likedComments;
  final VoidCallback? onClose;

  const CommentLikedBy({
    super.key,
    required this.likedComments,
    this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      constraints: BoxConstraints(
        maxWidth: MediaQuery.of(context).size.width * 0.7,
        maxHeight: MediaQuery.of(context).size.height * 0.5,
      ),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.15),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: Border(bottom: BorderSide(color: AppColors.divider.withOpacity(0.5))),
            ),
            child: Row(
              children: [
                Icon(Icons.favorite_rounded, size: 20, color: AppColors.like),
                const SizedBox(width: 8),
                Text(
                  'Liked by',
                  style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w700),
                ),
                const Spacer(),
                if (onClose != null)
                  IconButton(
                    onPressed: onClose,
                    icon: const Icon(Icons.close_rounded, size: 18),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
              ],
            ),
          ),
          Flexible(
            child: likedComments.isEmpty
                ? Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Text('No likes yet', style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textTertiary)),
                  )
                : ListView.builder(
                    shrinkWrap: true,
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    itemCount: likedComments.length,
                    itemBuilder: (context, index) {
                      final comment = likedComments[index];
                      return ListTile(
                        dense: true,
                        leading: UserAvatar(
                          imageUrl: comment.user.profileImage,
                          initials: comment.user.initials,
                          fullName: comment.user.fullName,
                          size: 32,
                          backgroundColor: AppColors.primaryLight.withOpacity(0.1),
                          textColor: AppColors.primary,
                        ),
                        title: Text(
                          comment.user.fullName.isNotEmpty ? comment.user.fullName : 'User',
                          style: theme.textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w600),
                        ),
                        subtitle: Text(
                          _truncateText(comment.content, 50),
                          style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textTertiary, fontSize: 11),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        trailing: Icon(Icons.favorite, size: 14, color: AppColors.like),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  String _truncateText(String text, int maxLength) {
    if (text.length <= maxLength) return text;
    return '${text.substring(0, maxLength)}...';
  }
}
