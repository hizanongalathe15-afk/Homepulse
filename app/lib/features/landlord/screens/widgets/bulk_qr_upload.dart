import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/qr_code.dart';
import '../../../../state/qr_provider.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/app_input.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../widgets/qr_code_display.dart';

class BulkQrUploadScreen extends ConsumerStatefulWidget {
  final String landlordId;

  const BulkQrUploadScreen({
    super.key,
    required this.landlordId,
  });

  @override
  ConsumerState<BulkQrUploadScreen> createState() => _BulkQrUploadScreenState();
}

class _BulkQrUploadScreenState extends ConsumerState<BulkQrUploadScreen> {
  final TextEditingController _propertyIdsController = TextEditingController();
  bool _isUploading = false;
  int _uploadedCount = 0;
  int _totalCount = 0;

  Future<void> _handleUpload() async {
    final rawText = _propertyIdsController.text.trim();
    if (rawText.isEmpty) {
      AppToast.error(context, 'Please enter at least one property ID');
      return;
    }

    final propertyIds = rawText
        .split(',')
        .map((id) => id.trim())
        .where((id) => id.isNotEmpty)
        .toList();

    if (propertyIds.isEmpty) {
      AppToast.error(context, 'Please enter valid property IDs');
      return;
    }

    setState(() {
      _isUploading = true;
      _uploadedCount = 0;
      _totalCount = propertyIds.length;
    });

    try {
      final qrs = propertyIds.map((propertyId) {
        return QRCodeData(
          id: 'qr_${DateTime.now().millisecondsSinceEpoch}_$propertyId',
          propertyId: propertyId,
          landlordId: widget.landlordId,
          url: 'https://homepulse.app/property/$propertyId',
          createdAt: DateTime.now(),
          isActive: true,
        );
      }).toList();

      await ref.read(qrServiceProvider).uploadBulkQRs(qrs);
      ref.read(qrProvider.notifier).uploadBulk(qrs);

      setState(() {
        _uploadedCount = propertyIds.length;
        _isUploading = false;
      });

      if (mounted) {
        AppToast.success(context, '$_uploadedCount QR codes uploaded successfully');
      }
    } catch (e) {
      setState(() => _isUploading = false);
      if (mounted) {
        AppToast.error(context, 'Failed to upload QR codes');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Bulk QR Upload'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.info.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.info.withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  Icon(Icons.info_outline_rounded, color: AppColors.info, size: 20),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Enter property IDs separated by commas to generate QR codes in bulk.',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: AppColors.info,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Property IDs',
              style: theme.textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            AppInput(
              controller: _propertyIdsController,
              hintText: 'prop_1, prop_2, prop_3',
              isMultiline: true,
              maxLines: 4,
            ),
            const SizedBox(height: 24),
            if (_isUploading)
              Column(
                children: [
                  LinearProgressIndicator(
                    value: _totalCount > 0 ? _uploadedCount / _totalCount : 0,
                    minHeight: 6,
                    borderRadius: BorderRadius.circular(3),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Uploading $_uploadedCount of $_totalCount...',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            const SizedBox(height: 16),
            AppButton(
              text: _isUploading ? 'Uploading...' : 'Upload QR Codes',
              onPressed: _isUploading ? null : _handleUpload,
              isLoading: _isUploading,
            ),
            const SizedBox(height: 24),
            Text(
              'Preview',
              style: theme.textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.colorScheme.surfaceContainerHighest.withOpacity(0.3),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: theme.colorScheme.outlineVariant.withOpacity(0.5)),
              ),
              child: Column(
                children: [
                  QRCodeDisplay(
                    data: 'https://homepulse.app/property/sample',
                    size: 150,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Sample QR Code',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
