import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../models/property.dart';
import '../../../../services/feed_service.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../widgets/loading_spinner.dart';
import '../../../../state/feed_provider.dart';
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
        title: const Text('Homepulse'),
        actions: [
          IconButton(onPressed: () {}, icon: const Icon(Icons.search)),
          IconButton(onPressed: () {}, icon: const Icon(Icons.notifications_outlined)),
        ],
      ),
      body: Column(
        children: [
          VideoFilters(onSortChanged: (sort) {}),
          Expanded(
            child: feedAsync.when(
              loading: () => const VideoSkeleton(),
              error: (error, _) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline, size: 48, color: Colors.red),
                    const SizedBox(height: 16),
                    Text('Error loading feed', style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 8),
                    ElevatedButton(onPressed: () => ref.read(feedProvider.notifier).loadFeed(), child: const Text('Retry')),
                  ],
                ),
              ),
              data: (properties) {
                if (properties.isEmpty) {
                  return const Center(child: Text('No properties found'));
                }
                return RefreshIndicator(
                  onRefresh: () => ref.read(feedProvider.notifier).loadFeed(),
                  child: ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: properties.length + 1,
                    itemBuilder: (context, index) {
                      if (index >= properties.length) {
                        return const Padding(
                          padding: EdgeInsets.all(16),
                          child: LoadingSpinner(size: 24),
                        );
                      }
                      final property = properties[index];
                      return VideoCard(
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
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
