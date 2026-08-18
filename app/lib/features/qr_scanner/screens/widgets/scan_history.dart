import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/formatters.dart';
import '../../../../core/utils/qr_generator.dart';
import '../../../../widgets/app_card.dart';
import 'scan_result.dart';

class ScanHistoryScreen extends StatefulWidget {
  const ScanHistoryScreen({super.key});

  @override
  State<ScanHistoryScreen> createState() => _ScanHistoryScreenState();
}

class _ScanHistoryScreenState extends State<ScanHistoryScreen> {
  final List<ScanHistoryItem> _scanHistory = [
    ScanHistoryItem(
      id: 'scan_1',
      qrData: 'homepulse://property/prop_1',
      propertyId: 'prop_1',
      scannedAt: DateTime.now().subtract(const Duration(hours: 2)),
      type: 'property',
    ),
    ScanHistoryItem(
      id: 'scan_2',
      qrData: 'homepulse://property/prop_2',
      propertyId: 'prop_2',
      scannedAt: DateTime.now().subtract(const Duration(days: 1)),
      type: 'property',
    ),
    ScanHistoryItem(
      id: 'scan_3',
      qrData: 'homepulse://payment/lease_1',
      propertyId: 'lease_1',
      scannedAt: DateTime.now().subtract(const Duration(days: 3)),
      type: 'payment',
    ),
  ];

  void _clearHistory() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear History'),
        content: const Text('Are you sure you want to clear all scan history?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              setState(() => _scanHistory.clear());
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('History cleared')),
              );
            },
            child: const Text('Clear', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan History'),
        actions: [
          if (_scanHistory.isNotEmpty)
            IconButton(
              onPressed: _clearHistory,
              icon: Icon(LucideIcons.trash_2),
              tooltip: 'Clear history',
            ),
        ],
      ),
      body: _scanHistory.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.history_outlined, size: 64, color: theme.disabledColor),
                  const SizedBox(height: 16),
                  Text(
                    'No scan history',
                    style: theme.textTheme.titleMedium,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Scanned QR codes will appear here',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _scanHistory.length,
              itemBuilder: (context, index) {
                final item = _scanHistory[index];
                return _ScanHistoryTile(item: item);
              },
            ),
    );
  }
}

class _ScanHistoryTile extends StatelessWidget {
  final ScanHistoryItem item;

  const _ScanHistoryTile({required this.item});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final validation = QRGenerator.validateQrFormat(item.qrData);

    return AppCard(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (_) => ScanResultScreen(qrCode: item.qrData),
            ),
          );
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: _getTypeColor(item.type).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  _getTypeIcon(item.type),
                  color: _getTypeColor(item.type),
                  size: 24,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.propertyId,
                      style: theme.textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      validation.isValid ? 'Valid QR Code' : validation.error ?? 'Invalid',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: validation.isValid ? AppColors.success : AppColors.error,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Scanned ${formatTimeAgo(item.scannedAt)}',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.chevron_right_rounded,
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Color _getTypeColor(String type) {
    switch (type.toLowerCase()) {
      case 'property':
        return AppColors.primary;
      case 'payment':
        return AppColors.success;
      case 'verification':
        return AppColors.info;
      default:
        return AppColors.textSecondary;
    }
  }

  IconData _getTypeIcon(String type) {
    switch (type.toLowerCase()) {
      case 'property':
        return Icons.home_rounded;
      case 'payment':
        return Icons.payment_rounded;
      case 'verification':
        return Icons.verified_user_rounded;
      default:
        return Icons.qr_code_rounded;
    }
  }
}

class ScanHistoryItem {
  final String id;
  final String qrData;
  final String propertyId;
  final DateTime scannedAt;
  final String type;

  ScanHistoryItem({
    required this.id,
    required this.qrData,
    required this.propertyId,
    required this.scannedAt,
    required this.type,
  });
}
