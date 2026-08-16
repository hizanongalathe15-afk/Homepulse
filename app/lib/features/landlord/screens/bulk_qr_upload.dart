import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../models/qr_code.dart';
import '../../../../services/qr_service.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/app_input.dart';
import '../../../../widgets/app_toast.dart';

class BulkQRUploadScreen extends ConsumerStatefulWidget {
  const BulkQRUploadScreen({super.key});

  @override
  ConsumerState<BulkQRUploadScreen> createState() => _BulkQRUploadScreenState();
}

class _BulkQRUploadScreenState extends ConsumerState<BulkQRUploadScreen> {
  final TextEditingController _propertyIdsController = TextEditingController();
  bool _isUploading = false;

  Future<void> _uploadBulk() async {
    if (_propertyIdsController.text.isEmpty) return;
    setState(() => _isUploading = true);
    try {
      final ids = _propertyIdsController.text.split(',').map((e) => e.trim()).where((e) => e.isNotEmpty).toList();
      final qrs = ids.map((id) => QRCodeData(
        id: 'qr_${DateTime.now().millisecondsSinceEpoch}_$id',
        propertyId: id,
        landlordId: 'landlord_1',
        url: 'https://homepulse.app/property/$id',
        createdAt: DateTime.now(),
      )).toList();
      await ref.read(qrServiceProvider).uploadBulkQRs(qrs);
      ref.read(qrProvider.notifier).uploadBulk(qrs);
      AppToast.show(context, 'QR codes uploaded successfully');
      _propertyIdsController.clear();
    } catch (e) {
      AppToast.show(context, 'Upload failed', isError: true);
    } finally {
      setState(() => _isUploading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bulk QR Upload')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AppCard(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Upload Multiple QR Codes', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 12),
                  const Text('Enter property IDs separated by commas', style: TextStyle(fontSize: 13, color: Colors.grey)),
                  const SizedBox(height: 12),
                  AppInput(
                    label: 'Property IDs',
                    controller: _propertyIdsController,
                    hintText: 'prop_1, prop_2, prop_3',
                    isMultiline: true,
                  ),
                  const SizedBox(height: 16),
                  AppButton(
                    text: _isUploading ? 'Uploading...' : 'Upload QR Codes',
                    onPressed: _isUploading ? null : _uploadBulk,
                    isLoading: _isUploading,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text('Instructions', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            const Text('1. Make sure all property IDs are valid\n2. QR codes will be generated automatically\n3. You can download or share each QR code'),
          ],
        ),
      ),
    );
  }
}
