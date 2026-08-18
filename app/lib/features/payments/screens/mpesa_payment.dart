import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/services/payment_service.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/app_input.dart';
import 'package:homepulse/widgets/app_toast.dart';

class MpesaPayment extends ConsumerStatefulWidget {
  const MpesaPayment({super.key});

  @override
  ConsumerState<MpesaPayment> createState() => _MpesaPaymentState();
}

class _MpesaPaymentState extends ConsumerState<MpesaPayment> {
  final _phoneController = TextEditingController();
  final _amountController = TextEditingController();
  final _propertyIdController = TextEditingController(text: 'prop_001');
  bool _isProcessing = false;
  String? _resultMessage;

  @override
  void dispose() {
    _phoneController.dispose();
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
                  Text('M-Pesa Payment', style: Theme.of(context).textTheme.headlineSmall),
                  IconButton(onPressed: () => Navigator.pop(context), icon: Icon(LucideIcons.x)),
                ],
              ),
              const SizedBox(height: 24),
              AppInput(
                label: 'Phone Number',
                hintText: '254700000000',
                controller: _phoneController,
                keyboardType: TextInputType.phone,
              ),
              const SizedBox(height: 16),
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
              if (_resultMessage != null) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: _resultMessage!.contains('success') || _resultMessage!.contains('initiated')
                        ? AppColors.success.withOpacity(0.1)
                        : AppColors.error.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        _resultMessage!.contains('success') || _resultMessage!.contains('initiated')
                            ? LucideIcons.circle_check
                            : Icons.error,
                        color: _resultMessage!.contains('success') || _resultMessage!.contains('initiated')
                            ? AppColors.success
                            : AppColors.error,
                      ),
                      const SizedBox(width: 8),
                      Expanded(child: Text(_resultMessage!)),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
              ],
              AppButton(
                text: 'Pay with M-Pesa',
                onPressed: _isProcessing ? null : _handlePayment,
                isLoading: _isProcessing,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _handlePayment() async {
    final phone = _phoneController.text.trim();
    final amountText = _amountController.text.trim();
    final propertyId = _propertyIdController.text.trim();

    if (phone.isEmpty || amountText.isEmpty || propertyId.isEmpty) {
      setState(() => _resultMessage = 'Please fill all fields');
      return;
    }

    final amount = double.tryParse(amountText);
    if (amount == null || amount <= 0) {
      setState(() => _resultMessage = 'Please enter a valid amount');
      return;
    }

    setState(() {
      _isProcessing = true;
      _resultMessage = null;
    });

    try {
      final payment = await ref.read(paymentProvider.notifier).initiateMpesaStkPush(
        phoneNumber: phone,
        amount: amount,
        propertyId: propertyId,
      );
      setState(() => _resultMessage = 'STK Push initiated: ${payment.id}');
      AppToast.success(context, 'M-Pesa payment initiated');
    } catch (e) {
      setState(() => _resultMessage = 'Payment failed: $e');
      AppToast.error(context, 'Payment failed');
    } finally {
      setState(() => _isProcessing = false);
    }
  }
}
