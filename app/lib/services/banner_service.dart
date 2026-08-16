import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/network/api_exception.dart';
import 'package:homepulse/models/banner.dart';

class BannerNotifier extends AsyncNotifier<List<Banner>> {
  late final ApiClient _api = ApiClient(baseUrl: 'https://api.homepulse.app');

  @override
  Future<List<Banner>> build() async {
    final response = await _api.get('/banners');
    final List<dynamic> list = response.data as List<dynamic>;
    return list.map((e) => Banner.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<Banner>> fetchByPosition(String position) async {
    try {
      final response = await _api.get('/banners', queryParameters: {'position': position});
      final List<dynamic> list = response.data as List<dynamic>;
      return list.map((e) => Banner.fromJson(e as Map<String, dynamic>)).toList();
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<void> trackImpression(String bannerId) async {
    try {
      await _api.post('/banners/$bannerId/impression');
    } on ApiException catch (_) {}
  }

  Future<void> trackClick(String bannerId) async {
    try {
      await _api.post('/banners/$bannerId/click');
    } on ApiException catch (_) {}
  }
}

final bannerProvider = AsyncNotifierProvider<BannerNotifier, List<Banner>>(() => BannerNotifier());
