import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/network/api_exception.dart';
import 'package:homepulse/core/config/constants.dart';
import 'package:homepulse/models/neighborhood.dart';

class CommunityNotifier extends AsyncNotifier<List<Neighborhood>> {
  late final ApiClient _api = ApiClient(baseUrl: Constants.apiUrl);

  @override
  Future<List<Neighborhood>> build() async {
    final response = await _api.get('/neighborhoods');
    final List<dynamic> list = response.data as List<dynamic>;
    return list.map((e) => Neighborhood.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<CommunityEvent>> getEvents(String neighborhoodId) async {
    try {
      final response = await _api.get('/neighborhoods/$neighborhoodId/events');
      final List<dynamic> list = response.data as List<dynamic>;
      return list.map((e) => CommunityEvent.fromJson(e as Map<String, dynamic>)).toList();
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<CommunityEvent> createEvent(String neighborhoodId, CommunityEvent event) async {
    try {
      final response = await _api.post('/neighborhoods/$neighborhoodId/events', data: event.toJson());
      return CommunityEvent.fromJson(response.data as Map<String, dynamic>);
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<void> rsvpEvent(String eventId, bool attending) async {
    try {
      await _api.post('/events/$eventId/rsvp', data: {'attending': attending});
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<List<CommunityDiscussion>> getDiscussions(String neighborhoodId) async {
    try {
      final response = await _api.get('/neighborhoods/$neighborhoodId/discussions');
      final List<dynamic> list = response.data as List<dynamic>;
      return list.map((e) => CommunityDiscussion.fromJson(e as Map<String, dynamic>)).toList();
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<CommunityDiscussion> createDiscussion(String neighborhoodId, CommunityDiscussion discussion) async {
    try {
      final response = await _api.post('/neighborhoods/$neighborhoodId/discussions', data: discussion.toJson());
      return CommunityDiscussion.fromJson(response.data as Map<String, dynamic>);
    } on ApiException catch (e) {
      rethrow;
    }
  }
}

final communityProvider = AsyncNotifierProvider<CommunityNotifier, List<Neighborhood>>(() => CommunityNotifier());
