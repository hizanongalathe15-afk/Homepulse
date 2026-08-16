import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../widgets/app_button.dart';

class NegotiationPanel extends ConsumerStatefulWidget {
  final VoidCallback onOfferSent;

  const NegotiationPanel({
    super.key,
    required this.onOfferSent,
  });

  @override
  ConsumerState<NegotiationPanel> createState() => _NegotiationPanelState();
}

class _NegotiationPanelState extends ConsumerState<NegotiationPanel> {
  final TextEditingController _offerController = TextEditingController();
  final TextEditingController _counterController = TextEditingController();
  String _selectedType = 'offer';
  bool _isLoading = false;

  @override
  void dispose() {
    _offerController.dispose();
    _counterController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final amount = double.tryParse(_offerController.text);
    if (amount == null || amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Enter a valid amount')));
      return;
    }

    setState(() => _isLoading = true);
    try {
      await Future.delayed(const Duration(milliseconds: 500));
      widget.onOfferSent();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('${_selectedType == 'offer' ? 'Offer' : 'Counter-offer'} of \$${amount.toStringAsFixed(0)} sent')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text('Rent Negotiation', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
        const SizedBox(height: 16),
        SegmentedButton<String>(
          segments: const [
            ButtonSegment(value: 'offer', label: Text('Make Offer')),
            ButtonSegment(value: 'counter', label: Text('Counter-offer')),
          ],
          selected: {_selectedType},
          onSelectionChanged: (Set<String> selection) {
            setState(() => _selectedType = selection.first);
          },
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _selectedType == 'offer' ? _offerController : _counterController,
          keyboardType: TextInputType.number,
          decoration: InputDecoration(
            hintText: _selectedType == 'offer' ? 'Enter offer amount' : 'Enter counter amount',
            prefixIcon: const Icon(Icons.attach_money),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        const SizedBox(height: 16),
        AppButton(
          text: _selectedType == 'offer' ? 'Send Offer' : 'Send Counter-offer',
          onPressed: _submit,
          isLoading: _isLoading,
        ),
      ],
    );
  }
}
