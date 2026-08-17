import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../widgets/app_button.dart';
import '../../../widgets/rating_stars.dart';
import '../../../widgets/verified_badge.dart';
import '../../../widgets/app_card.dart';
import '../../../core/utils/formatters.dart';
import '../../../models/property.dart';

class PropertyDetailScreen extends ConsumerStatefulWidget {
  final String propertyId;

  const PropertyDetailScreen({super.key, required this.propertyId});

  @override
  ConsumerState<PropertyDetailScreen> createState() =>
      _PropertyDetailScreenState();
}

class _PropertyDetailScreenState extends ConsumerState<PropertyDetailScreen> {
  int _currentImageIndex = 0;
  final PageController _pageController = PageController();

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 320,
            pinned: true,
            backgroundColor: Colors.transparent,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                '',
                style: const TextStyle(color: Colors.transparent),
              ),
              background: Stack(
                children: [
                  PageView.builder(
                    controller: _pageController,
                    itemCount: 5,
                    onPageChanged: (i) =>
                        setState(() => _currentImageIndex = i),
                    itemBuilder: (context, index) => Hero(
                      tag: 'property-${widget.propertyId}-$index',
                      child: Container(
                        decoration: BoxDecoration(
                          image: DecorationImage(
                            image: NetworkImage(
                              'https://images.unsplash.com/photo-${1555 + index}-home?auto=format&fit=crop&w=1200&q=80',
                            ),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 12,
                    left: 0,
                    right: 0,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(
                        5,
                        (index) => AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          width: _currentImageIndex == index ? 24 : 8,
                          height: 8,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(4),
                            color: _currentImageIndex == index
                                ? Colors.white
                                : Colors.white.withOpacity(0.4),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          'Luxury Apartment in Downtown',
                          style: theme.textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const VerifiedBadge(size: 20),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Nairobi, Kenya',
                    style: theme.textTheme.bodyMedium?.copyColor(
                      theme.colorScheme.onSurface.withOpacity(0.6),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      RatingStars(rating: 4.8, size: 18),
                      const SizedBox(width: 8),
                      Text(
                        '(128 reviews)',
                        style: theme.textTheme.bodySmall?.copyColor(
                          theme.colorScheme.onSurface.withOpacity(0.5),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Text(
                    formatCurrency(250000) + '/month',
                    style: theme.textTheme.headlineMedium?.copyColor(
                      AppColors.primary,
                    ).copyWith(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 20),
                  _buildAmenities(),
                  const SizedBox(height: 20),
                  Text(
                    'Description',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Beautifully furnished 3-bedroom apartment with modern amenities, located in the heart of the city. Close to shopping malls, schools, and hospitals.',
                    style: theme.textTheme.bodyMedium?.copyColor(
                      theme.colorScheme.onSurface.withOpacity(0.7),
                    ),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: AppButton(
                      text: 'Book Now',
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Booking feature coming soon')),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAmenities() {
    final amenities = [
      Icons.wifi,
      Icons.local_parking,
      Icons.water,
      Icons.electric_bolt,
      Icons.pets,
      Icons.security,
    ];
    final labels = ['WiFi', 'Parking', 'Water', 'Electricity', 'Pets', 'Security'];

    return Wrap(
      spacing: 20,
      runSpacing: 12,
      children: List.generate(amenities.length, (i) => Column(
        children: [
          Icon(
            amenities[i],
            size: 28,
            color: Colors.grey[600],
          ),
          const SizedBox(height: 4),
          Text(
            labels[i],
            style: const TextStyle(fontSize: 11, color: Colors.grey),
          ),
        ],
      )),
    );
  }
}

extension on TextStyle {
  TextStyle copyColor(Color color) => copyWith(color: color);
}
