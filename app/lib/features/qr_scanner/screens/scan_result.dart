import 'package:flutter/material.dart';
import '../../../../models/qr_code.dart';
import '../../../../services/qr_service.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_button.dart';
import '../../../../core/utils/formatters.dart';

class ScanResultScreen extends StatelessWidget {
  final String qrCode;

  const ScanResultScreen({
    super.key,
    required this.qrCode,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Scan Result')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const Icon(Icons.check_circle, size: 80, color: Colors.green),
            const SizedBox(height: 24),
            const Text('QR Code Scanned', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            Text(qrCode, style: const TextStyle(fontSize: 14, color: Colors.grey)),
            const SizedBox(height: 24),
            AppCard(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  const Row(children: [Icon(Icons.home, color: Colors.blue), SizedBox(width: 12), Text('Property Details', style: TextStyle(fontWeight: FontWeight.w600))]),
                  const SizedBox(height: 12),
                  _buildDetailRow('Property ID', 'prop_123'),
                  _buildDetailRow('Location', 'Kilimani, Nairobi'),
                  _buildDetailRow('Price', 'KES 65,000/month'),
                  _buildDetailRow('Status', 'Available'),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: AppButton(
                    text: 'View Property',
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Opening property details...')));
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: AppButton(
                    text: 'Save',
                    isOutlined: true,
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Saved to history')));
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(width: 100, child: Text(label, style: const TextStyle(color: Colors.grey, fontSize: 13))),
          Expanded(child: Text(value, style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 13))),
        ],
      ),
    );
  }
}
