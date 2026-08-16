import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/models/property.dart';
import 'package:homepulse/models/saved_search.dart';
import '../services/search_service.dart';

final searchServiceProvider = Provider<SearchService>((ref) => SearchService());

class SearchNotifier extends AsyncNotifier<List<Property>> {
  late final SearchService _searchService = ref.read(searchServiceProvider);

  @override
  Future<List<Property>> build() async {
    return _searchService.getAllProperties();
  }

  Future<List<Property>> query(String query) async {
    try {
      final results = await _searchService.query(query);
      state = AsyncValue.data(results);
      return results;
    } on Exception catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<List<Property>> filter(PropertySearchFilters filters) async {
    try {
      final results = await _searchService.filter(filters);
      state = AsyncValue.data(results);
      return results;
    } on Exception catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<SavedSearch> saveSearch(SavedSearch search) async {
    try {
      return await _searchService.saveSearch(search);
    } on Exception catch (e) {
      rethrow;
    }
  }

  Future<void> deleteSavedSearch(String searchId) async {
    try {
      await _searchService.deleteSavedSearch(searchId);
    } on Exception catch (e) {
      rethrow;
    }
  }
}

final searchProvider = AsyncNotifierProvider<SearchNotifier, List<Property>>(() => SearchNotifier());

final searchQueryProvider = StateProvider<String>((ref) => '');

final searchFiltersProvider = StateProvider<PropertySearchFilters>((ref) {
  return const PropertySearchFilters();
});

final recentSearchesProvider = StateProvider<List<String>>((ref) => []);

final savedSearchesProvider = FutureProvider.family<List<SavedSearch>, String>((ref, userId) async {
  final searchService = ref.read(searchServiceProvider);
  return searchService.getSavedSearches(userId);
});
