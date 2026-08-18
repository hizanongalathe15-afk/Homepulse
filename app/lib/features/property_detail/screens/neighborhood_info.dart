import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/models/neighborhood.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/rating_stars.dart';
import 'package:homepulse/widgets/app_button.dart';

class NeighborhoodInfo extends ConsumerWidget {
  final String propertyId;

  const NeighborhoodInfo({
    super.key,
    required this.propertyId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final neighborhoodAsync = ref.watch(neighborhoodProvider(propertyId));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Neighborhood', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 12),
        neighborhoodAsync.when(
          loading: () => const AppCard(
            padding: EdgeInsets.all(40),
            child: Center(child: CircularProgressIndicator()),
          ),
          error: (error, _) => AppCard(
            padding: const EdgeInsets.all(16),
            child: Text('Unable to load neighborhood info', style: TextStyle(color: AppColors.textSecondary)),
          ),
          data: (neighborhood) {
            if (neighborhood == null) {
              return AppCard(
                padding: const EdgeInsets.all(16),
                child: Text('No neighborhood data available', style: TextStyle(color: AppColors.textSecondary)),
              );
            }
            return AppCard(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          neighborhood.name,
                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
                        ),
                      ),
                      if (neighborhood.safetyRating != null) ...[
                        RatingStars(rating: neighborhood.safetyRating!, size: 16),
                        const SizedBox(width: 6),
                        Text('${neighborhood.safetyRating!.toStringAsFixed(1)}', style: const TextStyle(fontWeight: FontWeight.w600)),
                      ],
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text('${neighborhood.city}, ${neighborhood.country}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                  if (neighborhood.description != null) ...[
                    const SizedBox(height: 8),
                    Text(neighborhood.description!, style: const TextStyle(color: AppColors.textSecondary, height: 1.4)),
                  ],
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      _InfoChip(icon: LucideIcons.users, label: neighborhood.population != null ? '${neighborhood.population} people' : 'N/A'),
                      const SizedBox(width: 8),
                      _InfoChip(icon: Icons.shield, label: neighborhood.safetyRating != null ? 'Safety: ${neighborhood.safetyRating!.toStringAsFixed(1)}/5' : 'N/A'),
                    ],
                  ),
                  const SizedBox(height: 12),
                  AppButton(
                    text: 'View on Map',
                    isOutlined: true,
                    onPressed: () {},
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}

final neighborhoodProvider = FutureProvider.family<Neighborhood?, String>((ref, propertyId) async {
  await Future.delayed(const Duration(milliseconds: 200));
  return Neighborhood(
    id: 'neighborhood_001',
    name: 'Westlands',
    city: 'Nairobi',
    country: 'Kenya',
    safetyRating: 4.2,
    population: 150000,
    description: 'A vibrant neighborhood with excellent amenities, shopping centers, and good connectivity to the city center.',
    latitude: -1.2636,
    longitude: 36.8088,
  );
});

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoChip({
    required this.icon,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: AppColors.textSecondary),
          const SizedBox(width: 4),
          Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
        ],
      ),
    );
  }
}
