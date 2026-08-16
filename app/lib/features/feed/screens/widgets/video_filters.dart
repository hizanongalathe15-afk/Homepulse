import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class VideoFilters extends StatelessWidget {
  final Function(String) onSortChanged;
  final String selectedSort;
  final List<String> filterOptions;
  final Function(String)? onFilterSelected;

  const VideoFilters({
    super.key,
    required this.onSortChanged,
    this.selectedSort = 'latest',
    this.filterOptions = const ['All', 'Verified', 'Furnished', 'Available'],
    this.onFilterSelected,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        border: Border(
          bottom: BorderSide(
            color: theme.colorScheme.outlineVariant.withOpacity(0.5),
            width: 0.5,
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: filterOptions.map((option) {
                      final isSelected = onFilterSelected != null && option == filterOptions.first;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: FilterChip(
                          label: Text(option),
                          selected: isSelected,
                          onSelected: onFilterSelected != null
                              ? (selected) {
                                  if (selected) onFilterSelected!(option);
                                }
                              : null,
                          backgroundColor: theme.colorScheme.surfaceContainerHighest.withOpacity(0.5),
                          selectedColor: AppColors.primary.withOpacity(0.15),
                          checkmarkColor: AppColors.primary,
                          labelStyle: TextStyle(
                            color: isSelected ? AppColors.primary : theme.colorScheme.onSurfaceVariant,
                            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                            side: BorderSide(
                              color: isSelected ? AppColors.primary : theme.colorScheme.outlineVariant,
                              width: 1,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              _SortDropdown(
                selectedSort: selectedSort,
                onSortChanged: onSortChanged,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _SortDropdown extends StatelessWidget {
  final String selectedSort;
  final Function(String) onSortChanged;

  const _SortDropdown({
    required this.selectedSort,
    required this.onSortChanged,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest.withOpacity(0.5),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: theme.colorScheme.outlineVariant),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: selectedSort,
          isDense: true,
          icon: const Icon(Icons.arrow_drop_down_rounded, size: 20),
          style: theme.textTheme.bodySmall,
          items: const [
            DropdownMenuItem(value: 'latest', child: Text('Latest')),
            DropdownMenuItem(value: 'price_low', child: Text('Price: Low to High')),
            DropdownMenuItem(value: 'price_high', child: Text('Price: High to Low')),
            DropdownMenuItem(value: 'rating', child: Text('Top Rated')),
          ],
          onChanged: (value) {
            if (value != null) onSortChanged(value);
          },
        ),
      ),
    );
  }
}
