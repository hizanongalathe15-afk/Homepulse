import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/property.dart';
import '../services/feed_service.dart';

final feedProvider = StateNotifierProvider<FeedNotifier, AsyncValue<List<Property>>>((ref) {
  return FeedNotifier(ref.read(feedServiceProvider));
});

class FeedNotifier extends StateNotifier<AsyncValue<List<Property>>> {
  final FeedService _feedService;
  int _page = 0;
  bool _hasMore = true;

  FeedNotifier(this._feedService) : super(const AsyncValue.loading()) {
    loadFeed();
  }

  Future<void> loadFeed() async {
    if (!_hasMore) return;
    state = const AsyncValue.loading();
    try {
      final properties = await _feedService.fetchFeed(page: _page, limit: 10);
      _hasMore = properties.length == 10;
      _page++;
      state = AsyncValue.data(properties);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> loadMore() async {
    if (!_hasMore || state.isLoading) return;
    try {
      final more = await _feedService.fetchFeed(page: _page, limit: 10);
      _hasMore = more.length == 10;
      _page++;
      state = AsyncValue.data([...state.value ?? [], ...more]);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}
