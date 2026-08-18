import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';

class QRGenerator {
  static String generateDataUrl({
    required String type,
    required String id,
    Map<String, dynamic>? payload,
  }) {
    final data = <String, dynamic>{
      'type': type,
      'id': id,
      'payload': payload ?? {},
    };
    return base64Url.encode(utf8.encode(jsonEncode(data)));
  }

  static String generatePropertyQr(String propertyId, {String? url}) {
    return generateDataUrl(
      type: 'property',
      id: propertyId,
      payload: {'url': url ?? 'https://homepulse.app/property/$propertyId'},
    );
  }

  static String generatePaymentQr(String leaseId, double amount) {
    return generateDataUrl(
      type: 'payment',
      id: leaseId,
      payload: {'amount': amount, 'currency': 'KES'},
    );
  }

  static QRValidation validateQrFormat(String qrString) {
    try {
      final decoded = utf8.decode(base64Url.decode(qrString));
      final data = jsonDecode(decoded) as Map<String, dynamic>;
      final type = data['type'] as String?;
      final id = data['id'] as String?;
      if (type == null || id == null) {
        return const QRValidation.valid(false, error: 'Missing type or id');
      }
      final validTypes = {'property', 'neighborhood', 'payment', 'verification'};
      if (!validTypes.contains(type)) {
        return QRValidation.valid(false, error: 'Unknown QR type: $type');
      }
      return QRValidation.valid(true, data: data);
    } on FormatException {
      return const QRValidation.valid(false, error: 'Invalid base64 encoding');
    } on TypeError {
      return const QRValidation.valid(false, error: 'Invalid QR content structure');
    }
  }

  static QRContentType? parseContentType(String qrString) {
    final validation = validateQrFormat(qrString);
    if (!validation.isValid || validation.data == null) return null;
    final type = validation.data!['type'] as String;
    switch (type) {
      case 'property':
        return QRContentType.property;
      case 'neighborhood':
        return QRContentType.neighborhood;
      case 'payment':
        return QRContentType.payment;
      case 'verification':
        return QRContentType.verification;
      default:
        return null;
    }
  }

  static Widget generateQrImage(String data, {double size = 200}) {
    return QrImageView(
      data: data,
      version: QrVersions.auto,
      size: size,
      errorCorrectionLevel: QrErrorCorrectLevel.M,
    );
  }
}

class QRValidation {
  final bool isValid;
  final String? error;
  final Map<String, dynamic>? data;

  const QRValidation.valid(this.isValid, {this.error, this.data});
}

enum QRContentType { property, neighborhood, payment, verification }
