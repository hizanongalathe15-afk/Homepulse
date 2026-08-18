import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/loading_spinner.dart';

class VirtualTour extends ConsumerWidget {
  final String propertyId;

  const VirtualTour({
    super.key,
    required this.propertyId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tourAsync = ref.watch(virtualTourProvider(propertyId));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Virtual Tour', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 12),
        tourAsync.when(
          loading: () => const AppCard(
            padding: EdgeInsets.all(40),
            child: Center(child: LoadingSpinner()),
          ),
          error: (error, _) => AppCard(
            padding: const EdgeInsets.all(40),
            child: Center(
              child: Column(
                children: [
                  Icon(Icons.video_call_outlined, size: 48, color: AppColors.textSecondary),
                  const SizedBox(height: 8),
                  Text('Virtual tour not available', style: TextStyle(color: AppColors.textSecondary)),
                  const SizedBox(height: 12),
                  AppButton(
                    text: 'Request Tour',
                    isOutlined: true,
                    onPressed: () {},
                  ),
                ],
              ),
            ),
          ),
          data: (tour) {
            if (tour == null || tour.isEmpty) {
              return AppCard(
                padding: const EdgeInsets.all(40),
                child: Center(
                  child: Column(
                    children: [
                      Icon(Icons.video_call_outlined, size: 48, color: AppColors.textSecondary),
                      const SizedBox(height: 8),
                      Text('No virtual tour available', style: TextStyle(color: AppColors.textSecondary)),
                      const SizedBox(height: 12),
                      AppButton(
                        text: 'Request Tour',
                        isOutlined: true,
                        onPressed: () {},
                      ),
                    ],
                  ),
                ),
              );
            }
            return SizedBox(
              height: 220,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: tour.length,
                itemBuilder: (context, index) {
                  final item = tour[index];
                  return GestureDetector(
                    onTap: () => _openTourViewer(context, item),
                    child: Container(
                      width: 300,
                      margin: EdgeInsets.only(right: index < tour.length - 1 ? 12 : 0),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        image: DecorationImage(
                          image: NetworkImage(item['thumbnail'] ?? 'https://via.placeholder.com/300x200'),
                          fit: BoxFit.cover,
                        ),
                      ),
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          gradient: LinearGradient(
                            begin: Alignment.bottomCenter,
                            end: Alignment.topCenter,
                            colors: [Colors.black.withOpacity(0.6), Colors.transparent],
                          ),
                        ),
                        child: Center(
                          child: Icon(Icons.play_circle_outline, size: 48, color: Colors.white.withOpacity(0.9)),
                        ),
                      ),
                    ),
                  );
                },
              ),
            );
          },
        ),
      ],
    );
  }

  void _openTourViewer(BuildContext context, Map<String, dynamic> tour) {
    showDialog(
      context: context,
      builder: (context) => _TourViewerDialog(tour: tour),
    );
  }
}

final virtualTourProvider = FutureProvider.family<List<Map<String, dynamic>>?, String>((ref, propertyId) async {
  await Future.delayed(const Duration(milliseconds: 300));
  return [
    {'id': 'tour_1', 'thumbnail': 'https://via.placeholder.com/300x200', 'url': 'https://example.com/tour1'},
    {'id': 'tour_2', 'thumbnail': 'https://via.placeholder.com/300x200', 'url': 'https://example.com/tour2'},
  ];
});

class _TourViewerDialog extends StatelessWidget {
  final Map<String, dynamic> tour;

  const _TourViewerDialog({required this.tour});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.black,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          AppBar(
            backgroundColor: Colors.transparent,
            foregroundColor: Colors.white,
            title: Text(tour['id'] ?? 'Virtual Tour'),
            actions: [
              IconButton(onPressed: () => Navigator.pop(context), icon: Icon(LucideIcons.x)),
            ],
          ),
          const SizedBox(height: 120),
          const Icon(Icons.play_circle_outline, size: 80, color: Colors.white),
          const SizedBox(height: 16),
          TextButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.open_in_new, color: Colors.white),
            label: const Text('Open in browser', style: TextStyle(color: Colors.white)),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}
