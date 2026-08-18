import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/neighborhood.dart';
import '../../../../services/community_service.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_toast.dart';

class LocalEvents extends ConsumerWidget {
  final List<Neighborhood> neighborhoods;
  const LocalEvents({super.key, required this.neighborhoods});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final notifier = ref.read(communityProvider.notifier);
    final eventsAsync = notifier.getEvents(neighborhoods.isNotEmpty ? neighborhoods.first.id : '');

    return FutureBuilder<List<CommunityEvent>>(
      future: eventsAsync,
      builder: (context, snapshot) {
        final events = snapshot.data ?? const [];
        return RefreshIndicator(
          onRefresh: () async {
            ref.invalidate(communityProvider);
            await Future.delayed(const Duration(milliseconds: 500));
          },
          child: events.isEmpty
              ? Center(
                  child: Column(
                    children: [
                      Icon(Icons.event_busy, size: 48, color: AppColors.textSecondary.withOpacity(0.5)),
                      const SizedBox(height: 16),
                      Text('No upcoming events', style: theme.textTheme.titleMedium?.copyWith(color: AppColors.textSecondary)),
                    ],
                  ),
                )
              : ListView.builder(
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
                                width: 56,
                                height: 56,
                                decoration: BoxDecoration(
                                  color: AppColors.primary.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      DateFormat('MMM').format(event.startDate),
                                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.primary),
                                    ),
                                    Text(
                                      DateFormat('dd').format(event.startDate),
                                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primary),
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
                                          Icon(LucideIcons.map_pin, size: 14, color: AppColors.textSecondary),
                                          const SizedBox(width: 4),
                                          Expanded(child: Text(event.location!, style: theme.textTheme.bodySmall, maxLines: 1, overflow: TextOverflow.ellipsis)),
                                        ],
                                      ),
                                  ],
                                ),
                              ),
                              IconButton(
                                onPressed: () async {
                                  try {
                                    await notifier.rsvpEvent(event.id, !event.isAttending);
                                    AppToast.success(context, event.isAttending ? 'Left event' : 'Joined event');
                                  } catch (e) {
                                    AppToast.error(context, 'Failed to update RSVP');
                                  }
                                },
                                icon: Icon(event.isAttending ? LucideIcons.circle_check : LucideIcons.circle_plus),
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
                              const Spacer(),
                              TextButton.icon(
                                onPressed: () {
                                  AppToast.info(context, 'Details opened');
                                },
                                icon: const Icon(Icons.info_outline, size: 16),
                                label: const Text('Details'),
                              ),
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
}
