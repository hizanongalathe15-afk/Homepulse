import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/neighborhood.dart';
import '../../../../services/community_service.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_input.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../widgets/loading_spinner.dart';
import '../../../../widgets/qr_code_display.dart';
import '../../../../widgets/rating_stars.dart';
import '../../../../core/utils/formatters.dart';
import '../../../../core/utils/qr_generator.dart';

class NeighborhoodScreen extends ConsumerStatefulWidget {
  final String neighborhoodId;
  const NeighborhoodScreen({super.key, required this.neighborhoodId});

  @override
  ConsumerState<NeighborhoodScreen> createState() => _NeighborhoodScreenState();
}

class _NeighborhoodScreenState extends ConsumerState<NeighborhoodScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final List<String> _tabs = const ['Overview', 'Events', 'Discussions', 'QR'];
  final TextEditingController _discussionController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _discussionController.dispose();
    super.dispose();
  }

  Future<void> _postDiscussion(String neighborhoodId) async {
    final content = _discussionController.text.trim();
    if (content.isEmpty) return;
    try {
      final notifier = ref.read(communityProvider.notifier);
      await notifier.createDiscussion(neighborhoodId, CommunityDiscussion(
        id: '',
        neighborhoodId: neighborhoodId,
        userId: 'current_user',
        userName: 'You',
        title: content.split('\n').first,
        content: content,
        createdAt: DateTime.now(),
      ));
      _discussionController.clear();
      AppToast.success(context, 'Discussion posted');
    } catch (e) {
      AppToast.error(context, 'Failed to post');
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final neighborhoodsAsync = ref.watch(communityProvider);
    final neighborhood = neighborhoodsAsync.valueOrNull?.firstWhere(
      (n) => n.id == widget.neighborhoodId,
      orElse: () => Neighborhood(id: widget.neighborhoodId, name: 'Unknown', city: '', country: '', latitude: 0, longitude: 0),
    );

    if (neighborhood == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Neighborhood')),
        body: const Center(child: Text('Neighborhood not found')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(neighborhood.name),
        actions: [
          IconButton(
            onPressed: () => context.push('/map', extra: {'lat': neighborhood.latitude, 'lng': neighborhood.longitude}),
            icon: const Icon(Icons.map_outlined),
            tooltip: 'View on Map',
          ),
        ],
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: theme.colorScheme.surface,
              border: Border(bottom: BorderSide(color: AppColors.divider)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${neighborhood.city}, ${neighborhood.country}',
                        style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary),
                      ),
                      if (neighborhood.safetyRating != null) ...[
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Icon(Icons.security, size: 16, color: AppColors.success),
                            const SizedBox(width: 4),
                            Text(
                              'Safety: ${neighborhood.safetyRating!.toStringAsFixed(1)}/5',
                              style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textSecondary),
                            ),
                          ],
                        ),
                      ],
                    ],
                  ),
                ),
                if (neighborhood.population != null)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      '${neighborhood.population} residents',
                      style: theme.textTheme.labelSmall?.copyWith(color: AppColors.primary),
                    ),
                  ),
              ],
            ),
          ),
          TabBar(
            controller: _tabController,
            tabs: _tabs.map((t) => Tab(text: t)).toList(),
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildOverview(theme, neighborhood),
                _buildEvents(theme, neighborhood),
                _buildDiscussions(theme, neighborhood),
                _buildQR(theme, neighborhood),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOverview(ThemeData theme, Neighborhood neighborhood) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (neighborhood.description != null && neighborhood.description!.isNotEmpty)
            Text(
              neighborhood.description!,
              style: theme.textTheme.bodyMedium,
            ),
          const SizedBox(height: 24),
          Text('About', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
          const SizedBox(height: 12),
          AppCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                _InfoRow(label: 'City', value: neighborhood.city),
                const Divider(),
                _InfoRow(label: 'Country', value: neighborhood.country),
                if (neighborhood.safetyRating != null) ...[
                  const Divider(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Safety Rating'),
                      RatingStars(rating: neighborhood.safetyRating!, size: 20),
                    ],
                  ),
                ],
                if (neighborhood.population != null) ...[
                  const Divider(),
                  _InfoRow(label: 'Population', value: neighborhood.population!.toString()),
                ],
                const Divider(),
                _InfoRow(label: 'Coordinates', value: '${neighborhood.latitude.toStringAsFixed(4)}, ${neighborhood.longitude.toStringAsFixed(4)}'),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Text('Community Stats', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
          const SizedBox(height: 12),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            childAspectRatio: 1.5,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            children: [
              _StatCard(label: 'Events', value: '12', icon: Icons.event, color: AppColors.primary),
              _StatCard(label: 'Groups', value: '8', icon: Icons.group, color: AppColors.secondary),
              _StatCard(label: 'Members', value: '1.2K', icon: Icons.people, color: AppColors.accent),
              _StatCard(label: 'Posts', value: '345', icon: Icons.article, color: AppColors.info),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildEvents(ThemeData theme, Neighborhood neighborhood) {
    final eventsAsync = ref.watch(communityProvider.notifier).getEvents(neighborhood.id);
    return FutureBuilder<List<CommunityEvent>>(
      future: eventsAsync,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: LoadingSpinner());
        }
        final events = snapshot.data ?? const [];
        if (events.isEmpty) {
          return Center(
            child: Column(
              children: [
                Icon(Icons.event_busy, size: 48, color: AppColors.textSecondary.withOpacity(0.5)),
                const SizedBox(height: 16),
                Text('No events yet', style: theme.textTheme.titleMedium?.copyWith(color: AppColors.textSecondary)),
              ],
            ),
          );
        }
        return RefreshIndicator(
          onRefresh: () async => ref.invalidate(communityProvider),
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: events.length,
            itemBuilder: (context, index) {
              final event = events[index];
              return AppCard(
                margin: const EdgeInsets.only(bottom: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Column(
                            children: [
                              Text(
                                DateFormat('MMM').format(event.startDate),
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primary),
                              ),
                              Text(
                                DateFormat('dd').format(event.startDate),
                                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.primary),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(event.title, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
                              const SizedBox(height: 4),
                              Text(
                                '${DateFormat('hh:mm a').format(event.startDate)} - ${DateFormat('hh:mm a').format(event.endDate)}',
                                style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textSecondary),
                              ),
                              if (event.location != null)
                                Row(
                                  children: [
                                    Icon(Icons.location_on_outlined, size: 14, color: AppColors.textSecondary),
                                    const SizedBox(width: 4),
                                    Expanded(child: Text(event.location!, style: theme.textTheme.bodySmall)),
                                  ],
                                ),
                            ],
                          ),
                        ),
                        IconButton(
                          onPressed: () async {
                            try {
                              await ref.read(communityProvider.notifier).rsvpEvent(event.id, !event.isAttending);
                              AppToast.success(context, event.isAttending ? 'Left event' : 'Joined event');
                            } catch (e) {
                              AppToast.error(context, 'Failed to update RSVP');
                            }
                          },
                          icon: Icon(event.isAttending ? Icons.check_circle : Icons.add_circle_outline),
                          color: event.isAttending ? AppColors.success : AppColors.primary,
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(Icons.people_outline, size: 16, color: AppColors.textSecondary),
                        const SizedBox(width: 4),
                        Text('${event.attendeesCount} attending', style: theme.textTheme.bodySmall),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildDiscussions(ThemeData theme, Neighborhood neighborhood) {
    final notifier = ref.read(communityProvider.notifier);
    return FutureBuilder<List<CommunityDiscussion>>(
      future: notifier.getDiscussions(neighborhood.id),
      builder: (context, snapshot) {
        final discussions = snapshot.data ?? const [];
        return Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: AppInput(
                controller: _discussionController,
                hintText: 'Start a discussion...',
                prefixIcon: const Icon(Icons.edit_outlined),
                maxLines: 3,
                suffixIcon: IconButton(
                  onPressed: () => _postDiscussion(neighborhood.id),
                  icon: const Icon(Icons.send),
                ),
              ),
            ),
            Expanded(
              child: RefreshIndicator(
                onRefresh: () async => ref.invalidate(communityProvider),
                child: ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: discussions.length,
                  itemBuilder: (context, index) {
                    final discussion = discussions[index];
                    return AppCard(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 16,
                                backgroundColor: AppColors.primary,
                                child: Text(discussion.userName[0].toUpperCase(), style: const TextStyle(color: Colors.white, fontSize: 12)),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  discussion.userName,
                                  style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
                                ),
                              ),
                              Text(formatTimeAgo(discussion.createdAt), style: theme.textTheme.labelSmall?.copyWith(color: AppColors.textSecondary)),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            discussion.title,
                            style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w500),
                          ),
                          const SizedBox(height: 4),
                          Text(discussion.content, style: theme.textTheme.bodyMedium),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              IconButton(
                                onPressed: () {},
                                icon: const Icon(Icons.thumb_up_outlined, size: 18),
                                visualDensity: VisualDensity.compact,
                              ),
                              Text('${discussion.likesCount}', style: theme.textTheme.bodySmall),
                              const SizedBox(width: 16),
                              IconButton(
                                onPressed: () {},
                                icon: const Icon(Icons.comment_outlined, size: 18),
                                visualDensity: VisualDensity.compact,
                              ),
                              Text('${discussion.commentsCount}', style: theme.textTheme.bodySmall),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildQR(ThemeData theme, Neighborhood neighborhood) {
    final qrData = QRGenerator.generateDataUrl(type: 'neighborhood', id: neighborhood.id, payload: {'name': neighborhood.name, 'city': neighborhood.city});
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            Text('Scan to view ${neighborhood.name}', style: theme.textTheme.titleMedium),
            const SizedBox(height: 24),
            QRCodeDisplay(data: qrData, size: 240),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton.icon(
                  onPressed: () {
                    AppToast.success(context, 'QR code saved');
                  },
                  icon: const Icon(Icons.download_outlined),
                  label: const Text('Save'),
                ),
                const SizedBox(width: 16),
                OutlinedButton.icon(
                  onPressed: () {
                    AppToast.info(context, 'Share link copied');
                  },
                  icon: const Icon(Icons.share_outlined),
                  label: const Text('Share'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;
  const _InfoRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: AppColors.textSecondary)),
        Text(value, style: const TextStyle(fontWeight: FontWeight.w500)),
      ],
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  const _StatCard({required this.label, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
        ],
      ),
    );
  }
}
