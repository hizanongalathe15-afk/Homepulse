import 'package:flutter/material.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';

class ViewingBookingWidget extends StatefulWidget {
  final String propertyId;
  final VoidCallback? onBookingConfirmed;

  const ViewingBookingWidget({
    super.key,
    required this.propertyId,
    this.onBookingConfirmed,
  });

  @override
  State<ViewingBookingWidget> createState() => _ViewingBookingWidgetState();
}

class _ViewingBookingWidgetState extends State<ViewingBookingWidget> {
  DateTime? _selectedDate;
  String? _selectedTime;
  final _notesController = TextEditingController();
  bool _isBooking = false;

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Book a Viewing', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 12),
        AppCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Schedule a visit to this property',
                  style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: _pickDate,
                      child: InputDecorator(
                        decoration: const InputDecoration(
                          labelText: 'Date',
                          border: OutlineInputBorder(),
                        ),
                        child: Text(
                          _selectedDate == null
                              ? 'Select date'
                              : '${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}',
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      decoration: const InputDecoration(labelText: 'Time', border: OutlineInputBorder()),
                      items: const [
                        DropdownMenuItem(value: '09:00', child: Text('09:00 AM')),
                        DropdownMenuItem(value: '10:00', child: Text('10:00 AM')),
                        DropdownMenuItem(value: '11:00', child: Text('11:00 AM')),
                        DropdownMenuItem(value: '14:00', child: Text('02:00 PM')),
                        DropdownMenuItem(value: '15:00', child: Text('03:00 PM')),
                        DropdownMenuItem(value: '16:00', child: Text('04:00 PM')),
                      ],
                      onChanged: (value) => setState(() => _selectedTime = value),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _notesController,
                decoration: const InputDecoration(
                  labelText: 'Notes',
                  hintText: 'Any special requests or questions',
                  border: OutlineInputBorder(),
                ),
                maxLines: 2,
              ),
              const SizedBox(height: 20),
              AppButton(
                text: 'Book Viewing',
                onPressed:
                    _isBooking || _selectedDate == null || _selectedTime == null ? null : _bookViewing,
                isLoading: _isBooking,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: now.add(const Duration(days: 1)),
      firstDate: now,
      lastDate: now.add(const Duration(days: 90)),
    );
    if (picked != null) {
      setState(() => _selectedDate = picked);
    }
  }

  Future<void> _bookViewing() async {
    setState(() => _isBooking = true);
    await Future.delayed(const Duration(seconds: 1));
    setState(() => _isBooking = false);
    if (mounted) {
      widget.onBookingConfirmed?.call();
    }
  }
}
