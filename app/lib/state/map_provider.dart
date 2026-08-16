import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/models/property.dart';
import 'package:geolocator/geolocator.dart';
import '../services/map_service.dart';

final mapServiceProvider = Provider<MapService>((ref) => MapService());

class MapNotifier extends AsyncNotifier<List<Property>> {
  late final MapService _mapService = ref.read(mapServiceProvider);

  @override
  Future<List<Property>> build() async {
    final position = await _mapService.getCurrentLocation();
    return _mapService.getNearby(position.latitude, position.longitude);
  }

  Future<List<Property>> getNearby(double latitude, double longitude, {double radiusKm = 10.0}) async {
    try {
      final properties = await _mapService.getNearby(latitude, longitude, radiusKm: radiusKm);
      state = AsyncValue.data(properties);
      return properties;
    } on Exception catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<String> geocodeAddress(String address) async {
    try {
      return await _mapService.geocodeAddress(address);
    } on Exception catch (_) {
      rethrow;
    }
  }

  Future<String> getRoute(String origin, String destination) async {
    try {
      return await _mapService.getRoute(origin, destination);
    } on Exception catch (_) {
      rethrow;
    }
  }

  Future<Position> getCurrentLocation() async {
    return await _mapService.getCurrentLocation();
  }
}

final mapProvider = AsyncNotifierProvider<MapNotifier, List<Property>>(() => MapNotifier());

final currentLocationProvider = FutureProvider<Position>((ref) async {
  final mapService = ref.read(mapServiceProvider);
  return mapService.getCurrentLocation();
});

final selectedPropertyProvider = StateProvider<Property?>((ref) => null);

final mapMarkersProvider = StateProvider<List<Property>>((ref) => []);

final safetyOverlayEnabledProvider = StateProvider<bool>((ref) => false);
