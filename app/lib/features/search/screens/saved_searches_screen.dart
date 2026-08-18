import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/state/auth_provider.dart';
import 'package:homepulse/state/search_provider.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/app_toast.dart';
import 'package:homepulse/widgets/loading_spinner.dart';
import 'package:homepulse/core/utils/formatters.dart';

class SavedSearchesScreen extends ConsumerWidget {
  const SavedSearchesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final searchesAsync = ref.watch(savedSearchesProvider('current-user'));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Saved Searches'),
      ),
      body: RefreshIndicator(
        onRefresh: () async => ref.invalidate(savedSearchesProvider),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              searchesAsync.when(
                loading: () => const Center(child: LoadingSpinner()),
                error: (error, _) => Center(child: Text('Failed to load saved searches')),
                data: (searches) {
                  if (searches.isEmpty) {
                    return Center(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          children: [
                            Icon(Icons.search_off_rounded, size: 48, color: AppColors.textTertiary),
                            const SizedBox(height: 16),
                            Text('No saved searches yet', style: theme.textTheme.titleMedium),
                            const SizedBox(height: 8),
                            Text('Save your search criteria to get alerts when new properties match.', style: theme.textTheme.bodyMedium),
                          ],
                        ),
                      ),
                    );
                  }
                  return ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: searches.length,
                    itemBuilder: (context, index) {
                      final search = searches[index];
                      return AppCard(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: ListTile(
                          leading: Icon(
                            search.isAlertEnabled ? Icons.notifications_active_rounded : Icons.notifications_off_rounded,
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
                            icon: const Icon(Icons.delete_outline_rounded),
                          ),
                        ),
                      );
                    },
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
