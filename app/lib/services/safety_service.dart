import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/network/api_exception.dart';
import 'package:homepulse/core/config/constants.dart';
import 'package:homepulse/models/sos_alert.dart';
import 'package:homepulse/models/safety_report.dart' hide SosAlert;
import 'package:homepulse/models/neighborhood.dart';
import 'package:geolocator/geolocator.dart';

class SafetyNotifier extends AsyncNotifier<List<SosAlert>> {
  late final ApiClient _api = ApiClient(baseUrl: Constants.apiUrl);

  @override
  Future<List<SosAlert>> build() async {
    final response = await _api.get('/sos-alerts');
    final List<dynamic> list = response.data as List<dynamic>;
    return list.map((e) => SosAlert.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<SosAlert> triggerSos({required String message, double? latitude, double? longitude}) async {
    try {
      final response = await _api.post('/sos-alerts', data: {
        'message': message,
        'latitude': latitude,
        'longitude': longitude,
      });
      final alert = SosAlert.fromJson(response.data as Map<String, dynamic>);
      final current = state.valueOrNull ?? [];
      state = AsyncValue.data([alert, ...current]);
      return alert;
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<void> cancelSos(String alertId) async {
    try {
      await _api.post('/sos-alerts/$alertId/cancel');
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<SafetyReport> submitIncidentReport({
    required String neighborhoodId,
    required String type,
    required String description,
    double? latitude,
    double? longitude,
    String? imageUrl,
  }) async {
    try {
      final response = await _api.post('/safety-reports', data: {
        'neighborhood_id': neighborhoodId,
        'type': type,
        'description': description,
        'latitude': latitude,
        'longitude': longitude,
        'image_url': imageUrl,
      });
      return SafetyReport.fromJson(response.data as Map<String, dynamic>);
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<List<SafetyReport>> getIncidentReports({String? neighborhoodId}) async {
    try {
      final params = neighborhoodId != null ? {'neighborhood_id': neighborhoodId} : null;
      final response = await _api.get('/safety-reports', queryParameters: params);
      final List<dynamic> list = response.data as List<dynamic>;
      return list.map((e) => SafetyReport.fromJson(e as Map<String, dynamic>)).toList();
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<List<Neighborhood>> getNeighborhoodsWithSafetyData() async {
    try {
      final response = await _api.get('/neighborhoods/safety');
      final List<dynamic> list = response.data as List<dynamic>;
      return list.map((e) => Neighborhood.fromJson(e as Map<String, dynamic>)).toList();
    } on ApiException catch (e) {
      rethrow;
    }
  }
}

final safetyProvider = AsyncNotifierProvider<SafetyNotifier, List<SosAlert>>(() => SafetyNotifier());
