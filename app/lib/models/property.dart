import 'package:flutter/foundation.dart';

class PropertySearchFilters {
  final String? query;
  final String? type;
  final double? minPrice;
  final double? maxPrice;
  final int? minBedrooms;
  final int? maxBedrooms;
  final String? neighborhood;
  final double? minSquareMeters;
  final List<String>? amenities;
  final bool? isAvailable;
  final bool? isFeatured;

  const PropertySearchFilters({
    this.query,
    this.type,
    this.minPrice,
    this.maxPrice,
    this.minBedrooms,
    this.maxBedrooms,
    this.neighborhood,
    this.minSquareMeters,
    this.amenities,
    this.isAvailable,
    this.isFeatured,
  });

  PropertySearchFilters copyWith({
    String? query,
    String? type,
    double? minPrice,
    double? maxPrice,
    int? minBedrooms,
    int? maxBedrooms,
    String? neighborhood,
    double? minSquareMeters,
    List<String>? amenities,
    bool? isAvailable,
    bool? isFeatured,
    bool clearQuery = false,
    bool clearType = false,
    bool clearMinPrice = false,
    bool clearMaxPrice = false,
    bool clearMinBedrooms = false,
    bool clearMaxBedrooms = false,
    bool clearNeighborhood = false,
    bool clearMinSquareMeters = false,
    bool clearAmenities = false,
    bool clearIsAvailable = false,
    bool clearIsFeatured = false,
  }) {
    return PropertySearchFilters(
      query: clearQuery ? null : (query ?? this.query),
      type: clearType ? null : (type ?? this.type),
      minPrice: clearMinPrice ? null : (minPrice ?? this.minPrice),
      maxPrice: clearMaxPrice ? null : (maxPrice ?? this.maxPrice),
      minBedrooms: clearMinBedrooms ? null : (minBedrooms ?? this.minBedrooms),
      maxBedrooms: clearMaxBedrooms ? null : (maxBedrooms ?? this.maxBedrooms),
      neighborhood: clearNeighborhood ? null : (neighborhood ?? this.neighborhood),
      minSquareMeters: clearMinSquareMeters ? null : (minSquareMeters ?? this.minSquareMeters),
      amenities: clearAmenities ? null : (amenities ?? this.amenities),
      isAvailable: clearIsAvailable ? null : (isAvailable ?? this.isAvailable),
      isFeatured: clearIsFeatured ? null : (isFeatured ?? this.isFeatured),
    );
  }

  Map<String, dynamic> toQueryParams() {
    final params = <String, dynamic>{};
    if (query != null && query!.isNotEmpty) params['q'] = query;
    if (type != null && type!.isNotEmpty) params['type'] = type;
    if (minPrice != null) params['min_price'] = minPrice;
    if (maxPrice != null) params['max_price'] = maxPrice;
    if (minBedrooms != null) params['min_bedrooms'] = minBedrooms;
    if (maxBedrooms != null) params['max_bedrooms'] = maxBedrooms;
    if (neighborhood != null && neighborhood!.isNotEmpty) params['neighborhood'] = neighborhood;
    if (minSquareMeters != null) params['min_square_meters'] = minSquareMeters;
    if (amenities != null && amenities!.isNotEmpty) params['amenities'] = amenities;
    if (isAvailable != null) params['is_available'] = isAvailable;
    if (isFeatured != null) params['is_featured'] = isFeatured;
    return params;
  }

  bool get isEmpty {
    return query == null || query!.isEmpty &&
        type == null &&
        minPrice == null &&
        maxPrice == null &&
        minBedrooms == null &&
        maxBedrooms == null &&
        (neighborhood == null || neighborhood!.isEmpty) &&
        minSquareMeters == null &&
        (amenities == null || amenities!.isEmpty) &&
        isAvailable == null &&
        isFeatured == null;
  }

  bool get isNotEmpty => !isEmpty;
}

class Property {
  final String id;
  final String title;
  final String description;
  final double price;
  final String location;
  final List<String> imageUrls;
  final List<String> tags;
  final String landlordId;
  final bool isVerified;
  final double rating;
  final int reviewCount;
  final DateTime createdAt;
  final bool isAvailable;

  Property({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.location,
    required this.imageUrls,
    required this.tags,
    required this.landlordId,
    this.isVerified = false,
    this.rating = 0.0,
    this.reviewCount = 0,
    required this.createdAt,
    this.isAvailable = true,
  });

  Property copyWith({
    String? id,
    String? title,
    String? description,
    double? price,
    String? location,
    List<String>? imageUrls,
    List<String>? tags,
    String? landlordId,
    bool? isVerified,
    double? rating,
    int? reviewCount,
    DateTime? createdAt,
    bool? isAvailable,
  }) {
    return Property(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      price: price ?? this.price,
      location: location ?? this.location,
      imageUrls: imageUrls ?? this.imageUrls,
      tags: tags ?? this.tags,
      landlordId: landlordId ?? this.landlordId,
      isVerified: isVerified ?? this.isVerified,
      rating: rating ?? this.rating,
      reviewCount: reviewCount ?? this.reviewCount,
      createdAt: createdAt ?? this.createdAt,
      isAvailable: isAvailable ?? this.isAvailable,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'price': price,
      'location': location,
      'image_urls': imageUrls,
      'tags': tags,
      'landlord_id': landlordId,
      'is_verified': isVerified,
      'rating': rating,
      'review_count': reviewCount,
      'created_at': createdAt.toIso8601String(),
      'is_available': isAvailable,
    };
  }

  factory Property.fromJson(Map<String, dynamic> json) {
    return Property(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      price: json['price'] as double,
      location: json['location'] as String,
      imageUrls: (json['image_urls'] as List<dynamic>).map((e) => e as String).toList(),
      tags: (json['tags'] as List<dynamic>).map((e) => e as String).toList(),
      landlordId: json['landlord_id'] as String,
      isVerified: json['is_verified'] as bool? ?? false,
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      reviewCount: json['review_count'] as int? ?? 0,
      createdAt: DateTime.parse(json['created_at'] as String),
      isAvailable: json['is_available'] as bool? ?? true,
    );
  }
}
