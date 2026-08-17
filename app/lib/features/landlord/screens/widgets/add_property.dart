import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/validators.dart';
import '../../../../models/property.dart';
import '../../../../services/property_service.dart';
import '../../../../state/landlord_provider.dart';
import '../../../../state/auth_provider.dart';
import '../../../../widgets/app_input.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/app_dropdown.dart';
import '../../../../widgets/app_toast.dart';

class AddPropertyScreen extends ConsumerStatefulWidget {
  const AddPropertyScreen({super.key});

  @override
  ConsumerState<AddPropertyScreen> createState() => _AddPropertyScreenState();
}

class _AddPropertyScreenState extends ConsumerState<AddPropertyScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _priceController = TextEditingController();
  final _locationController = TextEditingController();
  final _bedroomsController = TextEditingController();
  final _bathroomsController = TextEditingController();
  final _squareMetersController = TextEditingController();

  String _selectedType = 'apartment';
  bool _isSubmitting = false;

  final List<String> _propertyTypes = [
    'apartment',
    'house',
    'studio',
    'villa',
    'townhouse',
    'commercial',
  ];

  final List<String> _amenities = [
    'WiFi',
    'Parking',
    'Security',
    'Swimming Pool',
    'Gym',
    'Furnished',
    'Balcony',
    'Garden',
  ];
  final Set<String> _selectedAmenities = {};

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _priceController.dispose();
    _locationController.dispose();
    _bedroomsController.dispose();
    _bathroomsController.dispose();
    _squareMetersController.dispose();
    super.dispose();
  }

  Future<void> _submitProperty() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    try {
      final authState = ref.read(authProvider);
      final landlordId = authState.value?.id ?? '';

      final property = Property(
        id: 'prop_${DateTime.now().millisecondsSinceEpoch}',
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        price: double.parse(_priceController.text.trim()),
        location: _locationController.text.trim(),
        imageUrls: ['https://via.placeholder.com/400x300'],
        tags: _selectedAmenities.toList(),
        landlordId: landlordId,
        isVerified: false,
        rating: 0.0,
        reviewCount: 0,
        createdAt: DateTime.now(),
        isAvailable: true,
      );

      await ref.read(propertyServiceProvider).createProperty(property);
      if (mounted) {
        AppToast.success(context, 'Property added successfully');
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        AppToast.error(context, 'Failed to add property');
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Property'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            AppInput(
              controller: _titleController,
              labelText: 'Property Title',
              hintText: 'e.g., Modern 2 Bedroom Apartment',
              validator: (value) => validateRequired(value, fieldName: 'Title'),
            ),
            const SizedBox(height: 16),
            AppInput(
              controller: _descriptionController,
              labelText: 'Description',
              hintText: 'Describe the property...',
              maxLines: 4,
              isMultiline: true,
              validator: (value) => validateRequired(value, fieldName: 'Description'),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: AppInput(
                    controller: _priceController,
                    labelText: 'Price (KES)',
                    hintText: '45000',
                    keyboardType: TextInputType.number,
                    validator: (value) {
                      if (validateRequired(value, fieldName: 'Price') != null) return null;
                      return validatePositiveNumber(value!);
                    },
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: AppDropdown<String>(
                    items: _propertyTypes,
                    value: _selectedType,
                    hintText: 'Type',
                    itemLabelBuilder: (type) => type[0].toUpperCase() + type.substring(1),
                    onChanged: (value) {
                      if (value != null) setState(() => _selectedType = value);
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            AppInput(
              controller: _locationController,
              labelText: 'Location',
              hintText: 'e.g., Kilimani, Nairobi',
              validator: (value) => validateRequired(value, fieldName: 'Location'),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: AppInput(
                    controller: _bedroomsController,
                    labelText: 'Bedrooms',
                    hintText: '2',
                    keyboardType: TextInputType.number,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: AppInput(
                    controller: _bathroomsController,
                    labelText: 'Bathrooms',
                    hintText: '2',
                    keyboardType: TextInputType.number,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            AppInput(
              controller: _squareMetersController,
              labelText: 'Square Meters',
              hintText: '120',
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 24),
            Text(
              'Amenities',
              style: theme.textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _amenities.map((amenity) {
                final isSelected = _selectedAmenities.contains(amenity);
                return FilterChip(
                  label: Text(amenity),
                  selected: isSelected,
                  onSelected: (selected) {
                    setState(() {
                      if (selected) {
                        _selectedAmenities.add(amenity);
                      } else {
                        _selectedAmenities.remove(amenity);
                      }
                    });
                  },
                  selectedColor: AppColors.primary.withOpacity(0.15),
                  checkmarkColor: AppColors.primary,
                  labelStyle: TextStyle(
                    color: isSelected ? AppColors.primary : theme.colorScheme.onSurfaceVariant,
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 32),
            AppButton(
              text: 'Add Property',
              onPressed: _isSubmitting ? null : _submitProperty,
              isLoading: _isSubmitting,
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}
