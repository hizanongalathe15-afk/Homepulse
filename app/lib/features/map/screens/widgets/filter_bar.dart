import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/property.dart';
import '../../../../widgets/app_dropdown.dart';

final mapFilterTypeProvider = StateProvider<String?>((ref) => null);
final mapFilterMinPriceProvider = StateProvider<double?>((ref) => null);
final mapFilterMaxPriceProvider = StateProvider<double?>((ref) => null);
final mapFilterMinBedroomsProvider = StateProvider<int?>((ref) => null);
final mapFilterMaxBedroomsProvider = StateProvider<int?>((ref) => null);
final mapFilterAmenitiesProvider = StateProvider<List<String>>((ref) => []);

class FilterBar extends ConsumerWidget {
  final void Function(PropertySearchFilters) onFilterChanged;

  const FilterBar({
    super.key,
    required this.onFilterChanged,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final type = ref.watch(mapFilterTypeProvider);
    final minPrice = ref.watch(mapFilterMinPriceProvider);
    final maxPrice = ref.watch(mapFilterMaxPriceProvider);
    final minBedrooms = ref.watch(mapFilterMinBedroomsProvider);
    final maxBedrooms = ref.watch(mapFilterMaxBedroomsProvider);
    final amenities = ref.watch(mapFilterAmenitiesProvider);

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      child: Row(
        children: [
          AppDropdown<String?>(
            hint: 'Type',
            value: type,
            items: const ['apartment', 'house', 'studio', 'villa', 'townhouse']
                .map((t) => DropdownMenuItem(value: t, child: Text(t[0].toUpperCase() + t.substring(1))))
                .toList(),
            onChanged: (value) {
              ref.read(mapFilterTypeProvider.notifier).state = value;
              _emitFilters(ref);
            },
          ),
          const SizedBox(width: 8),
          _buildChip(context, '\$${minPrice?.toInt() ?? 0}+', () {
            _showPriceDialog(context, ref, minPrice, maxPrice, minBedrooms, maxBedrooms);
          }),
          const SizedBox(width: 8),
          _buildChip(context, '${minBedrooms ?? 0}+ beds', () {
            _showBedroomsDialog(context, ref, minBedrooms, maxBedrooms);
          }),
          const SizedBox(width: 8),
          _buildChip(context, amenities.isEmpty ? 'Amenities' : '${amenities.length} selected', () {
            _showAmenitiesDialog(context, ref, amenities);
          }),
        ],
      ),
    );
  }

  Widget _buildChip(BuildContext context, String label, VoidCallback onTap) {
    return ActionChip(
      label: Text(label, style: const TextStyle(fontSize: 12)),
      onPressed: onTap,
      backgroundColor: AppColors.background,
      side: BorderSide.none,
    );
  }

  void _emitFilters(WidgetRef ref) {
    final filters = PropertySearchFilters(
      type: ref.read(mapFilterTypeProvider),
      minPrice: ref.read(mapFilterMinPriceProvider),
      maxPrice: ref.read(mapFilterMaxPriceProvider),
      minBedrooms: ref.read(mapFilterMinBedroomsProvider),
      maxBedrooms: ref.read(mapFilterMaxBedroomsProvider),
      amenities: ref.read(mapFilterAmenitiesProvider).isEmpty ? null : ref.read(mapFilterAmenitiesProvider),
    );
    onFilterChanged(filters);
  }

  void _showPriceDialog(BuildContext context, WidgetRef ref, double? min, double? max, int? minBeds, int? maxBeds) {
    final minController = TextEditingController(text: min?.toString() ?? '');
    final maxController = TextEditingController(text: max?.toString() ?? '');
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Price Range'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: minController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Min Price'),
              ),
              TextField(
                controller: maxController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Max Price'),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
            TextButton(
              onPressed: () {
                final parsedMin = double.tryParse(minController.text);
                final parsedMax = double.tryParse(maxController.text);
                ref.read(mapFilterMinPriceProvider.notifier).state = parsedMin;
                ref.read(mapFilterMaxPriceProvider.notifier).state = parsedMax;
                Navigator.pop(context);
                _emitFilters(ref);
              },
              child: const Text('Apply'),
            ),
          ],
        );
      },
    );
  }

  void _showBedroomsDialog(BuildContext context, WidgetRef ref, int? min, int? max) {
    final minController = TextEditingController(text: min?.toString() ?? '');
    final maxController = TextEditingController(text: max?.toString() ?? '');
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Bedrooms'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: minController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Min Bedrooms'),
              ),
              TextField(
                controller: maxController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Max Bedrooms'),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
            TextButton(
              onPressed: () {
                final parsedMin = int.tryParse(minController.text);
                final parsedMax = int.tryParse(maxController.text);
                ref.read(mapFilterMinBedroomsProvider.notifier).state = parsedMin;
                ref.read(mapFilterMaxBedroomsProvider.notifier).state = parsedMax;
                Navigator.pop(context);
                _emitFilters(ref);
              },
              child: const Text('Apply'),
            ),
          ],
        );
      },
    );
  }

  void _showAmenitiesDialog(BuildContext context, WidgetRef ref, List<String> current) {
    final allAmenities = ['wifi', 'parking', 'pool', 'gym', 'security', 'garden', 'elevator', 'balcony'];
    final selected = List<String>.from(current);
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Amenities'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: allAmenities.map((amenity) {
                return CheckboxListTile(
                  title: Text(amenity),
                  value: selected.contains(amenity),
                  onChanged: (value) {
                    if (value == true) {
                      selected.add(amenity);
                    } else {
                      selected.remove(amenity);
                    }
                  },
                );
              }).toList(),
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
            TextButton(
              onPressed: () {
                ref.read(mapFilterAmenitiesProvider.notifier).state = selected;
                Navigator.pop(context);
                _emitFilters(ref);
              },
              child: const Text('Apply'),
            ),
          ],
        );
      },
    );
  }
}
