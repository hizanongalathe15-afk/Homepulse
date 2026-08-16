import '../models/property.dart';

class FeedService {
  Future<List<Property>> fetchFeed({int page = 0, int limit = 10}) async {
    await Future.delayed(const Duration(milliseconds: 500));
    return List.generate(limit, (index) {
      final i = page * limit + index;
      return Property(
        id: 'prop_$i',
        title: 'Modern ${i + 1} Bedroom Apartment',
        description: 'A beautifully furnished apartment with modern amenities and stunning views.',
        price: 45000.0 + (i * 5000),
        location: 'Kilimani, Nairobi',
        imageUrls: ['https://picsum.photos/400/300?random=$i'],
        tags: ['Verified', 'Furnished'],
        landlordId: 'landlord_$i',
        isVerified: i % 2 == 0,
        rating: 3.5 + (i % 5) * 0.3,
        reviewCount: 10 + i,
        createdAt: DateTime.now().subtract(Duration(days: i)),
        isAvailable: i % 3 != 0,
      );
    });
  }

  Future<void> likeProperty(String propertyId) async {
    await Future.delayed(const Duration(milliseconds: 200));
  }

  Future<void> saveProperty(String propertyId) async {
    await Future.delayed(const Duration(milliseconds: 200));
  }
}
