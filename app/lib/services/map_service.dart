import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/network/api_exception.dart';
import 'package:homepulse/core/config/constants.dart';
import 'package:homepulse/models/property.dart';
import 'package:geolocator/geolocator.dart';
import 'package:homepulse/services/permission_service.dart';

class MapService {
  late final ApiClient _api = ApiClient(baseUrl: Constants.apiUrl);

  Future<List<Property>> getNearby(double latitude, double longitude, {double radiusKm = 10.0}) async {
    final response = await _api.get('/properties/nearby', queryParameters: {
      'lat': latitude,
      'lng': longitude,
      'radius_km': radiusKm,
    });
    final List<dynamic> list = response.data as List<dynamic>;
    return list.map((e) => Property.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<String> geocodeAddress(String address) async {
    final response = await _api.get('/map/geocode', queryParameters: {'address': address});
    final data = response.data as Map<String, dynamic>;
    return '${data['lat']},${data['lng']}';
  }

  Future<String> getRoute(String origin, String destination) async {
    final response = await _api.get('/map/route', queryParameters: {
      'origin': origin,
      'destination': destination,
    });
    final data = response.data as Map<String, dynamic>;
    return data['route_polyline'] as String;
  }

  Future<Position> getCurrentLocation() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw Exception('Location services are disabled');
    }

    final hasPermission = await PermissionService.check(PermissionType.location);
    if (!hasPermission) {
      final granted = await PermissionService.request(PermissionType.location);
      if (!granted) {
        throw Exception('Location permission denied');
      }
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('Location permission denied');
      }
    }
    if (permission == LocationPermission.deniedForever) {
      throw Exception('Location permission permanently denied');
    }
    return await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high);
  }
}

final mapServiceProvider = Provider<MapService>((ref) => MapService());
