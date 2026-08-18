import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/qr_code.dart';
import '../../../../services/qr_service.dart';
import '../../../../state/qr_provider.dart';
import '../../../../widgets/app_input.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/app_dropdown.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/qr_code_display.dart';
import '../../../../widgets/app_toast.dart';

class QRCodeGeneratorScreen extends ConsumerWidget {
  final String landlordId;

  const QRCodeGeneratorScreen({
    super.key,
    required this.landlordId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final qrAsync = ref.watch(qrProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('QR Code Generator'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _GenerateForm(
              landlordId: landlordId,
              onGenerate: (qr, generated) async {
                try {
                  final generatedQr = await ref.read(qrServiceProvider).generateQR(qr);
                  ref.read(qrProvider.notifier).generateQR(generatedQr);
                  if (context.mounted) {
                    _showGeneratedDialog(context, generated);
                  }
                } catch (e) {
                  if (context.mounted) {
                    AppToast.error(context, 'Failed to generate QR code');
                  }
                }
              },
            ),
            const SizedBox(height: 24),
            Text(
              'Your QR Codes',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 12),
            qrAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (error, _) => Center(
                child: Column(
                  children: [
                    Icon(LucideIcons.circle_alert, size: 48, color: Colors.red),
                    const SizedBox(height: 16),
                    Text('Failed to load QR codes', style: Theme.of(context).textTheme.titleMedium),
                  ],
                ),
              ),
              data: (qrs) {
                if (qrs.isEmpty) {
                  return Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Text(
                        'No QR codes generated yet',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ),
                  );
                }
                return GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.85,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  itemCount: qrs.length,
                  itemBuilder: (context, index) {
                    final qr = qrs[index];
                    return _QrCard(
                      qr: qr,
                      onDeactivate: () async {
                        try {
                          await ref.read(qrServiceProvider).deactivateQR(qr.id);
                          if (context.mounted) {
                            AppToast.success(context, 'QR code deactivated');
                          }
                        } catch (e) {
                          if (context.mounted) {
                            AppToast.error(context, 'Failed to deactivate QR code');
                          }
                        }
                      },
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

  void _showGeneratedDialog(BuildContext context, String qrData) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('QR Code Generated'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            QRCodeDisplay(
              data: qrData,
              size: 200,
            ),
            const SizedBox(height: 16),
            Text(
              'Scan this QR code to view the property',
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }
}

class _GenerateForm extends StatefulWidget {
  final String landlordId;
  final Future<void> Function(QRCodeData qr, String generated)? onGenerate;

  const _GenerateForm({
    required this.landlordId,
    this.onGenerate,
  });

  @override
  State<_GenerateForm> createState() => _GenerateFormState();
}

class _GenerateFormState extends State<_GenerateForm> {
  final TextEditingController _propertyIdController = TextEditingController();
  final TextEditingController _urlController = TextEditingController();
  String _selectedType = 'property';
  bool _isGenerating = false;

  final List<Map<String, String>> _qrTypes = [
    {'value': 'property', 'label': 'Property Listing'},
    {'value': 'payment', 'label': 'Payment'},
    {'value': 'verification', 'label': 'Verification'},
  ];

  Future<void> _generateQR() async {
    final propertyId = _propertyIdController.text.trim();
    final url = _urlController.text.trim();

    if (propertyId.isEmpty && url.isEmpty) {
      AppToast.error(context, 'Please enter a property ID or URL');
      return;
    }

    setState(() => _isGenerating = true);

    try {
      final qr = QRCodeData(
        id: 'qr_${DateTime.now().millisecondsSinceEpoch}',
        propertyId: propertyId,
        landlordId: widget.landlordId,
        url: url.isNotEmpty ? url : 'https://homepulse.app/property/$propertyId',
        createdAt: DateTime.now(),
        isActive: true,
      );

      final generated = qr.generateQrString();
      if (widget.onGenerate != null) {
        await widget.onGenerate!(qr, generated);
      }
    } catch (e) {
      if (mounted) {
        AppToast.error(context, 'Failed to generate QR code');
      }
    } finally {
      if (mounted) {
        setState(() => _isGenerating = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: theme.colorScheme.outlineVariant.withOpacity(0.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Generate New QR',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 16),
          AppDropdown<String>(
            items: _qrTypes.map((t) => t['value']!).toList(),
            value: _selectedType,
            hintText: 'QR Type',
            itemLabelBuilder: (type) {
              final item = _qrTypes.firstWhere((t) => t['value'] == type);
              return item['label']!;
            },
            onChanged: (value) {
              if (value != null) setState(() => _selectedType = value);
            },
          ),
          const SizedBox(height: 12),
          AppInput(
            controller: _propertyIdController,
            labelText: 'Property ID',
            hintText: 'e.g., prop_1',
          ),
          const SizedBox(height: 12),
          AppInput(
            controller: _urlController,
            labelText: 'Custom URL (optional)',
            hintText: 'https://homepulse.app/property/prop_1',
          ),
          const SizedBox(height: 16),
          AppButton(
            text: _isGenerating ? 'Generating...' : 'Generate QR Code',
            onPressed: _isGenerating ? null : _generateQR,
            isLoading: _isGenerating,
          ),
        ],
      ),
    );
  }
}

class _QrCard extends StatelessWidget {
  final QRCodeData qr;
  final VoidCallback? onDeactivate;

  const _QrCard({
    required this.qr,
    this.onDeactivate,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return AppCard(
      child: Column(
        children: [
          Expanded(
            child: QRCodeDisplay(
              data: qr.generateQrString(),
              size: 100,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            qr.propertyId,
            style: theme.textTheme.bodySmall?.copyWith(
              fontWeight: FontWeight.w500,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: qr.isActive ? AppColors.success.withOpacity(0.1) : AppColors.error.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  qr.isActive ? 'Active' : 'Inactive',
                  style: theme.textTheme.labelSmall?.copyWith(
                    color: qr.isActive ? AppColors.success : AppColors.error,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              if (qr.isActive)
                TextButton(
                  onPressed: onDeactivate,
                  child: const Text('Deactivate', style: TextStyle(fontSize: 12)),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
