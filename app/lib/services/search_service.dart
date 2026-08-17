import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/network/api_exception.dart';
import 'package:homepulse/core/config/constants.dart';
import 'package:homepulse/models/property.dart';
import 'package:homepulse/models/saved_search.dart';

class SearchService {
  late final ApiClient _api = ApiClient(baseUrl: Constants.apiUrl);

  Future<List<Property>> getAllProperties() async {
    final response = await _api.get('/properties');
    final List<dynamic> list = response.data as List<dynamic>;
    return list.map((e) => Property.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<Property>> query(String query) async {
    final response = await _api.get('/properties/search', queryParameters: {'q': query});
    final List<dynamic> list = response.data as List<dynamic>;
    return list.map((e) => Property.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<Property>> filter(PropertySearchFilters filters) async {
    final response = await _api.get('/properties/search', queryParameters: filters.toQueryParams());
    final List<dynamic> list = response.data as List<dynamic>;
    return list.map((e) => Property.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<SavedSearch> saveSearch(SavedSearch search) async {
    final response = await _api.post('/saved-searches', data: search.toJson());
    return SavedSearch.fromJson(response.data as Map<String, dynamic>);
  }

  Future<List<SavedSearch>> getSavedSearches(String userId) async {
    final response = await _api.get('/users/$userId/saved-searches');
    final List<dynamic> list = response.data as List<dynamic>;
    return list.map((e) => SavedSearch.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<void> deleteSavedSearch(String searchId) async {
    await _api.delete('/saved-searches/$searchId');
  }
}

final searchServiceProvider = Provider<SearchService>((ref) => SearchService());
