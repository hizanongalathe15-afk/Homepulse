import '../models/qr_code.dart';

class QRService {
  Future<QRCodeData> generateQR(QRCodeData qr) async {
    await Future.delayed(const Duration(milliseconds: 300));
    return qr;
  }

  Future<List<QRCodeData>> getLandlordQRs(String landlordId) async {
    await Future.delayed(const Duration(milliseconds: 300));
    return List.generate(3, (i) => QRCodeData(
      id: 'qr_$i',
      propertyId: 'prop_$i',
      landlordId: landlordId,
      url: 'https://homepulse.app/property/prop_$i',
      createdAt: DateTime.now().subtract(Duration(days: i)),
      isActive: true,
    ));
  }

  Future<void> uploadBulkQRs(List<QRCodeData> qrs) async {
    await Future.delayed(const Duration(milliseconds: 600));
  }

  Future<void> deactivateQR(String qrId) async {
    await Future.delayed(const Duration(milliseconds: 200));
  }
}
