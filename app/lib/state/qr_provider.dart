import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/qr_code.dart';
import '../services/qr_service.dart';

final qrProvider = StateNotifierProvider<QRNotifier, AsyncValue<List<QRCodeData>>>((ref) {
  return QRNotifier(ref.read(qrServiceProvider));
});

class QRNotifier extends StateNotifier<AsyncValue<List<QRCodeData>>> {
  final QRService _qrService;

  QRNotifier(this._qrService) : super(const AsyncValue.loading());

  Future<void> loadQRs(String landlordId) async {
    try {
      final qrs = await _qrService.getLandlordQRs(landlordId);
      state = AsyncValue.data(qrs);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> generateQR(QRCodeData qr) async {
    try {
      final result = await _qrService.generateQR(qr);
      state = AsyncValue.data([result, ...state.value ?? []]);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> uploadBulk(List<QRCodeData> qrs) async {
    try {
      await _qrService.uploadBulkQRs(qrs);
      state = AsyncValue.data([...state.value ?? [], ...qrs]);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}
