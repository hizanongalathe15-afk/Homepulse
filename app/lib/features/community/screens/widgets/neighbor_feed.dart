import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/neighborhood.dart';
import '../../../../services/community_service.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_input.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../widgets/user_avatar.dart';
import '../../../../widgets/social_share.dart';
import '../../../../core/utils/formatters.dart';

class NeighborFeed extends ConsumerStatefulWidget {
  final List<Neighborhood> neighborhoods;
  final String currentUserId;
  const NeighborFeed({super.key, required this.neighborhoods, required this.currentUserId});

  @override
  ConsumerState<NeighborFeed> createState() => _NeighborFeedState();
}

class _NeighborFeedState extends ConsumerState<NeighborFeed> {
  final TextEditingController _postController = TextEditingController();
  bool _isLiked = false;

  @override
  void dispose() {
    _postController.dispose();
    super.dispose();
  }

  Future<void> _createPost() async {
    final content = _postController.text.trim();
    if (content.isEmpty) return;
    try {
      final notifier = ref.read(communityProvider.notifier);
      await notifier.createDiscussion(
        widget.neighborhoods.isNotEmpty ? widget.neighborhoods.first.id : 'general',
        CommunityDiscussion(
          id: '',
          neighborhoodId: widget.neighborhoods.isNotEmpty ? widget.neighborhoods.first.id : 'general',
          userId: widget.currentUserId,
          userName: 'You',
          title: content.split('\n').first,
          content: content,
          createdAt: DateTime.now(),
        ),
      );
      _postController.clear();
      AppToast.success(context, 'Posted to feed');
    } catch (e) {
      AppToast.error(context, 'Failed to post');
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final posts = <Map<String, dynamic>>[
      {
        'id': 'p1',
        'userName': 'Alice Mwangi',
        'userAvatarUrl': '',
        'content': 'Just discovered an amazing new coffee shop on Kilimani Road. Highly recommend the latte!',
        'imageUrl': 'https://picsum.photos/600/400?random=10',
        'likesCount': 24,
        'commentsCount': 5,
        'sharesCount': 2,
        'isLiked': false,
        'createdAt': DateTime.now().subtract(const Duration(minutes: 30)),
      },
      {
        'id': 'p2',
        'userName': 'James Kipchoge',
        'userAvatarUrl': '',
        'content': 'Community cleanup event this Saturday at Uhuru Park. Who is joining?',
        'imageUrl': 'https://picsum.photos/600/400?random=11',
        'likesCount': 56,
        'commentsCount': 12,
        'sharesCount': 8,
        'isLiked': true,
        'createdAt': DateTime.now().subtract(const Duration(hours: 2)),
      },
      {
        'id': 'p3',
        'userName': 'Sarah Njeri',
        'userAvatarUrl': '',
        'content': 'Does anyone know a good plumber in Westlands? Need urgent repairs.',
        'imageUrl': null,
        'likesCount': 3,
        'commentsCount': 7,
        'sharesCount': 0,
        'isLiked': false,
        'createdAt': DateTime.now().subtract(const Duration(hours: 5)),
      },
    ];

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: AppInput(
            controller: _postController,
            hintText: 'What is happening in your neighborhood?',
            prefixIcon: Icon(LucideIcons.pencil),
            maxLines: 2,
            suffixIcon: IconButton(
              onPressed: _createPost,
              icon: Icon(LucideIcons.send),
            ),
          ),
        ),
        Expanded(
          child: RefreshIndicator(
            onRefresh: () async => ref.invalidate(communityProvider),
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: posts.length,
              itemBuilder: (context, index) {
                final post = posts[index];
                return AppCard(
                  margin: const EdgeInsets.only(bottom: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          UserAvatar(
                            initials: post['userName'][0].toUpperCase(),
                            size: 40,
                            backgroundColor: AppColors.primary,
                            textColor: Colors.white,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(post['userName'] as String, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
                                Text(formatTimeAgo(post['createdAt'] as DateTime), style: theme.textTheme.labelSmall?.copyWith(color: AppColors.textSecondary)),
                              ],
                            ),
                          ),
                          IconButton(
                            onPressed: () {},
                            icon: const Icon(Icons.more_vert, size: 20),
                            visualDensity: VisualDensity.compact,
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(post['content'] as String, style: theme.textTheme.bodyMedium),
                      if (post['imageUrl'] != null) ...[
                        const SizedBox(height: 12),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Image.network(
                            post['imageUrl'] as String,
                            width: double.infinity,
                            height: 200,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) => Container(
                              height: 200,
                              color: AppColors.background,
                              child: const Icon(Icons.image_not_supported_outlined, size: 48),
                            ),
                          ),
                        ),
                      ],
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          _ActionButton(icon: Icons.thumb_up_outlined, count: post['likesCount'] as int, onTap: () {
                            setState(() => _isLiked = !_isLiked);
                            AppToast.success(context, _isLiked ? 'Liked' : 'Unliked');
                          }),
                          const SizedBox(width: 16),
                          _ActionButton(icon: Icons.comment_outlined, count: post['commentsCount'] as int, onTap: () {
                            context.push('/chat/community');
                          }),
                          const SizedBox(width: 16),
                          _ActionButton(icon: LucideIcons.share_2, count: post['sharesCount'] as int, onTap: () {
                            SocialShare.share(text: post['content'] as String);
                          }),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ),
      ],
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final int count;
  final VoidCallback onTap;
  const _ActionButton({required this.icon, required this.count, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        child: Row(
          children: [
            Icon(icon, size: 20, color: AppColors.textSecondary),
            const SizedBox(width: 4),
            if (count > 0) Text('$count', style: const TextStyle(fontSize: 14, color: AppColors.textSecondary)),
          ],
        ),
      ),
    );
  }
}
