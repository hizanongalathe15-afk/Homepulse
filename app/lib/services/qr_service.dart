import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/config/constants.dart';
import '../models/qr_code.dart';

class QRService {
  late final ApiClient _api = ApiClient(baseUrl: Constants.apiUrl);

  Future<QRCodeData> generateQR(QRCodeData qr) async {
    final response = await _api.post('/qr/generate', data: qr.toJson());
    return QRCodeData.fromJson(response.data as Map<String, dynamic>);
  }

  Future<List<QRCodeData>> getLandlordQRs(String landlordId) async {
    final response = await _api.get('/qr', queryParameters: {
      'landlord_id': landlordId,
    });
    final List<dynamic> data = response.data as List<dynamic>;
    return data.map((json) => QRCodeData.fromJson(json as Map<String, dynamic>)).toList();
  }

  Future<void> uploadBulkQRs(List<QRCodeData> qrs) async {
    await _api.post('/qr/bulk', data: {
      'qrs': qrs.map((qr) => qr.toJson()).toList(),
    });
  }

  Future<void> deactivateQR(String qrId) async {
    await _api.patch('/qr/$qrId/deactivate');
  }
}

final qrServiceProvider = Provider<QRService>((ref) => QRService());
