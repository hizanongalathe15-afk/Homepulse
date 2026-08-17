import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/property.dart';

class PropertyService {
  Future<Property> getProperty(String id) async {
    await Future.delayed(const Duration(milliseconds: 300));
    return Property(
      id: id,
      title: 'Sample Property',
      description: 'A wonderful property.',
      price: 50000,
      location: 'Nairobi, Kenya',
      imageUrls: ['https://picsum.photos/400/300?random=1'],
      tags: ['Verified'],
      landlordId: 'landlord_1',
      isVerified: true,
      createdAt: DateTime.now(),
    );
  }

  Future<List<Property>> getLandlordProperties(String landlordId) async {
    await Future.delayed(const Duration(milliseconds: 300));
    return List.generate(3, (i) => Property(
      id: 'prop_$i',
      title: 'Property $i',
      description: 'Description $i',
      price: 45000 + i * 5000,
      location: 'Nairobi',
      imageUrls: ['https://picsum.photos/400/300?random=$i'],
      tags: ['Verified'],
      landlordId: landlordId,
      isVerified: true,
      createdAt: DateTime.now().subtract(Duration(days: i)),
    ));
  }

  Future<void> createProperty(Property property) async {
    await Future.delayed(const Duration(milliseconds: 400));
  }

  Future<void> updateProperty(Property property) async {
    await Future.delayed(const Duration(milliseconds: 400));
  }

  Future<void> deleteProperty(String id) async {
    await Future.delayed(const Duration(milliseconds: 300));
  }
}
