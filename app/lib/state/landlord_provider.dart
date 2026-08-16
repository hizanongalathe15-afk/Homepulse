import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/property.dart';
import '../services/property_service.dart';

final propertyServiceProvider = Provider<PropertyService>((ref) => PropertyService());

final propertyProvider = FutureProvider.family<Property, String>((ref, propertyId) async {
  return ref.read(propertyServiceProvider).getProperty(propertyId);
});

final landlordPropertiesProvider = FutureProvider.family<List<Property>, String>((ref, landlordId) async {
  return ref.read(propertyServiceProvider).getLandlordProperties(landlordId);
});
