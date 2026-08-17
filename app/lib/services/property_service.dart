import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/config/constants.dart';
import '../models/property.dart';

class PropertyService {
  late final ApiClient _api = ApiClient(baseUrl: Constants.apiUrl);

  Future<Property> getProperty(String id) async {
    final response = await _api.get('/properties/$id');
    return Property.fromJson(response.data as Map<String, dynamic>);
  }

  Future<List<Property>> getLandlordProperties(String landlordId) async {
    final response = await _api.get('/properties', queryParameters: {
      'landlord_id': landlordId,
    });
    final List<dynamic> data = response.data as List<dynamic>;
    return data.map((json) => Property.fromJson(json as Map<String, dynamic>)).toList();
  }

  Future<Property> createProperty(Map<String, dynamic> propertyData) async {
    final response = await _api.post('/properties', data: propertyData);
    return Property.fromJson(response.data as Map<String, dynamic>);
  }

  Future<Property> updateProperty(String id, Map<String, dynamic> propertyData) async {
    final response = await _api.put('/properties/$id', data: propertyData);
    return Property.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> deleteProperty(String id) async {
    await _api.delete('/properties/$id');
  }
}

final propertyServiceProvider = Provider<PropertyService>((ref) => PropertyService());
