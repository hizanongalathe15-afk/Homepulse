import 'package:homepulse/models/property.dart';

class SavedSearch {
  final String id;
  final String userId;
  final String name;
  final PropertySearchFilters filters;
  final bool isAlertEnabled;
  final DateTime createdAt;

  const SavedSearch({
    required this.id,
    required this.userId,
    required this.name,
    required this.filters,
    this.isAlertEnabled = true,
    required this.createdAt,
  });

  factory SavedSearch.fromJson(Map<String, dynamic> json) {
    return SavedSearch(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      name: json['name'] as String,
      filters: PropertySearchFilters(
        query: json['filters']?['query'] as String?,
        type: json['filters']?['type'] as String?,
        minPrice: json['filters']?['min_price'] != null ? (json['filters']['min_price'] as num).toDouble() : null,
        maxPrice: json['filters']?['max_price'] != null ? (json['filters']['max_price'] as num).toDouble() : null,
        minBedrooms: json['filters']?['min_bedrooms'] as int?,
        maxBedrooms: json['filters']?['max_bedrooms'] as int?,
        neighborhood: json['filters']?['neighborhood'] as String?,
        minSquareMeters: json['filters']?['min_square_meters'] != null ? (json['filters']['min_square_meters'] as num).toDouble() : null,
        amenities: json['filters']?['amenities'] != null ? List<String>.from(json['filters']['amenities']) : null,
        isAvailable: json['filters']?['is_available'] as bool?,
        isFeatured: json['filters']?['is_featured'] as bool?,
      ),
      isAlertEnabled: json['is_alert_enabled'] as bool? ?? true,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  SavedSearch copyWith({
    String? id,
    String? userId,
    String? name,
    PropertySearchFilters? filters,
    bool? isAlertEnabled,
    DateTime? createdAt,
  }) {
    return SavedSearch(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      filters: filters ?? this.filters,
      isAlertEnabled: isAlertEnabled ?? this.isAlertEnabled,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'name': name,
      'filters': filters.toQueryParams(),
      'is_alert_enabled': isAlertEnabled,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
