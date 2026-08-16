import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/roommate_profile.dart';
import '../../../../services/roommate_service.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/loading_spinner.dart';
import '../../../../widgets/app_toast.dart';
import '../screens/widgets/match_card.dart';
import '../screens/widgets/compatibility_quiz.dart';
import '../screens/widgets/match_chat_button.dart';

class RoommatesScreen extends ConsumerStatefulWidget {
  const RoommatesScreen({super.key});

  @override
  ConsumerState<RoommatesScreen> createState() => _RoommatesScreenState();
}

class _RoommatesScreenState extends ConsumerState<RoommatesScreen> {
  bool _showQuiz = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final roommatesAsync = ref.watch(roommateProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Find Roommates'),
        actions: [
          IconButton(
            onPressed: () {
              setState(() => _showQuiz = !_showQuiz);
            },
            icon: Icon(_showQuiz ? Icons.close : Icons.quiz_outlined),
            tooltip: 'Compatibility Quiz',
          ),
        ],
      ),
      body: Column(
        children: [
          if (_showQuiz)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.background,
                border: Border(bottom: BorderSide(color: AppColors.divider)),
              ),
              child: const CompatibilityQuiz(),
            ),
          Expanded(
            child: roommatesAsync.when(
              loading: () => const Center(child: LoadingSpinner()),
              error: (error, _) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline, size: 48, color: Colors.red),
                    const SizedBox(height: 16),
                    Text('Error loading roommates', style: theme.textTheme.titleMedium),
                    const SizedBox(height: 8),
                    ElevatedButton(
                      onPressed: () => ref.invalidate(roommateProvider),
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
              data: (roommates) {
                if (roommates.isEmpty) {
                  return Center(
                    child: Column(
                      children: [
                        Icon(Icons.people_outline, size: 64, color: AppColors.textSecondary.withValues(alpha: 0.5)),
                        const SizedBox(height: 16),
                        Text(
                          'No roommates found',
                          style: theme.textTheme.titleMedium?.copyWith(color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  );
                }
                return RefreshIndicator(
                  onRefresh: () => ref.read(roommateProvider.notifier).build(),
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: roommates.length,
                    itemBuilder: (context, index) {
                      final roommate = roommates[index];
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: MatchCard(
                          profile: roommate,
                          onSwipeLeft: () {
                            AppToast.show(context, 'Skipped');
                          },
                          onSwipeRight: () {
                            AppToast.show(context, 'Liked!');
                          },
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
