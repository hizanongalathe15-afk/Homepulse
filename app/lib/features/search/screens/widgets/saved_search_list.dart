import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../models/saved_search.dart';
import '../../../../../models/property.dart';
import '../../../../../state/search_provider.dart';
import '../../../../../widgets/app_card.dart';
import '../../../../../widgets/app_toast.dart';
import '../../../../../widgets/loading_spinner.dart';
import './search_alerts_toggle.dart';

class SavedSearchList extends ConsumerWidget {
  final String userId;

  const SavedSearchList({
    super.key,
    required this.userId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final savedSearchesAsync = ref.watch(savedSearchesProvider(userId));
    final theme = Theme.of(context);

    return savedSearchesAsync.when(
      loading: () => const Center(child: LoadingSpinner(size: 24)),
      error: (error, _) => Center(
        child: Column(
          children: [
            Icon(Icons.error_outline, size: 32, color: AppColors.error),
            const SizedBox(height: 8),
            Text(
              'Failed to load saved searches',
              style: theme.textTheme.bodyMedium,
            ),
            TextButton(
              onPressed: () => ref.invalidate(savedSearchesProvider(userId)),
              child: const Text('Retry'),
            ),
          ],
        ),
      ),
      data: (savedSearches) {
        if (savedSearches.isEmpty) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  Icon(Icons.bookmark_border, size: 48, color: AppColors.textSecondary.withOpacity(0.5)),
                  const SizedBox(height: 16),
                  Text(
                    'No saved searches yet',
                    style: theme.textTheme.titleMedium?.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Save your searches to quickly access them later',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: AppColors.textSecondary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          );
        }
        return ListView.builder(
          shrinkWrap: true,
          itemCount: savedSearches.length,
          itemBuilder: (context, index) {
            final search = savedSearches[index];
            return AppCard(
              margin: const EdgeInsets.only(bottom: 8),
              child: ListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                leading: CircleAvatar(
                  backgroundColor: AppColors.primary.withOpacity(0.1),
                  child: Icon(Icons.bookmark, color: AppColors.primary, size: 20),
                ),
                title: Text(
                  search.name,
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
                subtitle: Text(
                  _formatFilters(search.filters),
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                ),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SearchAlertsToggle(
                      isEnabled: search.isAlertEnabled,
                      onToggle: (enabled) async {
                        try {
                          final updated = search.copyWith(isAlertEnabled: enabled);
                          await ref.read(searchProvider.notifier).saveSearch(updated);
                          if (context.mounted) {
                            AppToast.success(context, enabled ? 'Alerts enabled' : 'Alerts disabled');
                            ref.invalidate(savedSearchesProvider(userId));
                          }
                        } catch (e) {
                          if (context.mounted) {
                            AppToast.error(context, 'Failed to update alert');
                          }
                        }
                      },
                    ),
                    IconButton(
                      onPressed: () async {
                        final confirm = await showDialog<bool>(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: const Text('Delete Saved Search'),
                            content: Text('Are you sure you want to delete "${search.name}"?'),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context, false),
                                child: const Text('Cancel'),
                              ),
                              TextButton(
                                onPressed: () => Navigator.pop(context, true),
                                child: const Text('Delete', style: TextStyle(color: AppColors.error)),
                              ),
                            ],
                          ),
                        );
                        if (confirm == true && context.mounted) {
                          try {
                            await ref.read(searchProvider.notifier).deleteSavedSearch(search.id);
                            if (context.mounted) {
                              AppToast.success(context, 'Search deleted');
                              ref.invalidate(savedSearchesProvider(userId));
                            }
                          } catch (e) {
                            if (context.mounted) {
                              AppToast.error(context, 'Failed to delete search');
                            }
                          }
                        }
                      },
                      icon: const Icon(Icons.delete_outline, size: 20),
                      color: AppColors.error,
                    ),
                  ],
                ),
                onTap: () {
                  final params = search.filters.toQueryParams();
                  context.push('/search?${params.entries.map((e) => '${e.key}=${Uri.encodeComponent(e.value.toString())}').join('&')}');
                },
              ),
            );
          },
        );
      },
    );
  }

  String _formatFilters(PropertySearchFilters filters) {
    final parts = <String>[];
    if (filters.type != null) parts.add(filters.type!);
    if (filters.minPrice != null || filters.maxPrice != null) {
      final min = filters.minPrice?.toStringAsFixed(0) ?? '0';
      final max = filters.maxPrice?.toStringAsFixed(0) ?? 'Any';
      parts.add('\$$min - \$$max');
    }
    if (filters.minBedrooms != null) parts.add('${filters.minBedrooms}+ beds');
    if (filters.neighborhood != null) parts.add(filters.neighborhood!);
    if (parts.isEmpty) return 'All properties';
    return parts.join(' | ');
  }
}