import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/services/payment_service.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/app_input.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_toast.dart';
import 'package:homepulse/core/utils/formatters.dart';

class EscrowDepositFlow extends ConsumerStatefulWidget {
  const EscrowDepositFlow({super.key});

  @override
  ConsumerState<EscrowDepositFlow> createState() => _EscrowDepositFlowState();
}

class _EscrowDepositFlowState extends ConsumerState<EscrowDepositFlow> {
  final _amountController = TextEditingController();
  final _propertyIdController = TextEditingController(text: 'prop_001');
  final _tenantIdController = TextEditingController(text: 'tenant_001');
  int _currentStep = 0;
  bool _isProcessing = false;
  String? _resultMessage;

  @override
  void dispose() {
    _amountController.dispose();
    _propertyIdController.dispose();
    _tenantIdController.dispose();
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
                  Text('Escrow Deposit', style: Theme.of(context).textTheme.headlineSmall),
                  IconButton(onPressed: () => Navigator.pop(context), icon: Icon(LucideIcons.x)),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  _StepIndicator(step: 1, currentStep: _currentStep, label: 'Amount'),
                  const SizedBox(width: 8),
                  Expanded(child: _StepLine(isActive: _currentStep >= 1)),
                  const SizedBox(width: 8),
                  _StepIndicator(step: 2, currentStep: _currentStep, label: 'Review'),
                  const SizedBox(width: 8),
                  Expanded(child: _StepLine(isActive: _currentStep >= 2)),
                  const SizedBox(width: 8),
                  _StepIndicator(step: 3, currentStep: _currentStep, label: 'Confirm'),
                ],
              ),
              const SizedBox(height: 24),
              if (_currentStep == 0) _buildAmountStep(),
              if (_currentStep == 1) _buildReviewStep(),
              if (_currentStep == 2) _buildConfirmStep(),
              if (_currentStep == 3 && _resultMessage != null) ...[
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.success.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Icon(LucideIcons.circle_check, color: AppColors.success),
                      const SizedBox(width: 12),
                      Expanded(child: Text(_resultMessage!)),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAmountStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Enter Deposit Amount', style: Theme.of(context).textTheme.titleMedium),
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
        const SizedBox(height: 16),
        AppInput(
          label: 'Tenant ID',
          hintText: 'Tenant reference',
          controller: _tenantIdController,
        ),
        const SizedBox(height: 24),
        AppButton(
          text: 'Continue',
          onPressed: _isProcessing ? null : () {
            final amountText = _amountController.text.trim();
            final amount = double.tryParse(amountText);
            if (amount == null || amount <= 0) {
              AppToast.error(context, 'Please enter a valid amount');
              return;
            }
            setState(() => _currentStep = 1);
          },
        ),
      ],
    );
  }

  Widget _buildReviewStep() {
    final amount = double.tryParse(_amountController.text.trim()) ?? 0;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Review Deposit', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 16),
        AppCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              _ReviewRow(label: 'Amount', value: formatCurrency(amount)),
              const SizedBox(height: 8),
              _ReviewRow(label: 'Property', value: _propertyIdController.text),
              const SizedBox(height: 8),
              _ReviewRow(label: 'Tenant', value: _tenantIdController.text),
              const SizedBox(height: 8),
              _ReviewRow(label: 'Status', value: 'Pending'),
            ],
          ),
        ),
        const SizedBox(height: 24),
        Row(
          children: [
            Expanded(
              child: AppButton(
                text: 'Back',
                isOutlined: true,
                onPressed: () => setState(() => _currentStep = 0),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: AppButton(
                text: 'Confirm',
                onPressed: _isProcessing ? null : () => setState(() => _currentStep = 2),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildConfirmStep() {
    final amount = double.tryParse(_amountController.text.trim()) ?? 0;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Confirm Escrow Deposit', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.warning.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            children: [
              const Icon(Icons.info, color: AppColors.warning),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Depositing ${formatCurrency(amount)} will secure this property. Funds will be held in escrow until the lease is signed.',
                  style: const TextStyle(fontSize: 14),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        AppButton(
          text: 'Deposit to Escrow',
          onPressed: _isProcessing ? null : _handleDeposit,
          isLoading: _isProcessing,
        ),
      ],
    );
  }

  Future<void> _handleDeposit() async {
    final amountText = _amountController.text.trim();
    final amount = double.tryParse(amountText);
    if (amount == null || amount <= 0) {
      AppToast.error(context, 'Invalid amount');
      return;
    }

    setState(() => _isProcessing = true);

    try {
      final escrow = await ref.read(escrowProvider.notifier).deposit(
        _propertyIdController.text.trim(),
        amount,
      );
      setState(() {
        _currentStep = 3;
        _resultMessage = 'Deposit successful! Escrow ID: ${escrow.id}';
      });
      AppToast.success(context, 'Escrow deposit successful');
    } catch (e) {
      setState(() => _resultMessage = 'Deposit failed: $e');
      AppToast.error(context, 'Deposit failed');
    } finally {
      setState(() => _isProcessing = false);
    }
  }
}

class _StepIndicator extends StatelessWidget {
  final int step;
  final int currentStep;
  final String label;

  const _StepIndicator({
    required this.step,
    required this.currentStep,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    final isActive = step <= currentStep + 1;
    final isCompleted = step <= currentStep;
    return Column(
      children: [
        Container(
          width: 28,
          height: 28,
          decoration: BoxDecoration(
            color: isCompleted ? AppColors.primary : AppColors.divider,
            shape: BoxShape.circle,
          ),
          child: isCompleted
              ? const Icon(Icons.check, size: 16, color: Colors.white)
              : Text('$step', style: TextStyle(color: isActive ? AppColors.textPrimary : AppColors.textSecondary, fontSize: 12)),
        ),
        const SizedBox(height: 4),
        Text(label, style: TextStyle(fontSize: 10, color: isActive ? AppColors.textPrimary : AppColors.textSecondary)),
      ],
    );
  }
}

class _StepLine extends StatelessWidget {
  final bool isActive;

  const _StepLine({required this.isActive});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 2,
      color: isActive ? AppColors.primary : AppColors.divider,
    );
  }
}

class _ReviewRow extends StatelessWidget {
  final String label;
  final String value;

  const _ReviewRow({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: AppColors.textSecondary)),
        Text(value, style: const TextStyle(fontWeight: FontWeight.w600)),
      ],
    );
  }
}
