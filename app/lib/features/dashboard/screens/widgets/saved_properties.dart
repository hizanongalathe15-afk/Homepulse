import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/property.dart';
import '../../../../models/saved_search.dart';
import '../../../../state/search_provider.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../widgets/loading_spinner.dart';

class SavedProperties extends ConsumerWidget {
  final String userId;
  const SavedProperties({super.key, required this.userId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final savedAsync = ref.watch(savedSearchesProvider(userId));

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Saved Properties', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
              TextButton(
                onPressed: () {
                  AppToast.info(context, 'View all saved properties');
                },
                child: const Text('View All'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          savedAsync.when(
            loading: () => const Center(child: LoadingSpinner(size: 24)),
            error: (error, _) => const Text('Failed to load'),
            data: (searches) {
              final savedIds = searches.map((s) => s.filters.query).whereType<String>().toList();
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (savedIds.isEmpty)
                    Center(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Text('No saved properties yet', style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary)),
                      ),
                    )
                  else
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: savedIds.length.clamp(0, 5),
                      separatorBuilder: (context, index) => const Divider(),
                      itemBuilder: (context, index) {
                        final id = savedIds[index];
                        return ListTile(
                          dense: true,
                          leading: Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: AppColors.primary.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Icon(Icons.home_outlined, color: AppColors.primary),
                          ),
                          title: Text('Property $id'),
                          subtitle: const Text('Saved for later'),
                          trailing: IconButton(
                            onPressed: () {
                              AppToast.success(context, 'Removed from saved');
                            },
                            icon: const Icon(Icons.bookmark_remove_outlined),
                          ),
                        );
                      },
                    ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}
