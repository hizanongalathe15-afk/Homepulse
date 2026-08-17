import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/network/api_exception.dart';
import 'package:homepulse/core/config/constants.dart';
import 'package:homepulse/models/referral.dart';

class ReferralNotifier extends AsyncNotifier<List<Referral>> {
  late final ApiClient _api = ApiClient(baseUrl: Constants.apiUrl);

  @override
  Future<List<Referral>> build() async {
    final response = await _api.get('/referrals');
    final List<dynamic> list = response.data as List<dynamic>;
    return list.map((e) => Referral.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Referral> generateReferralCode() async {
    try {
      final response = await _api.post('/referrals/generate');
      final referral = Referral.fromJson(response.data as Map<String, dynamic>);
      final current = state.valueOrNull ?? [];
      state = AsyncValue.data([referral, ...current]);
      return referral;
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<Referral> applyReferralCode({required String code}) async {
    try {
      final response = await _api.post('/referrals/apply', data: {'code': code});
      return Referral.fromJson(response.data as Map<String, dynamic>);
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<int> getRewardPoints(String userId) async {
    try {
      final response = await _api.get('/referrals/$userId/points');
      final data = response.data as Map<String, dynamic>;
      return data['points'] as int;
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<List<Referral>> getReferralHistory(String userId) async {
    try {
      final response = await _api.get('/referrals/$userId/history');
      final List<dynamic> list = response.data as List<dynamic>;
      return list.map((e) => Referral.fromJson(e as Map<String, dynamic>)).toList();
    } on ApiException catch (e) {
      rethrow;
    }
  }
}

final referralProvider = AsyncNotifierProvider<ReferralNotifier, List<Referral>>(() => ReferralNotifier());
