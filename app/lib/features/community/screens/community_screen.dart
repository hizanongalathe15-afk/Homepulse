import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/neighborhood.dart';
import '../../../../services/community_service.dart';
import '../../../../state/auth_provider.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../widgets/loading_spinner.dart';
import 'widgets/community_chat.dart';
import 'widgets/community_groups.dart';
import 'widgets/local_events.dart';
import 'widgets/neighbor_feed.dart';

class CommunityScreen extends ConsumerStatefulWidget {
  const CommunityScreen({super.key});

  @override
  ConsumerState<CommunityScreen> createState() => _CommunityScreenState();
}

class _CommunityScreenState extends ConsumerState<CommunityScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final List<String> _tabs = const ['Feed', 'Events', 'Groups', 'Chat'];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final neighborhoodsAsync = ref.watch(communityProvider);
    final authState = ref.watch(authProvider);
    final currentUserId = authState.value?.id ?? '';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Community'),
        bottom: TabBar(
          controller: _tabController,
          tabs: _tabs.map((t) => Tab(text: t)).toList(),
          labelColor: AppColors.onPrimary,
          unselectedLabelColor: AppColors.onPrimary.withOpacity(0.7),
          indicatorColor: AppColors.onPrimary,
        ),
      ),
      body: neighborhoodsAsync.when(
        loading: () => const Center(child: LoadingSpinner()),
        error: (error, _) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48, color: Colors.red),
              const SizedBox(height: 16),
              Text('Error loading community', style: theme.textTheme.titleMedium),
              const SizedBox(height: 8),
              ElevatedButton(
                onPressed: () => ref.invalidate(communityProvider),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
        data: (neighborhoods) {
          return TabBarView(
            controller: _tabController,
            children: [
              NeighborFeed(neighborhoods: neighborhoods, currentUserId: currentUserId),
              LocalEvents(neighborhoods: neighborhoods),
              CommunityGroups(neighborhoods: neighborhoods),
              const CommunityChat(),
            ],
          );
        },
      ),
    );
  }
}
