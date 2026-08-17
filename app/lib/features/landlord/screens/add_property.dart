import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../models/property.dart';
import '../../../../state/landlord_provider.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/app_input.dart';
import '../../../../widgets/app_toast.dart';

class AddPropertyScreen extends ConsumerStatefulWidget {
  final Property? property;

  const AddPropertyScreen({super.key, this.property});

  @override
  ConsumerState<AddPropertyScreen> createState() => _AddPropertyScreenState();
}

class _AddPropertyScreenState extends ConsumerState<AddPropertyScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _priceController = TextEditingController();
  final _locationController = TextEditingController();
  final List<String> _selectedTags = [];

  @override
  void initState() {
    super.initState();
    if (widget.property != null) {
      _titleController.text = widget.property!.title;
      _descriptionController.text = widget.property!.description;
      _priceController.text = widget.property!.price.toString();
      _locationController.text = widget.property!.location;
      _selectedTags.addAll(widget.property!.tags);
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _priceController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;

    final property = Property(
      id: widget.property?.id ?? 'prop_${DateTime.now().millisecondsSinceEpoch}',
      title: _titleController.text,
      description: _descriptionController.text,
      price: double.parse(_priceController.text),
      location: _locationController.text,
      imageUrls: widget.property?.imageUrls ?? ['https://picsum.photos/400/300'],
      tags: _selectedTags,
      landlordId: 'landlord_1',
      isVerified: widget.property?.isVerified ?? false,
      createdAt: widget.property?.createdAt ?? DateTime.now(),
      isAvailable: true,
    );

    final service = ref.read(propertyServiceProvider);
    if (widget.property == null) {
      service.createProperty(property);
      AppToast.show(context, 'Property created successfully');
    } else {
      service.updateProperty(property);
      AppToast.show(context, 'Property updated successfully');
    }
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.property == null ? 'Add Property' : 'Edit Property'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            AppInput(
              labelText: 'Title',
              controller: _titleController,
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            AppInput(
              labelText: 'Description',
              controller: _descriptionController,
              isMultiline: true,
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            AppInput(
              labelText: 'Price (KES)',
              controller: _priceController,
              keyboardType: TextInputType.number,
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            AppInput(
              labelText: 'Location',
              controller: _locationController,
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 24),
            Text('Tags', style: Theme.of(context).textTheme.titleSmall),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: ['Verified', 'Furnished', 'New', 'Featured'].map((tag) {
                final isSelected = _selectedTags.contains(tag);
                return FilterChip(
                  label: Text(tag),
                  selected: isSelected,
                  onSelected: (selected) {
                    setState(() {
                      if (selected) {
                        _selectedTags.add(tag);
                      } else {
                        _selectedTags.remove(tag);
                      }
                    });
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 32),
            AppButton(
              text: widget.property == null ? 'Create Property' : 'Update Property',
              onPressed: _submit,
            ),
          ],
        ),
      ),
    );
  }
}
