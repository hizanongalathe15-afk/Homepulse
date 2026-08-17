import 'package:flutter/material.dart';
import 'scan_result.dart';
import 'scan_history.dart';

class ScannerScreen extends StatelessWidget {
  const ScannerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan QR Code'),
        actions: [
          IconButton(
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ScanHistoryScreen())),
            icon: const Icon(Icons.history),
          ),
        ],
      ),
      body: const Center(
        child: Text(
          'Position QR code within the frame',
          style: TextStyle(fontSize: 16),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }
}
