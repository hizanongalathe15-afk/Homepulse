import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../../models/qr_code.dart';
import '../../../../services/qr_service.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/qr_code_display.dart';
import '../../../../core/utils/formatters.dart';

class QRCodeGeneratorScreen extends ConsumerStatefulWidget {
  const QRCodeGeneratorScreen({super.key});

  @override
  ConsumerState<QRCodeGeneratorScreen> createState() => _QRCodeGeneratorScreenState();
}

class _QRCodeGeneratorScreenState extends ConsumerState<QRCodeGeneratorScreen> {
  final TextEditingController _propertyIdController = TextEditingController();
  String? _generatedQrUrl;

  @override
  void initState() {
    super.initState();
    _loadQRCodes();
  }

  @override
  void dispose() {
    _propertyIdController.dispose();
    super.dispose();
  }

  void _loadQRCodes() {
    ref.read(qrProvider.notifier).loadQRs('landlord_1');
  }

  void _generateQR() {
    if (_propertyIdController.text.isEmpty) return;
    final qr = QRCodeData(
      id: 'qr_${DateTime.now().millisecondsSinceEpoch}',
      propertyId: _propertyIdController.text,
      landlordId: 'landlord_1',
      url: 'https://homepulse.app/property/${_propertyIdController.text}',
      createdAt: DateTime.now(),
    );
    ref.read(qrServiceProvider).generateQR(qr).then((result) {
      setState(() => _generatedQrUrl = result.url);
    });
  }

  @override
  Widget build(BuildContext context) {
    final qrAsync = ref.watch(qrProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('QR Code Generator')),
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
                  const Text('Generate New QR', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 12),
                  AppInput(
                    label: 'Property ID',
                    controller: _propertyIdController,
                    hintText: 'Enter property ID',
                  ),
                  const SizedBox(height: 16),
                  AppButton(text: 'Generate QR', onPressed: _generateQR),
                ],
              ),
            ),
            const SizedBox(height: 24),
            if (_generatedQrUrl != null) ...[
              const Text('Generated QR Code', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              const SizedBox(height: 12),
              Center(
                child: AppCard(
                  padding: const EdgeInsets.all(16),
                  child: QrCodeDisplay(data: _generatedQrUrl!, size: 200),
                ),
              ),
            ],
            const SizedBox(height: 24),
            const Text('My QR Codes', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            qrAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (_, __) => const Text('Failed to load QR codes'),
              data: (qrs) {
                if (qrs.isEmpty) {
                  return const Center(child: Text('No QR codes generated yet'));
                }
                return ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: qrs.length,
                  itemBuilder: (context, index) {
                    final qr = qrs[index];
                    return AppCard(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: ListTile(
                        leading: const Icon(Icons.qr_code, color: Colors.blue),
                        title: Text('Property: ${qr.propertyId}'),
                        subtitle: Text('Created: ${formatDate(qr.createdAt)}'),
                        trailing: Icon(qr.isActive ? Icons.check_circle : Icons.cancel, color: qr.isActive ? Colors.green : Colors.red),
                      ),
                    );
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
