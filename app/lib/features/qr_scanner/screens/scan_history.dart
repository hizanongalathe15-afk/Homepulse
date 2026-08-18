import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import '../../../../models/qr_code.dart';
import '../../../../services/qr_service.dart';
import '../../../../widgets/app_card.dart';
import '../../../../core/utils/formatters.dart';
import './scan_result.dart';

class ScanHistoryScreen extends StatelessWidget {
  const ScanHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Scan History')),
      body: FutureBuilder<List<QRCodeData>>(
        future: QRService().getLandlordQRs('landlord_1'),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError || (snapshot.data?.isEmpty ?? true)) {
            return const Center(child: Text('No scan history'));
          }
          final scans = snapshot.data!;
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: scans.length,
            itemBuilder: (context, index) {
              final scan = scans[index];
              return AppCard(
                margin: const EdgeInsets.only(bottom: 12),
                child: ListTile(
                  leading: Icon(LucideIcons.scan, color: Colors.blue),
                  title: Text('Property ${scan.propertyId}'),
                  subtitle: Text(formatDate(scan.createdAt)),
                  trailing: Icon(scan.isActive ? LucideIcons.circle_check : Icons.cancel, color: scan.isActive ? Colors.green : Colors.red),
                  onTap: () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => ScanResultScreen(qrCode: scan.url)));
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }
}
