import 'package:flutter/material.dart';

enum PropertyType {
  apartment,
  house,
  studio,
  bedsit,
  maisonette,
  townhouse,
  villa,
  commercial,
  land,
  nyumbaYaMabati,
  singleRoom,
  selfContained,
  guestHouse,
  hostelRoom,
  office,
  shop,
  warehouse,
  factory,
  agricultural,
}

enum FurnishedLevel { unfurnished, semiFurnished, fullyFurnished }

enum PropertyAmenity {
  airConditioning,
  balcony,
  terrace,
  garden,
  swimmingPool,
  gym,
  elevator,
  laundry,
  dishwasher,
  wifi,
  parking,
  security,
  fencing,
}

class PropertyTypeData {
  final String label;
  final IconData icon;
  final String value;

  const PropertyTypeData({
    required this.label,
    required this.icon,
    required this.value,
  });

  static const all = <String, PropertyTypeData>{
    'APARTMENT': PropertyTypeData(label: 'Apartment', icon: Icons.apartment, value: 'APARTMENT'),
    'HOUSE': PropertyTypeData(label: 'House', icon: Icons.home, value: 'HOUSE'),
    'STUDIO': PropertyTypeData(label: 'Studio', icon: Icons.hotel, value: 'STUDIO'),
    'BEDSITTER': PropertyTypeData(label: 'Bedsitter', icon: Icons.single_bed, value: 'BEDSITTER'),
    'MAISONETTE': PropertyTypeData(label: 'Maisonette', icon: Icons.home_work, value: 'MAISONETTE'),
    'TOWNHOUSE': PropertyTypeData(label: 'Townhouse', icon: Icons.house_rounded, value: 'TOWNHOUSE'),
    'VILLA': PropertyTypeData(label: 'Villa', icon: Icons.villa, value: 'VILLA'),
    'COMMERCIAL': PropertyTypeData(label: 'Commercial', icon: Icons.business, value: 'COMMERCIAL'),
    'LAND': PropertyTypeData(label: 'Land', icon: Icons.landscape, value: 'LAND'),
    'NYUMBA_YA_MABATI': PropertyTypeData(label: 'Nyumba ya Mabati', icon: Icons.home_work, value: 'NYUMBA_YA_MABATI'),
    'SINGLE_ROOM': PropertyTypeData(label: 'Single Room', icon: Icons.hotel, value: 'SINGLE_ROOM'),
    'SELF_CONTAINED': PropertyTypeData(label: 'Self-Contained', icon: Icons.single_bed, value: 'SELF_CONTAINED'),
    'GUEST_HOUSE': PropertyTypeData(label: 'Guest House', icon: Icons.house, value: 'GUEST_HOUSE'),
    'HOSTEL_ROOM': PropertyTypeData(label: 'Hostel Room', icon: Icons.hotel, value: 'HOSTEL_ROOM'),
    'OFFICE': PropertyTypeData(label: 'Office', icon: Icons.business, value: 'OFFICE'),
    'SHOP': PropertyTypeData(label: 'Shop', icon: Icons.storefront, value: 'SHOP'),
    'WAREHOUSE': PropertyTypeData(label: 'Warehouse', icon: Icons.warehouse, value: 'WAREHOUSE'),
    'FACTORY': PropertyTypeData(label: 'Factory', icon: Icons.factory, value: 'FACTORY'),
    'AGRICULTURAL': PropertyTypeData(label: 'Agricultural', icon: Icons.eco, value: 'AGRICULTURAL'),
  };

  static PropertyTypeData? fromValue(String? value) => all[value];
}

class PropertyLandlord {
  final String id;
  final String name;
  final String? avatarUrl;
  final bool isVerified;
  final bool isOnline;
  final DateTime? lastSeen;
  final double? rating;
  final int? responseTimeMinutes;
  final int? totalProperties;

  PropertyLandlord({
    required this.id,
    required this.name,
    this.avatarUrl,
    this.isVerified = false,
    this.isOnline = false,
    this.lastSeen,
    this.rating,
    this.responseTimeMinutes,
    this.totalProperties,
  });

  factory PropertyLandlord.fromJson(Map<String, dynamic> json) => PropertyLandlord(
        id: json['id'] as String,
        name: json['name'] as String? ??
            json['firstName'] as String? ?? 'Unknown',
        avatarUrl: json['avatarUrl'] as String? ?? json['profileImage'] as String?,
        isVerified: json['isVerified'] as bool? ?? false,
        isOnline: json['isOnline'] as bool? ?? false,
        lastSeen: json['lastSeen'] != null
            ? DateTime.parse(json['lastSeen'] as String)
            : null,
        rating: (json['rating'] as num?)?.toDouble(),
        responseTimeMinutes: json['responseTimeMinutes'] as int?,
        totalProperties: json['totalProperties'] as int?,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'avatarUrl': avatarUrl,
        'isVerified': isVerified,
        'isOnline': isOnline,
        'lastSeen': lastSeen?.toIso8601String(),
        'rating': rating,
        'responseTimeMinutes': responseTimeMinutes,
        'totalProperties': totalProperties,
      };
}

class PropertyMetrics {
  final int views;
  final int saves;
  final int inquiries;
  final int shares;

  PropertyMetrics({
    this.views = 0,
    this.saves = 0,
    this.inquiries = 0,
    this.shares = 0,
  });

  factory PropertyMetrics.fromJson(Map<String, dynamic> json) => PropertyMetrics(
        views: json['views'] as int? ?? 0,
        saves: json['saves'] as int? ?? 0,
        inquiries: json['inquiries'] as int? ?? 0,
        shares: json['shares'] as int? ?? 0,
      );
}

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
  final String? furnishedLevel;
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
    this.furnishedLevel,
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
    String? furnishedLevel,
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
    bool clearFurnishedLevel = false,
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
      neighborhood:
          clearNeighborhood ? null : (neighborhood ?? this.neighborhood),
      minSquareMeters: clearMinSquareMeters
          ? null
          : (minSquareMeters ?? this.minSquareMeters),
      amenities: clearAmenities ? null : (amenities ?? this.amenities),
      furnishedLevel:
          clearFurnishedLevel ? null : (furnishedLevel ?? this.furnishedLevel),
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
    if (neighborhood != null && neighborhood!.isNotEmpty) {
      params['neighborhood'] = neighborhood;
    }
    if (minSquareMeters != null) params['min_square_meters'] = minSquareMeters;
    if (amenities != null && amenities!.isNotEmpty) {
      params['amenities'] = amenities;
    }
    if (furnishedLevel != null && furnishedLevel!.isNotEmpty) {
      params['furnished_level'] = furnishedLevel;
    }
    if (isAvailable != null) params['is_available'] = isAvailable;
    if (isFeatured != null) params['is_featured'] = isFeatured;
    return params;
  }

  bool get isEmpty {
    return query == null ||
        query!.isEmpty &&
            type == null &&
            minPrice == null &&
            maxPrice == null &&
            minBedrooms == null &&
            maxBedrooms == null &&
            (neighborhood == null || neighborhood!.isEmpty) &&
            minSquareMeters == null &&
            (amenities == null || amenities!.isEmpty) &&
            (furnishedLevel == null || furnishedLevel!.isEmpty) &&
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
  final PropertyType type;
  final int bedrooms;
  final int bathrooms;
  final double? squareMeters;
  final int? yearBuilt;
  final FurnishedLevel? furnishedLevel;
  final String? floorNumber;
  final int? totalFloors;
  final int parkingSpaces;
  final bool isPetFriendly;
  final bool isWheelchairAccessible;
  final List<PropertyAmenity> amenities;
  final PropertyLandlord? landlord;
  final PropertyMetrics? metrics;

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
    this.type = PropertyType.apartment,
    this.bedrooms = 0,
    this.bathrooms = 0,
    this.squareMeters,
    this.yearBuilt,
    this.furnishedLevel,
    this.floorNumber,
    this.totalFloors,
    this.parkingSpaces = 0,
    this.isPetFriendly = false,
    this.isWheelchairAccessible = false,
    this.amenities = const [],
    this.landlord,
    this.metrics,
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
    PropertyType? type,
    int? bedrooms,
    int? bathrooms,
    double? squareMeters,
    int? yearBuilt,
    FurnishedLevel? furnishedLevel,
    String? floorNumber,
    int? totalFloors,
    int? parkingSpaces,
    bool? isPetFriendly,
    bool? isWheelchairAccessible,
    List<PropertyAmenity>? amenities,
    PropertyLandlord? landlord,
    PropertyMetrics? metrics,
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
      type: type ?? this.type,
      bedrooms: bedrooms ?? this.bedrooms,
      bathrooms: bathrooms ?? this.bathrooms,
      squareMeters: squareMeters ?? this.squareMeters,
      yearBuilt: yearBuilt ?? this.yearBuilt,
      furnishedLevel: furnishedLevel ?? this.furnishedLevel,
      floorNumber: floorNumber ?? this.floorNumber,
      totalFloors: totalFloors ?? this.totalFloors,
      parkingSpaces: parkingSpaces ?? this.parkingSpaces,
      isPetFriendly: isPetFriendly ?? this.isPetFriendly,
      isWheelchairAccessible:
          isWheelchairAccessible ?? this.isWheelchairAccessible,
      amenities: amenities ?? this.amenities,
      landlord: landlord ?? this.landlord,
      metrics: metrics ?? this.metrics,
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
      'type': type,
      'bedrooms': bedrooms,
      'bathrooms': bathrooms,
      'square_meters': squareMeters,
      'year_built': yearBuilt,
      'furnished_level': furnishedLevel?.toString().split('.').last,
      'floor_number': floorNumber,
      'total_floors': totalFloors,
      'parking_spaces': parkingSpaces,
      'is_pet_friendly': isPetFriendly,
      'is_wheelchair_accessible': isWheelchairAccessible,
      'amenities': amenities.map((a) => a.toString().split('.').last).toList(),
      'landlord': landlord?.toJson(),
      'metrics': metrics != null ? {
        'views': metrics!.views,
        'saves': metrics!.saves,
        'inquiries': metrics!.inquiries,
        'shares': metrics!.shares,
      } : null,
    };
  }

  factory Property.fromJson(Map<String, dynamic> json) {
    return Property(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String? ?? '',
      price: (json['price'] as num).toDouble(),
      location: json['location'] as String,
      imageUrls: (json['image_urls'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
      tags:
          (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ??
              [],
      landlordId: json['landlord_id'] as String? ?? '',
      isVerified: json['is_verified'] as bool? ?? false,
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      reviewCount: json['review_count'] as int? ?? 0,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : DateTime.now(),
      isAvailable: json['is_available'] as bool? ?? true,
      type: _parsePropertyType(json['type'] as String?),
      bedrooms: json['bedrooms'] as int? ?? 0,
      bathrooms: json['bathrooms'] as int? ?? 0,
      squareMeters:
          (json['square_meters'] as num?)?.toDouble(),
      yearBuilt: json['year_built'] as int?,
      furnishedLevel: _parseFurnishedLevel(json['furnished_level'] as String?),
      floorNumber: json['floor_number'] as String?,
      totalFloors: json['total_floors'] as int?,
      parkingSpaces: json['parking_spaces'] as int? ?? 0,
      isPetFriendly: json['is_pet_friendly'] as bool? ?? false,
      isWheelchairAccessible:
          json['is_wheelchair_accessible'] as bool? ?? false,
      amenities: _parseAmenities(json['amenities']),
      landlord: json['landlord'] != null
          ? PropertyLandlord.fromJson(json['landlord'] as Map<String, dynamic>)
          : null,
      metrics: json['metrics'] != null
          ? PropertyMetrics.fromJson(json['metrics'] as Map<String, dynamic>)
          : null,
    );
  }

  static PropertyType _parsePropertyType(String? type) {
    final typeMap = {
      'APARTMENT': PropertyType.apartment,
      'HOUSE': PropertyType.house,
      'STUDIO': PropertyType.studio,
      'BEDSITTER': PropertyType.bedsit,
      'MAISONETTE': PropertyType.maisonette,
      'TOWNHOUSE': PropertyType.townhouse,
      'VILLA': PropertyType.villa,
      'COMMERCIAL': PropertyType.commercial,
      'LAND': PropertyType.land,
      'NYUMBA_YA_MABATI': PropertyType.nyumbaYaMabati,
      'SINGLE_ROOM': PropertyType.singleRoom,
      'SELF_CONTAINED': PropertyType.selfContained,
      'GUEST_HOUSE': PropertyType.guestHouse,
      'HOSTEL_ROOM': PropertyType.hostelRoom,
      'OFFICE': PropertyType.office,
      'SHOP': PropertyType.shop,
      'WAREHOUSE': PropertyType.warehouse,
      'FACTORY': PropertyType.factory,
      'AGRICULTURAL': PropertyType.agricultural,
    };
    return typeMap[type?.toUpperCase()] ?? PropertyType.apartment;
  }

  static FurnishedLevel? _parseFurnishedLevel(String? level) {
    if (level == null) return null;
    switch (level.toUpperCase()) {
      case 'UNFURNISHED':
        return FurnishedLevel.unfurnished;
      case 'SEMI_FURNISHED':
        return FurnishedLevel.semiFurnished;
      case 'FULLY_FURNISHED':
        return FurnishedLevel.fullyFurnished;
      default:
        return null;
    }
  }

  static List<PropertyAmenity> _parseAmenities(dynamic data) {
    if (data == null) return [];
    final amenityMap = {
      'AIR_CONDITIONING': PropertyAmenity.airConditioning,
      'BALCONY': PropertyAmenity.balcony,
      'TERRACE': PropertyAmenity.terrace,
      'GARDEN': PropertyAmenity.garden,
      'SWIMMING_POOL': PropertyAmenity.swimmingPool,
      'GYM': PropertyAmenity.gym,
      'ELEVATOR': PropertyAmenity.elevator,
      'LAUNDRY': PropertyAmenity.laundry,
      'DISHWASHER': PropertyAmenity.dishwasher,
      'WIFI': PropertyAmenity.wifi,
      'PARKING': PropertyAmenity.parking,
      'SECURITY': PropertyAmenity.security,
      'FENCING': PropertyAmenity.fencing,
    };
    return (data as List<dynamic>).map((e) {
      final val = (e as String).toUpperCase();
      return amenityMap[val] ?? PropertyAmenity.values.first;
    }).toList();
  }
}
