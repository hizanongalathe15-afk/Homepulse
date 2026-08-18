import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/services/qr_service.dart';
import 'package:homepulse/state/qr_provider.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/app_input.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/qr_code_display.dart';
import 'package:homepulse/models/qr_code.dart';
import 'package:homepulse/widgets/app_toast.dart';
import 'package:homepulse/core/utils/formatters.dart';

class QrCodePayment extends ConsumerStatefulWidget {
  const QrCodePayment({super.key});

  @override
  ConsumerState<QrCodePayment> createState() => _QrCodePaymentState();
}

class _QrCodePaymentState extends ConsumerState<QrCodePayment> {
  final _amountController = TextEditingController();
  final _propertyIdController = TextEditingController(text: 'prop_001');
  bool _isGenerating = false;
  String? _qrPayload;

  @override
  void dispose() {
    _amountController.dispose();
    _propertyIdController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('QR Payment', style: Theme.of(context).textTheme.headlineSmall),
                  IconButton(onPressed: () => Navigator.pop(context), icon: Icon(LucideIcons.x)),
                ],
              ),
              const SizedBox(height: 24),
              if (_qrPayload == null) ...[
                AppInput(
                  label: 'Amount (KES)',
                  hintText: 'Enter amount',
                  controller: _amountController,
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 16),
                AppInput(
                  label: 'Property ID',
                  hintText: 'Property reference',
                  controller: _propertyIdController,
                ),
                const SizedBox(height: 24),
                AppButton(
                  text: 'Generate QR Code',
                  onPressed: _isGenerating ? null : _generateQr,
                  isLoading: _isGenerating,
                ),
              ] else ...[
                Center(
                  child: Column(
                    children: [
                      AppCard(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          children: [
                            QRCodeDisplay(
                              data: _qrPayload!,
                              size: 220,
                              backgroundColor: Colors.white,
                              foregroundColor: AppColors.textPrimary,
                            ),
                            const SizedBox(height: 16),
                            Text('Scan to pay ${formatCurrency(double.tryParse(_amountController.text.trim()) ?? 0)}', style: const TextStyle(fontWeight: FontWeight.w600)),
                            const SizedBox(height: 4),
                            Text('Property: ${_propertyIdController.text}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),
                      Row(
                        children: [
                          Expanded(
                            child: AppButton(
                              text: 'Regenerate',
                              isOutlined: true,
                              onPressed: () => setState(() => _qrPayload = null),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: AppButton(
                              text: 'Done',
                              onPressed: () => Navigator.pop(context),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _generateQr() async {
    final amountText = _amountController.text.trim();
    final amount = double.tryParse(amountText);
    if (amount == null || amount <= 0) {
      AppToast.error(context, 'Please enter a valid amount');
      return;
    }

    setState(() => _isGenerating = true);

    try {
      final qr = await ref.read(qrServiceProvider).generateQR(QRCodeData(
        id: 'qr_${DateTime.now().millisecondsSinceEpoch}',
        propertyId: _propertyIdController.text.trim(),
        landlordId: 'user_001',
        url: 'https://homepulse.app/pay/${_propertyIdController.text.trim()}',
        createdAt: DateTime.now(),
      ));
      final payload = {'amount': amount, 'propertyId': _propertyIdController.text.trim(), 'qrId': qr.id};
      setState(() => _qrPayload = payload.toString());
      AppToast.success(context, 'QR code generated');
    } catch (e) {
      AppToast.error(context, 'Failed to generate QR code');
    } finally {
      setState(() => _isGenerating = false);
    }
  }
}
