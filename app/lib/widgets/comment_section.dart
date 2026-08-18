import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/models/comment.dart';
import 'package:homepulse/services/social_service.dart';
import 'package:homepulse/widgets/comment_widget.dart';
import 'package:homepulse/widgets/app_input.dart';

class CommentSection extends ConsumerStatefulWidget {
  final String propertyId;
  final String? currentUserId;

  const CommentSection({
    super.key,
    required this.propertyId,
    this.currentUserId,
  });

  @override
  ConsumerState<CommentSection> createState() => _CommentSectionState();
}

class _CommentSectionState extends ConsumerState<CommentSection> {
  SortOption _sortOption = SortOption.newest;
  final TextEditingController _commentController = TextEditingController();
  final FocusNode _commentFocusNode = FocusNode();
  bool _isSubmitting = false;
  List<PropertyComment> _comments = [];
  bool _isLoading = false;
  String? _replyingToId;

  @override
  void initState() {
    super.initState();
    _loadComments();
  }

  @override
  void dispose() {
    _commentController.dispose();
    _commentFocusNode.dispose();
    super.dispose();
  }

  Future<void> _loadComments() async {
    if (!mounted) return;
    setState(() => _isLoading = true);
    try {
      final service = ref.read(socialServiceProvider);
      final comments = await service.getComments(widget.propertyId, sort: _sortOption);
      if (mounted) setState(() => _comments = comments);
    } on Exception catch (_) {
      if (mounted) setState(() => _comments = []);
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _submitComment() async {
    final content = _commentController.text.trim();
    if (content.isEmpty || _isSubmitting) return;

    setState(() => _isSubmitting = true);
    try {
      final service = ref.read(socialServiceProvider);
      final newComment = await service.createComment(widget.propertyId, content, parentId: _replyingToId);
      setState(() {
        _comments.insert(0, newComment);
        _commentController.clear();
        _replyingToId = null;
      });
      HapticFeedback.lightImpact();
    } on Exception catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to post comment'), backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _deleteComment(PropertyComment comment) async {
    try {
      final service = ref.read(socialServiceProvider);
      await service.deleteComment(comment.id);
      setState(() => _comments.removeWhere((c) => c.id == comment.id));
      HapticFeedback.lightImpact();
    } on Exception catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to delete comment'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  void _onReply(PropertyComment comment) {
    setState(() {
      _replyingToId = comment.id;
      _commentController.text = '';
      _commentFocusNode.requestFocus();
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              Text('Comments', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
              const Spacer(),
              _buildSortDropdown(),
            ],
          ),
        ),
        if (_isLoading)
          const Padding(
            padding: EdgeInsets.all(24.0),
            child: Center(child: CircularProgressIndicator(color: AppColors.primary)),
          )
        else if (_comments.isEmpty)
          Padding(
            padding: const EdgeInsets.all(32.0),
            child: Center(
              child: Column(
                children: [
                  Icon(Icons.chat_bubble_outline_rounded, size: 48, color: AppColors.textTertiary),
                  const SizedBox(height: 12),
                  Text('No comments yet', style: theme.textTheme.titleSmall?.copyWith(color: AppColors.textSecondary)),
                  const SizedBox(height: 4),
                  Text('Be the first to share your thoughts', style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textTertiary)),
                ],
              ),
            ),
          )
        else
          Flexible(
            child: ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _comments.length,
              itemBuilder: (context, index) {
                final comment = _comments[index];
                final isOwner = widget.currentUserId != null && comment.userId == widget.currentUserId;
                return CommentWidget(
                  comment: comment,
                  isOwner: isOwner,
                  onReply: () => _onReply(comment),
                  onDelete: () => _deleteComment(comment),
                  onEdit: () {},
                  onReport: () {},
                  onLikeToggled: () {
                    setState(() {});
                  },
                );
              },
            ),
          ),
        Container(
          padding: EdgeInsets.only(
            left: 16,
            right: 16,
            top: 12,
            bottom: MediaQuery.of(context).viewInsets.bottom + 12,
          ),
          decoration: BoxDecoration(
            color: AppColors.surface,
            border: Border(top: BorderSide(color: AppColors.divider.withOpacity(0.5))),
          ),
          child: Row(
            children: [
              if (_replyingToId != null) ...[
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.primaryLight.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('Replying', style: TextStyle(fontSize: 12, color: AppColors.primary)),
                      const SizedBox(width: 4),
                      GestureDetector(
                        onTap: () => setState(() => _replyingToId = null),
                        child: Icon(LucideIcons.x, size: 14, color: AppColors.primary),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
              ],
              Expanded(
                child: AppInput(
                  controller: _commentController,
                  hintText: _replyingToId != null ? 'Write a reply...' : 'Add a comment...',
                  maxLines: null,
                  focusNode: _commentFocusNode,
                  onSubmitted: (_) => _submitComment(),
                ),
              ),
              const SizedBox(width: 8),
              IconButton.filled(
                onPressed: _isSubmitting ? null : _submitComment,
                icon: _isSubmitting
                    ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.onPrimary))
                    : Icon(LucideIcons.send, size: 20),
                style: IconButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: AppColors.onPrimary),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSortDropdown() {
    return PopupMenuButton<SortOption>(
      icon: Icon(Icons.sort_rounded, size: 20, color: AppColors.textSecondary),
      onSelected: (value) {
        setState(() => _sortOption = value);
        _loadComments();
      },
      itemBuilder: (context) => [
        PopupMenuItem(
          value: SortOption.newest,
          child: Row(
            children: [
              Icon(Icons.new_releases_rounded, size: 18, color: _sortOption == SortOption.newest ? AppColors.primary : null),
              const SizedBox(width: 8),
              Text('Newest', style: TextStyle(fontWeight: _sortOption == SortOption.newest ? FontWeight.w600 : FontWeight.normal)),
            ],
          ),
        ),
        PopupMenuItem(
          value: SortOption.oldest,
          child: Row(
            children: [
              Icon(Icons.access_time_rounded, size: 18, color: _sortOption == SortOption.oldest ? AppColors.primary : null),
              const SizedBox(width: 8),
              Text('Oldest', style: TextStyle(fontWeight: _sortOption == SortOption.oldest ? FontWeight.w600 : FontWeight.normal)),
            ],
          ),
        ),
        PopupMenuItem(
          value: SortOption.mostLiked,
          child: Row(
            children: [
              Icon(Icons.trending_up_rounded, size: 18, color: _sortOption == SortOption.mostLiked ? AppColors.primary : null),
              const SizedBox(width: 8),
              Text('Most Liked', style: TextStyle(fontWeight: _sortOption == SortOption.mostLiked ? FontWeight.w600 : FontWeight.normal)),
            ],
          ),
        ),
      ],
    );
  }
}
