import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../widgets/antigravity_scroll.dart';
import '../../../../widgets/profile_dropdown.dart';
import '../../../../state/feed_provider.dart';
import '../../../../services/analytics_service.dart';
import '../../../../services/feed_service.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/theme/app_colors.dart';
import 'video_card.dart';
import 'video_filters.dart';
import 'video_skeleton.dart';

class FeedScreen extends ConsumerStatefulWidget {
  const FeedScreen({super.key});

  @override
  ConsumerState<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends ConsumerState<FeedScreen> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(analyticsServiceProvider).trackPageView('/feed');
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      ref.read(feedProvider.notifier).loadMore();
    }
  }

  @override
  Widget build(BuildContext context) {
    final feedAsync = ref.watch(feedProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text('Homepulse', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700)),
        actions: [
          IconButton(onPressed: () {}, icon: Icon(LucideIcons.search)),
          const ProfileDropdown(showInAppBar: false),
        ],
      ),
      body: Column(
        children: [
          VideoFilters(onSortChanged: (sort) {}),
          Expanded(
            child: feedAsync.when(
              loading: () => const VideoSkeleton(),
              error: (error, _) => Center(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppColors.error.withOpacity(0.1),
                          borderRadius: AppTheme.borderRadiusXl,
                        ),
                        child: Icon(LucideIcons.circle_alert, size: 48, color: AppColors.error),
                      ),
                      const SizedBox(height: 16),
                      Text('Error loading feed', style: Theme.of(context).textTheme.titleMedium),
                      const SizedBox(height: 8),
                      ElevatedButton(
                        onPressed: () => ref.read(feedProvider.notifier).loadFeed(),
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                ),
              ),
              data: (properties) {
                if (properties.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(LucideIcons.house, size: 64, color: AppColors.textTertiary),
                        const SizedBox(height: 16),
                        Text('No properties found', style: Theme.of(context).textTheme.titleMedium),
                      ],
                    ),
                  );
                }
                return RefreshIndicator(
                  onRefresh: () => ref.read(feedProvider.notifier).loadFeed(),
                  color: AppColors.primary,
                  child: AntigravityListView(
                    controller: _scrollController,
                    staggerDelay: 0.1,
                    floatIntensity: 0.4,
                    padding: const EdgeInsets.all(16),
                    children: properties.map((property) => VideoCard(
                        property: property,
                        onLike: () async {
                          await ref.read(feedServiceProvider).likeProperty(property.id);
                          AppToast.show(context, 'Liked');
                        },
                        onSave: () async {
                          await ref.read(feedServiceProvider).saveProperty(property.id);
                          AppToast.show(context, 'Saved');
                        },
                        onShare: () {},
                      )).toList(),
                  ),
                );
              },
            ),
          ),
        ],
      ),
      bottomNavigationBar: AppBottomNav(
        currentIndex: AppBottomNav.indexFor(context),
        onTap: (index) {
          switch (index) {
            case 0:
              context.go('/feed');
              break;
            case 1:
              context.go('/map');
              break;
            case 2:
              context.go('/search');
              break;
            case 3:
              context.go('/messages');
              break;
            case 4:
              context.go('/profile');
              break;
          }
        },
      ),
    );
  }
}
