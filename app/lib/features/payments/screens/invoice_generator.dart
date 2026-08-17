import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/app_input.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_toast.dart';
import 'package:homepulse/core/utils/formatters.dart';

class InvoiceGenerator extends ConsumerStatefulWidget {
  const InvoiceGenerator({super.key});

  @override
  ConsumerState<InvoiceGenerator> createState() => _InvoiceGeneratorState();
}

class _InvoiceGeneratorState extends ConsumerState<InvoiceGenerator> {
  final _tenantController = TextEditingController();
  final _propertyController = TextEditingController();
  final _amountController = TextEditingController();
  final _dueDateController = TextEditingController();
  bool _isGenerating = false;
  bool _showPreview = false;

  @override
  void dispose() {
    _tenantController.dispose();
    _propertyController.dispose();
    _amountController.dispose();
    _dueDateController.dispose();
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
                  Text('Generate Invoice', style: Theme.of(context).textTheme.headlineSmall),
                  IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.close)),
                ],
              ),
              const SizedBox(height: 24),
              if (!_showPreview) ...[
                AppInput(
                  label: 'Tenant Name',
                  hintText: 'John Doe',
                  controller: _tenantController,
                ),
                const SizedBox(height: 16),
                AppInput(
                  label: 'Property',
                  hintText: 'Sunset Apartments Unit 4B',
                  controller: _propertyController,
                ),
                const SizedBox(height: 16),
                AppInput(
                  label: 'Amount (KES)',
                  hintText: '45000',
                  controller: _amountController,
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 16),
                AppInput(
                  label: 'Due Date',
                  hintText: 'YYYY-MM-DD',
                  controller: _dueDateController,
                  keyboardType: TextInputType.datetime,
                ),
                const SizedBox(height: 24),
                AppButton(
                  text: 'Generate Preview',
                  onPressed: _isGenerating ? null : _generatePreview,
                  isLoading: _isGenerating,
                ),
              ] else ...[
                _buildPreview(),
                const SizedBox(height: 24),
                Row(
                  children: [
                    Expanded(
                      child: AppButton(
                        text: 'Edit',
                        isOutlined: true,
                        onPressed: () => setState(() => _showPreview = false),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: AppButton(
                        text: 'Download PDF',
                        onPressed: _isGenerating ? null : _downloadInvoice,
                        isLoading: _isGenerating,
                      ),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPreview() {
    final amount = double.tryParse(_amountController.text.trim()) ?? 0;
    final dueDate = _dueDateController.text.trim();
    final tenant = _tenantController.text.trim();
    final property = _propertyController.text.trim();

    return AppCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.receipt, color: Colors.white),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('INVOICE', style: Theme.of(context).textTheme.labelLarge?.copyWith(color: AppColors.primary, fontWeight: FontWeight.w700)),
                    Text('INV-${DateTime.now().millisecondsSinceEpoch % 100000}', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          _InvoiceRow(label: 'Tenant', value: tenant.isEmpty ? '-' : tenant),
          const SizedBox(height: 8),
          _InvoiceRow(label: 'Property', value: property.isEmpty ? '-' : property),
          const SizedBox(height: 8),
          _InvoiceRow(label: 'Due Date', value: dueDate.isEmpty ? '-' : dueDate),
          const SizedBox(height: 8),
          _InvoiceRow(label: 'Status', value: 'Pending'),
          const SizedBox(height: 16),
          const Divider(),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Total Amount', style: TextStyle(fontWeight: FontWeight.w600)),
              Text(formatCurrency(amount), style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
            ],
          ),
        ],
      ),
    );
  }

  void _generatePreview() {
    if (_tenantController.text.trim().isEmpty ||
        _propertyController.text.trim().isEmpty ||
        _amountController.text.trim().isEmpty ||
        _dueDateController.text.trim().isEmpty) {
      AppToast.error(context, 'Please fill all fields');
      return;
    }
    setState(() => _showPreview = true);
  }

  Future<void> _downloadInvoice() async {
    setState(() => _isGenerating = true);
    await Future.delayed(const Duration(seconds: 1));
    setState(() => _isGenerating = false);
    AppToast.success(context, 'Invoice downloaded');
    Navigator.pop(context);
  }
}

class _InvoiceRow extends StatelessWidget {
  final String label;
  final String value;

  const _InvoiceRow({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: AppColors.textSecondary)),
        Text(value, style: const TextStyle(fontWeight: FontWeight.w500)),
      ],
    );
  }
}
