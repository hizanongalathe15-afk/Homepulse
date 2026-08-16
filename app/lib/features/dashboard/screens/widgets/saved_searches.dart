import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/saved_search.dart';
import '../../../../state/search_provider.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../widgets/loading_spinner.dart';
import '../../../../core/utils/formatters.dart';

class SavedSearches extends ConsumerWidget {
  final String userId;
  const SavedSearches({super.key, required this.userId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final searchesAsync = ref.watch(savedSearchesProvider(userId));

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Saved Searches', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
              TextButton(
                onPressed: () {
                  AppToast.info(context, 'Manage saved searches');
                },
                child: const Text('Manage'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          searchesAsync.when(
            loading: () => const Center(child: LoadingSpinner(size: 24)),
            error: (error, _) => const Text('Failed to load'),
            data: (searches) {
              if (searches.isEmpty) {
                return Center(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Text('No saved searches yet', style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary)),
                  ),
                );
              }
              return ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: searches.length,
                separatorBuilder: (context, index) => const Divider(),
                itemBuilder: (context, index) {
                  final search = searches[index];
                  return ListTile(
                    dense: true,
                    leading: Icon(
                      search.isAlertEnabled ? Icons.notifications_active : Icons.notifications_off,
                      color: search.isAlertEnabled ? AppColors.primary : AppColors.textSecondary,
                    ),
                    title: Text(search.name),
                    subtitle: Text('Created ${formatDate(search.createdAt)}'),
                    trailing: IconButton(
                      onPressed: () async {
                        try {
                          await ref.read(searchProvider.notifier).deleteSavedSearch(search.id);
                          AppToast.success(context, 'Search deleted');
                        } catch (e) {
                          AppToast.error(context, 'Failed to delete');
                        }
                      },
                      icon: const Icon(Icons.delete_outline),
                    ),
                  );
                },
              );
            },
          ),
        ],
      ),
    );
  }
}
