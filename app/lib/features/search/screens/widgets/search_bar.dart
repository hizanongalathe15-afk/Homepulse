import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../state/search_provider.dart';

class SearchBarWidget extends ConsumerWidget {
  final TextEditingController controller;
  final VoidCallback onSearch;
  final VoidCallback onFilterTap;

  const SearchBarWidget({
    super.key,
    required this.controller,
    required this.onSearch,
    required this.onFilterTap,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final searchResults = ref.watch(searchProvider);
    final suggestions = searchResults.valueOrNull?.take(5).toList() ?? [];

    return Column(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            border: Border(
              bottom: BorderSide(color: AppColors.divider),
            ),
          ),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: controller,
                  decoration: InputDecoration(
                    hintText: 'Search properties, neighborhoods...',
                    prefixIcon: Icon(LucideIcons.search, size: 20),
                    suffixIcon: controller.text.isNotEmpty
                        ? IconButton(
                            onPressed: () {
                              controller.clear();
                            },
                            icon: const Icon(Icons.clear, size: 20),
                          )
                        : null,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    filled: true,
                    fillColor: AppColors.background,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  ),
                  onSubmitted: (_) => onSearch(),
                  textInputAction: TextInputAction.search,
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                onPressed: onFilterTap,
                icon: const Icon(Icons.tune, size: 20),
                style: IconButton.styleFrom(
                  backgroundColor: AppColors.primary.withOpacity(0.1),
                  foregroundColor: AppColors.primary,
                ),
              ),
            ],
          ),
        ),
        if (controller.text.isNotEmpty && suggestions.isNotEmpty)
          Container(
            color: Theme.of(context).colorScheme.surface,
            child: ListView.builder(
              shrinkWrap: true,
              itemCount: suggestions.length,
              itemBuilder: (context, index) {
                final property = suggestions[index];
                return ListTile(
                  dense: true,
                  leading: Icon(LucideIcons.house, size: 20),
                  title: Text(
                    property.title,
                    style: const TextStyle(fontSize: 14),
                  ),
                  subtitle: Text(
                    property.location,
                    style: TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  onTap: () {
                    controller.text = property.title;
                    onSearch();
                  },
                );
              },
            ),
          ),
      ],
    );
  }
}