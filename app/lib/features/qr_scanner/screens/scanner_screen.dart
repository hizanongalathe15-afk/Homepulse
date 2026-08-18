import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:homepulse/services/permission_service.dart';
import 'scan_result.dart';
import 'scan_history.dart';

class ScannerScreen extends StatefulWidget {
  const ScannerScreen({super.key});

  @override
  State<ScannerScreen> createState() => _ScannerScreenState();
}

class _ScannerScreenState extends State<ScannerScreen> {
  bool _hasCameraPermission = false;

  @override
  void initState() {
    super.initState();
    _checkCameraPermission();
  }

  Future<void> _checkCameraPermission() async {
    final granted = await PermissionService.request(PermissionType.camera);
    if (mounted) {
      setState(() => _hasCameraPermission = granted);
      if (!granted) {
        AppToast.error(context, 'Camera permission is required to scan QR codes');
      }
    }
  }

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
      body: _hasCameraPermission
          ? const Center(
              child: Text(
                'Position QR code within the frame',
                style: TextStyle(fontSize: 16),
                textAlign: TextAlign.center,
              ),
            )
          : Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.camera_alt_outlined, size: 48, color: Colors.grey),
                    const SizedBox(height: 16),
                    TextButton.icon(
                      onPressed: () => PermissionService.openSettings(),
                      icon: const Icon(Icons.settings),
                      label: const Text('Open Settings'),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
