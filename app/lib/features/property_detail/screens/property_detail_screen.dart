import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/models/property.dart';
import 'package:homepulse/state/landlord_provider.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/rating_stars.dart';
import 'package:homepulse/widgets/user_avatar.dart';
import 'package:homepulse/widgets/verified_badge.dart';
import 'package:homepulse/widgets/loading_spinner.dart';
import 'package:homepulse/core/utils/formatters.dart';
import 'package:homepulse/widgets/comment_section.dart';
import 'property_gallery.dart';
import 'virtual_tour.dart';
import 'landlord_profile.dart';
import 'lease_snapshot.dart';
import 'neighborhood_info.dart';
import 'safety_report_section.dart';
import 'sos_button.dart';
import 'trust_score_badge.dart';
import 'viewing_booking.dart';
import 'rent_negotiation.dart';
import 'property_qr_code.dart';
import 'qna_section.dart';
import 'campaign_section.dart';

class PropertyDetailScreen extends ConsumerWidget {
  final String propertyId;

  const PropertyDetailScreen({
    super.key,
    required this.propertyId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final propertyAsync = ref.watch(propertyProvider(propertyId));

    return Scaffold(
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(propertyProvider(propertyId));
        },
        child: propertyAsync.when(
          loading: () => const Center(child: LoadingSpinner()),
          error: (error, _) => Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, size: 48, color: AppColors.error),
                const SizedBox(height: 16),
                Text('Failed to load property', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),
                ElevatedButton(
                  onPressed: () => ref.invalidate(propertyProvider(propertyId)),
                  child: const Text('Retry'),
                ),
              ],
            ),
          ),
          data: (property) {
            return CustomScrollView(
              slivers: [
                SliverAppBar(
                  expandedHeight: 300,
                  pinned: true,
                  flexibleSpace: FlexibleSpaceBar(
                    title: Text(property.title,
                        style: const TextStyle(
                            fontWeight: FontWeight.w600,
                            shadows: [Shadow(blurRadius: 4, color: Colors.black45, offset: Offset(0, 1))])),
                    background: PropertyGallery(imageUrls: property.imageUrls),
                  ),
                  actions: [
                    IconButton(onPressed: () {}, icon: const Icon(Icons.favorite_border)),
                    IconButton(onPressed: () {}, icon: const Icon(Icons.share)),
                  ],
                ),
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(property.title, style: Theme.of(context).textTheme.headlineSmall),
                            ),
                            if (property.isVerified) ...[
                              const SizedBox(width: 8),
                              const VerifiedBadge(size: 20),
                            ],
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(Icons.location_on, size: 16, color: AppColors.textSecondary),
                            const SizedBox(width: 4),
                            Expanded(
                                child: Text(property.location,
                                    style: const TextStyle(color: AppColors.textSecondary))),
                            RatingStars(rating: property.rating, size: 16),
                            const SizedBox(width: 4),
                            Text('(${property.reviewCount})',
                                style:
                                    const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Text(formatCurrency(property.price),
                                style: const TextStyle(
                                    fontSize: 24, fontWeight: FontWeight.w700, color: AppColors.primary)),
                            const Text('/month',
                                style: TextStyle(fontSize: 16, color: AppColors.textSecondary)),
                            const Spacer(),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: property.isAvailable
                                    ? AppColors.success.withOpacity(0.1)
                                    : AppColors.error.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                property.isAvailable ? 'Available' : 'Rented',
                                style: TextStyle(
                                    color:
                                        property.isAvailable ? AppColors.success : AppColors.error,
                                    fontWeight: FontWeight.w600),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: property.tags
                              .map((tag) => Chip(
                                    label: Text(tag, style: const TextStyle(fontSize: 12)),
                                    visualDensity: VisualDensity.compact,
                                  ))
                              .toList(),
                        ),
                        const SizedBox(height: 24),
                        Text('About this property', style: Theme.of(context).textTheme.titleMedium),
                        const SizedBox(height: 8),
                        Text(property.description,
                            style: const TextStyle(color: AppColors.textSecondary, height: 1.5)),
                        const SizedBox(height: 24),
                        CampaignSection(propertyId: propertyId),
                        const SizedBox(height: 24),
                        TrustScoreBadge(score: property.rating),
                        const SizedBox(height: 24),
                        VirtualTour(propertyId: propertyId),
                        const SizedBox(height: 24),
                        PropertyGallery(imageUrls: property.imageUrls),
                        const SizedBox(height: 24),
                        LandlordProfile(landlordId: property.landlordId),
                        const SizedBox(height: 24),
                        LeaseSnapshot(propertyId: propertyId),
                        const SizedBox(height: 24),
                        NeighborhoodInfo(propertyId: propertyId),
                        const SizedBox(height: 24),
                        SafetyReportSection(propertyId: propertyId),
                        const SizedBox(height: 24),
                        SosButton(propertyId: propertyId),
                        const SizedBox(height: 24),
                        ViewingBooking(propertyId: propertyId),
                        const SizedBox(height: 24),
                        RentNegotiation(propertyId: propertyId, currentPrice: property.price),
                        const SizedBox(height: 24),
                         PropertyQrCode(propertyId: propertyId),
                         const SizedBox(height: 24),
                         QnaSection(propertyId: propertyId),
                         const SizedBox(height: 24),
                         CommentSection(propertyId: propertyId),
                         const SizedBox(height: 24),
                         AppButton(
                          text: 'Contact Landlord',
                          onPressed: () =>
                              context.push('/messages?propertyId=$propertyId'),
                        ),
                        const SizedBox(height: 32),
                      ],
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
