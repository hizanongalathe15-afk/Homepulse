import 'dart:convert';
import 'package:qr_flutter/qr_flutter.dart';

class QRCodeData {
  final String id;
  final String propertyId;
  final String landlordId;
  final String url;
  final DateTime createdAt;
  final bool isActive;

  QRCodeData({
    required this.id,
    required this.propertyId,
    required this.landlordId,
    required this.url,
    required this.createdAt,
    this.isActive = true,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'propertyId': propertyId,
    'landlordId': landlordId,
    'url': url,
    'createdAt': createdAt.toIso8601String(),
    'isActive': isActive,
  };

  factory QRCodeData.fromJson(Map<String, dynamic> json) => QRCodeData(
    id: json['id'] as String,
    propertyId: json['propertyId'] as String,
    landlordId: json['landlordId'] as String,
    url: json['url'] as String,
    createdAt: DateTime.parse(json['createdAt'] as String),
    isActive: json['isActive'] as bool? ?? true,
  );

  String generateQrString() {
    final payload = {'id': id, 'propertyId': propertyId, 'url': url};
    return base64Url.encode(utf8.encode(jsonEncode(payload)));
  }
}
