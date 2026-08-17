import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/network/api_exception.dart';
import 'package:homepulse/core/config/constants.dart';
import 'package:homepulse/models/roommate_profile.dart';
import 'package:homepulse/models/chat_message.dart';

class RoommateNotifier extends AsyncNotifier<List<RoommateProfile>> {
  late final ApiClient _api = ApiClient(baseUrl: Constants.apiUrl);

  @override
  Future<List<RoommateProfile>> build() async {
    final response = await _api.get('/roommates');
    final List<dynamic> list = response.data as List<dynamic>;
    return list.map((e) => RoommateProfile.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<RoommateProfile> createProfile(RoommateProfile profile) async {
    try {
      final response = await _api.post('/roommates', data: profile.toJson());
      final created = RoommateProfile.fromJson(response.data as Map<String, dynamic>);
      final current = state.valueOrNull ?? [];
      state = AsyncValue.data([created, ...current]);
      return created;
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<List<RoommateProfile>> getMatches(String userId) async {
    try {
      final response = await _api.get('/roommates/$userId/matches');
      final List<dynamic> list = response.data as List<dynamic>;
      return list.map((e) => RoommateProfile.fromJson(e as Map<String, dynamic>)).toList();
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<RoommateProfile> updateProfile(String id, Map<String, dynamic> updates) async {
    try {
      final response = await _api.put('/roommates/$id', data: updates);
      final updated = RoommateProfile.fromJson(response.data as Map<String, dynamic>);
      final current = state.valueOrNull ?? [];
      state = AsyncValue.data(current.map((p) => p.id == id ? updated : p).toList());
      return updated;
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<ChatMessage> startChat(String matchId, String initialMessage) async {
    try {
      final response = await _api.post('/roommates/$matchId/chat', data: {'message': initialMessage});
      return ChatMessage.fromJson(response.data as Map<String, dynamic>);
    } on ApiException catch (e) {
      rethrow;
    }
  }
}

final roommateProvider = AsyncNotifierProvider<RoommateNotifier, List<RoommateProfile>>(() => RoommateNotifier());
