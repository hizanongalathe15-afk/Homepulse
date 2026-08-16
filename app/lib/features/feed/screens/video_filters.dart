import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class VideoFilters extends StatelessWidget {
  final ValueChanged<String> onSortChanged;

  const VideoFilters({
    super.key,
    required this.onSortChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2))],
      ),
      child: Row(
        children: [
          _FilterChip(label: 'Latest', isSelected: true, onTap: () => onSortChanged('latest')),
          const SizedBox(width: 8),
          _FilterChip(label: 'Price: Low to High', isSelected: false, onTap: () => onSortChanged('price_asc')),
          const SizedBox(width: 8),
          _FilterChip(label: 'Price: High to Low', isSelected: false, onTap: () => onSortChanged('price_desc')),
          const Spacer(),
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.tune, color: AppColors.textSecondary),
            tooltip: 'Filters',
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : AppColors.background,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: isSelected ? Colors.white : AppColors.textSecondary,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}
