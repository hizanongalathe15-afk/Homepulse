import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter/services.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/models/comment.dart';
import 'package:homepulse/widgets/user_avatar.dart';
import 'package:homepulse/widgets/verified_badge.dart';

class CommentWidget extends StatefulWidget {
  final PropertyComment comment;
  final VoidCallback? onReply;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;
  final VoidCallback? onReport;
  final bool isOwner;
  final VoidCallback? onLikeToggled;
  final bool initialIsLiked;

  const CommentWidget({
    super.key,
    required this.comment,
    this.onReply,
    this.onEdit,
    this.onDelete,
    this.onReport,
    this.isOwner = false,
    this.onLikeToggled,
    this.initialIsLiked = false,
  });

  @override
  State<CommentWidget> createState() => _CommentWidgetState();
}

class _CommentWidgetState extends State<CommentWidget> {
  bool _isLiked = false;
  double _dragOffset = 0.0;

  @override
  void initState() {
    super.initState();
    _isLiked = widget.initialIsLiked;
  }

  String _formatTimeAgo(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);

    if (diff.inSeconds < 60) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    return '${date.day}/${date.month}/${date.year}';
  }

  void _toggleLike() {
    HapticFeedback.lightImpact();
    setState(() {
      _isLiked = !_isLiked;
    });
    widget.onLikeToggled?.call();
  }

  Future<void> _showMenu() async {
    final result = await showModalBottomSheet<String>(
      context: context,
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (widget.isOwner) ...[
              ListTile(
                leading: Icon(LucideIcons.pencil),
                title: const Text('Edit'),
                onTap: () => Navigator.pop(context, 'edit'),
              ),
              ListTile(
                leading: const Icon(Icons.delete_outline, color: AppColors.error),
                title: const Text('Delete', style: TextStyle(color: AppColors.error)),
                onTap: () => Navigator.pop(context, 'delete'),
              ),
            ],
            if (!widget.isOwner)
              ListTile(
                leading: const Icon(Icons.flag_outlined),
                title: const Text('Report'),
                onTap: () => Navigator.pop(context, 'report'),
              ),
            ListTile(
              leading: const Icon(Icons.cancel_outlined),
              title: const Text('Cancel'),
              onTap: () => Navigator.pop(context),
            ),
          ],
        ),
      ),
    );

    if (result == 'edit') widget.onEdit?.call();
    if (result == 'delete') widget.onDelete?.call();
    if (result == 'report') widget.onReport?.call();
  }

  @override
  Widget build(BuildContext context) {
    final comment = widget.comment;
    final theme = Theme.of(context);

    return GestureDetector(
      onHorizontalDragUpdate: (details) {
        if (details.delta.dx < 0) {
          setState(() => _dragOffset = (_dragOffset + details.delta.dx).clamp(-80.0, 0.0));
        }
      },
      onHorizontalDragEnd: (details) {
        if (_dragOffset < -40) {
          setState(() => _dragOffset = -70.0);
        } else {
          setState(() => _dragOffset = 0.0);
        }
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        transform: Matrix4.translationValues(_dragOffset, 0, 0),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(color: AppColors.divider.withOpacity(0.5), width: 0.5),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  UserAvatar(
                    imageUrl: comment.user.profileImage,
                    initials: comment.user.initials,
                    fullName: comment.user.fullName,
                    size: 36,
                    backgroundColor: AppColors.primaryLight.withOpacity(0.15),
                    textColor: AppColors.primary,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              comment.user.fullName.isNotEmpty ? comment.user.fullName : 'User',
                              style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
                            ),
                            const SizedBox(width: 6),
                            if (comment.user.role == 'landlord' || comment.user.role == 'admin')
                              VerifiedBadge(size: 14),
                            if (comment.isPinned) ...[
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppColors.tertiary.withOpacity(0.12),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.push_pin_rounded, size: 12, color: AppColors.tertiary),
                                    const SizedBox(width: 2),
                                    Text('Pinned', style: TextStyle(fontSize: 10, color: AppColors.tertiary, fontWeight: FontWeight.w600)),
                                  ],
                                ),
                              ),
                            ],
                            const Spacer(),
                            Text(
                              _formatTimeAgo(comment.createdAt),
                              style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textTertiary, fontSize: 11),
                            ),
                            if (comment.isEdited)
                              Padding(
                                padding: const EdgeInsets.only(left: 6),
                                child: Text(
                                  '(edited)',
                                  style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textTertiary, fontSize: 11, fontStyle: FontStyle.italic),
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          comment.content,
                          style: theme.textTheme.bodyMedium?.copyWith(height: 1.5),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            InkWell(
                              onTap: _toggleLike,
                              borderRadius: BorderRadius.circular(16),
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                child: Row(
                                  children: [
                                    Icon(
                                      _isLiked ? LucideIcons.heart : LucideIcons.heart,
                                      size: 18,
                                      color: _isLiked ? AppColors.like : AppColors.textSecondary,
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      comment.likesCount > 0 ? '${comment.likesCount + (_isLiked ? 1 : 0)}' : 'Like',
                                      style: theme.textTheme.labelMedium?.copyWith(
                                        color: _isLiked ? AppColors.like : AppColors.textSecondary,
                                        fontWeight: _isLiked ? FontWeight.w600 : FontWeight.normal,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            if (widget.onReply != null) ...[
                              const SizedBox(width: 4),
                              InkWell(
                                onTap: widget.onReply,
                                borderRadius: BorderRadius.circular(16),
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  child: Row(
                                    children: [
                                      Icon(Icons.reply_rounded, size: 18, color: AppColors.textSecondary),
                                      const SizedBox(width: 4),
                                      Text('Reply', style: theme.textTheme.labelMedium?.copyWith(color: AppColors.textSecondary)),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                            if (comment.replies.isNotEmpty) ...[
                              const SizedBox(width: 8),
                              TextButton.icon(
                                onPressed: () {},
                                icon: Icon(Icons.expand_more_rounded, size: 18, color: AppColors.primary),
                                label: Text('${comment.replies.length} ${comment.replies.length == 1 ? 'reply' : 'replies'}', style: TextStyle(color: AppColors.primary)),
                              ),
                            ],
                            const Spacer(),
                            if (widget.isOwner)
                              IconButton(
                                onPressed: _showMenu,
                                icon: Icon(Icons.more_vert_rounded, size: 18, color: AppColors.textSecondary),
                                padding: EdgeInsets.zero,
                                constraints: const BoxConstraints(),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
