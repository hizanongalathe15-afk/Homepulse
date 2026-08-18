import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/formatters.dart';
import '../../../../core/utils/validators.dart';
import '../../../../models/property.dart';
import '../../../../services/property_service.dart' hide propertyServiceProvider;
import '../../../../state/landlord_provider.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/app_toast.dart';
import 'add_property.dart';

class PropertyManager extends ConsumerWidget {
  final String landlordId;

  const PropertyManager({
    super.key,
    required this.landlordId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final propertiesAsync = ref.watch(landlordPropertiesProvider(landlordId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Properties'),
      ),
      body: propertiesAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(LucideIcons.circle_alert, size: 48, color: Colors.red),
              const SizedBox(height: 16),
              Text('Failed to load properties', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => ref.invalidate(landlordPropertiesProvider(landlordId)),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
        data: (properties) {
          if (properties.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(LucideIcons.house, size: 64, color: Theme.of(context).disabledColor),
                  const SizedBox(height: 16),
                  Text('No properties yet', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const AddPropertyScreen(),
                        ),
                      );
                    },
                    child: const Text('Add Property'),
                  ),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () async {
              ref.invalidate(landlordPropertiesProvider(landlordId));
            },
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: properties.length,
              itemBuilder: (context, index) {
                final property = properties[index];
                return _PropertyTile(
                  property: property,
                  onEdit: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => EditPropertyScreen(property: property),
                      ),
                    );
                  },
                  onDelete: () async {
                    final confirmed = await showDialog<bool>(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: const Text('Delete Property'),
                        content: Text('Are you sure you want to delete "${property.title}"?'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context, false),
                            child: const Text('Cancel'),
                          ),
                          TextButton(
                            onPressed: () => Navigator.pop(context, true),
                            child: const Text('Delete', style: TextStyle(color: Colors.red)),
                          ),
                        ],
                      ),
                    );
                    if (confirmed == true) {
                      try {
                        await ref.read(propertyServiceProvider).deleteProperty(property.id);
                        if (context.mounted) {
                          AppToast.success(context, 'Property deleted');
                          ref.invalidate(landlordPropertiesProvider(landlordId));
                        }
                      } catch (e) {
                        if (context.mounted) {
                          AppToast.error(context, 'Failed to delete property');
                        }
                      }
                    }
                  },
                );
              },
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => const AddPropertyScreen(),
            ),
          );
        },
        child: Icon(LucideIcons.plus),
      ),
    );
  }
}

class _PropertyTile extends StatelessWidget {
  final Property property;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;

  const _PropertyTile({
    required this.property,
    this.onEdit,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return AppCard(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.network(
                property.imageUrls.isNotEmpty ? property.imageUrls.first : 'https://via.placeholder.com/100x100',
                width: 80,
                height: 80,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    width: 80,
                    height: 80,
                    color: theme.colorScheme.surfaceContainerHighest,
                    child: const Icon(Icons.image_not_supported_outlined, size: 24, color: Colors.grey),
                  );
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    property.title,
                    style: theme.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(LucideIcons.map_pin, size: 14, color: Colors.grey),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          property.location,
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    formatCurrency(property.price),
                    style: theme.textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
            ),
            Column(
              children: [
                IconButton(
                  onPressed: onEdit,
                  icon: Icon(LucideIcons.pencil, size: 20),
                  visualDensity: VisualDensity.compact,
                ),
                IconButton(
                  onPressed: onDelete,
                  icon: Icon(LucideIcons.trash_2, size: 20, color: Colors.red),
                  visualDensity: VisualDensity.compact,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class EditPropertyScreen extends ConsumerStatefulWidget {
  final Property property;

  const EditPropertyScreen({
    super.key,
    required this.property,
  });

  @override
  ConsumerState<EditPropertyScreen> createState() => _EditPropertyScreenState();
}

class _EditPropertyScreenState extends ConsumerState<EditPropertyScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _titleController;
  late final TextEditingController _descriptionController;
  late final TextEditingController _priceController;
  late final TextEditingController _locationController;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.property.title);
    _descriptionController = TextEditingController(text: widget.property.description);
    _priceController = TextEditingController(text: widget.property.price.toString());
    _locationController = TextEditingController(text: widget.property.location);
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _priceController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  Future<void> _updateProperty() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    try {
      final updatedProperty = widget.property.copyWith(
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        price: double.parse(_priceController.text.trim()),
        location: _locationController.text.trim(),
      );

      await ref.read(propertyServiceProvider).updateProperty(updatedProperty.id, updatedProperty.toJson());
      if (mounted) {
        AppToast.success(context, 'Property updated successfully');
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        AppToast.error(context, 'Failed to update property');
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Property'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _titleController,
              decoration: const InputDecoration(
                labelText: 'Title',
                hintText: 'Property title',
              ),
              validator: (value) => validateRequired(value, fieldName: 'Title'),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _descriptionController,
              decoration: const InputDecoration(
                labelText: 'Description',
                hintText: 'Property description',
              ),
              maxLines: 4,
              validator: (value) => validateRequired(value, fieldName: 'Description'),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _priceController,
              decoration: const InputDecoration(
                labelText: 'Price (KES)',
                hintText: '45000',
              ),
              keyboardType: TextInputType.number,
              validator: (value) {
                if (validateRequired(value, fieldName: 'Price') != null) return null;
                return validatePositiveNumber(value!);
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _locationController,
              decoration: const InputDecoration(
                labelText: 'Location',
                hintText: 'e.g., Kilimani, Nairobi',
              ),
              validator: (value) => validateRequired(value, fieldName: 'Location'),
            ),
            const SizedBox(height: 32),
            AppButton(
              text: 'Update Property',
              onPressed: _isSubmitting ? null : _updateProperty,
              isLoading: _isSubmitting,
            ),
          ],
        ),
      ),
    );
  }
}
