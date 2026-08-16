import 'package:flutter/material.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/app_input.dart';
import 'package:homepulse/widgets/app_toast.dart';
import 'package:homepulse/core/utils/formatters.dart';

class RentNegotiationWidget extends StatefulWidget {
  final double currentPrice;
  final VoidCallback? onOfferSubmitted;

  const RentNegotiationWidget({
    super.key,
    required this.currentPrice,
    this.onOfferSubmitted,
  });

  @override
  State<RentNegotiationWidget> createState() => _RentNegotiationWidgetState();
}

class _RentNegotiationWidgetState extends State<RentNegotiationWidget> {
  final _offerController = TextEditingController();
  bool _hasOffered = false;
  bool _isSubmitting = false;

  @override
  void dispose() {
    _offerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Rent Negotiation', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 12),
        AppCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Current Rent', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                      Text(formatCurrency(widget.currentPrice),
                          style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 18)),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.secondary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text('Negotiable',
                        style: TextStyle(color: AppColors.secondary, fontWeight: FontWeight.w600, fontSize: 12)),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              if (!_hasOffered) ...[
                AppInput(
                  label: 'Your Offer (KES)',
                  hintText: 'Enter your proposed rent',
                  controller: _offerController,
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 16),
                AppButton(
                  text: 'Submit Offer',
                  onPressed: _isSubmitting ? null : _submitOffer,
                  isLoading: _isSubmitting,
                ),
              ] else ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.info.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.pending_actions, color: AppColors.info),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Offer Submitted',
                                style: TextStyle(color: AppColors.info, fontWeight: FontWeight.w600)),
                            Text(
                              '${formatCurrency(double.tryParse(_offerController.text.trim()) ?? 0)} - Awaiting landlord response',
                              style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                TextButton.icon(
                  onPressed: () => setState(() => _hasOffered = false),
                  icon: const Icon(Icons.edit, size: 16),
                  label: const Text('Modify Offer'),
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }

  Future<void> _submitOffer() async {
    final offerText = _offerController.text.trim();
    final offer = double.tryParse(offerText);
    if (offer == null || offer <= 0) {
      AppToast.error(context, 'Please enter a valid offer');
      return;
    }

    setState(() => _isSubmitting = true);
    await Future.delayed(const Duration(seconds: 1));
    setState(() {
      _hasOffered = true;
      _isSubmitting = false;
    });
    widget.onOfferSubmitted?.call();
    if (mounted) {
      AppToast.success(context, 'Offer submitted successfully');
    }
  }
}
