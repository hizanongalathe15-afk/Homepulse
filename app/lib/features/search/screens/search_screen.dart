import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/property.dart';
import '../../../../models/saved_search.dart';
import '../../../../state/search_provider.dart';
import '../../../../state/auth_provider.dart';
import '../../../../services/property_service.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../widgets/loading_spinner.dart';
import './widgets/search_bar.dart';
import './widgets/saved_search_list.dart';
import './widgets/search_alerts_toggle.dart';

class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key});

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  PropertySearchFilters _filters = const PropertySearchFilters();
  bool _isMapView = false;
  bool _showFilters = false;
  String? _selectedPropertyType;

  final List<String> _propertyTypes = [
    'apartment',
    'house',
    'studio',
    'villa',
    'townhouse',
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _performSearch() async {
    final query = _searchController.text.trim();
    final filters = _filters.copyWith(query: query.isNotEmpty ? query : null);
    setState(() => _filters = filters);
    await ref.read(searchProvider.notifier).filter(filters);
  }

  void _updateFilter(String key, dynamic value) {
    setState(() {
      switch (key) {
        case 'type':
          _selectedPropertyType = value as String?;
          _filters = _filters.copyWith(type: value as String?);
          break;
        case 'minPrice':
          _filters = _filters.copyWith(minPrice: value as double?);
          break;
        case 'maxPrice':
          _filters = _filters.copyWith(maxPrice: value as double?);
          break;
        case 'minBedrooms':
          _filters = _filters.copyWith(minBedrooms: value as int?);
          break;
        case 'maxBedrooms':
          _filters = _filters.copyWith(maxBedrooms: value as int?);
          break;
        case 'neighborhood':
          _filters = _filters.copyWith(neighborhood: value as String?);
          break;
        case 'minSquareMeters':
          _filters = _filters.copyWith(minSquareMeters: value as double?);
          break;
      }
    });
  }

  void _clearFilters() {
    setState(() {
      _searchController.clear();
      _selectedPropertyType = null;
      _filters = const PropertySearchFilters();
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final searchResults = ref.watch(searchProvider);
    final savedSearchesAsync = ref.watch(authProvider).when(
      data: (user) {
        if (user == null) return const AsyncData(<SavedSearch>[]);
        return ref.watch(savedSearchesProvider(user.id));
      },
      loading: () => const AsyncLoading(),
      error: (_, __) => const AsyncData(<SavedSearch>[]),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Search'),
        actions: [
          IconButton(
            onPressed: () {
              setState(() => _isMapView = !_isMapView);
            },
            icon: Icon(_isMapView ? LucideIcons.list : LucideIcons.map, size: 20),
            tooltip: _isMapView ? 'List View' : 'Map View',
          ),
          IconButton(
            onPressed: () {
              setState(() => _showFilters = !_showFilters);
            },
            icon: Icon(_showFilters ? LucideIcons.slash : LucideIcons.filter, size: 20),
            tooltip: 'Filters',
          ),
        ],
      ),
      body: Column(
        children: [
          SearchBarWidget(
            controller: _searchController,
            onSearch: _performSearch,
            onFilterTap: () {
              setState(() => _showFilters = !_showFilters);
            },
          ),
          if (_showFilters) _buildFilters(theme),
          Expanded(
            child: searchResults.when(
              loading: () => const Center(child: LoadingSpinner()),
              error: (error, _) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(LucideIcons.circle_alert, size: 48, color: Colors.red),
                    const SizedBox(height: 16),
                    Text('Error loading results', style: theme.textTheme.titleMedium),
                    const SizedBox(height: 8),
                    ElevatedButton(
                      onPressed: _performSearch,
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
              data: (properties) {
                if (_isMapView) {
                  return _buildMapView(properties);
                }
                if (properties.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(LucideIcons.search_x, size: 64, color: AppColors.textSecondary.withOpacity(0.5)),
                        const SizedBox(height: 16),
                        Text(
                          'No properties found',
                          style: theme.textTheme.titleMedium?.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                        if (_filters.isNotEmpty) ...[
                          const SizedBox(height: 8),
                          TextButton(
                            onPressed: _clearFilters,
                            child: const Text('Clear filters'),
                          ),
                        ],
                      ],
                    ),
                  );
                }
                return RefreshIndicator(
                  onRefresh: _performSearch,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: properties.length,
                    itemBuilder: (context, index) {
                      final property = properties[index];
                      return AppCard(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (property.imageUrls.isNotEmpty)
                              ClipRRect(
                                borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                                child: Image.network(
                                  property.imageUrls.first,
                                  height: 180,
                                  width: double.infinity,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) => Container(
                                    height: 180,
                                    color: AppColors.background,
                                    child: const Icon(Icons.image_not_supported_outlined, size: 48),
                                  ),
                                ),
                              ),
                            Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Expanded(
                                        child: Text(
                                          property.title,
                                          style: theme.textTheme.titleMedium?.copyWith(
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ),
                                      Text(
                                        '\$${property.price.toStringAsFixed(0)}',
                                        style: theme.textTheme.titleMedium?.copyWith(
                                          fontWeight: FontWeight.bold,
                                          color: AppColors.primary,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    property.location,
                                    style: theme.textTheme.bodySmall?.copyWith(
                                      color: AppColors.textSecondary,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Row(
                                    children: [
                                      Icon(Icons.star, size: 16, color: AppColors.warning),
                                      const SizedBox(width: 4),
                                      Text(
                                        property.rating.toStringAsFixed(1),
                                        style: theme.textTheme.bodySmall,
                                      ),
                                      const SizedBox(width: 16),
                                      Icon(Icons.reviews, size: 16, color: AppColors.textSecondary),
                                      const SizedBox(width: 4),
                                      Text(
                                        '${property.reviewCount} reviews',
                                        style: theme.textTheme.bodySmall,
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ],
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

  Widget _buildFilters(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        border: Border(
          bottom: BorderSide(color: AppColors.divider),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Filters',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              TextButton(
                onPressed: _clearFilters,
                child: const Text('Clear all'),
              ),
            ],
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            value: _selectedPropertyType,
            decoration: InputDecoration(
              hintText: 'Property type',
              prefixIcon: Icon(LucideIcons.house),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            items: _propertyTypes.map((type) {
              return DropdownMenuItem(
                value: type,
                child: Text(type[0].toUpperCase() + type.substring(1)),
              );
            }).toList(),
            onChanged: (value) {
              _updateFilter('type', value);
            },
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: TextFormField(
                                  decoration: InputDecoration(
                                    hintText: 'Min price',
                                    prefixIcon: const Icon(LucideIcons.dollar_sign),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                  ),
                  keyboardType: TextInputType.number,
                  onChanged: (value) {
                    final parsed = double.tryParse(value);
                    _updateFilter('minPrice', parsed);
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextFormField(
                                  decoration: InputDecoration(
                                    hintText: 'Max price',
                                    prefixIcon: const Icon(LucideIcons.dollar_sign),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                  ),
                  keyboardType: TextInputType.number,
                  onChanged: (value) {
                    final parsed = double.tryParse(value);
                    _updateFilter('maxPrice', parsed);
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          TextFormField(
            decoration: InputDecoration(
              hintText: 'Neighborhood',
              prefixIcon: Icon(LucideIcons.map_pin),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            onChanged: (value) => _updateFilter('neighborhood', value),
          ),
        ],
      ),
    );
  }

  Widget _buildMapView(List<Property> properties) {
    return FlutterMap(
      options: MapOptions(
        initialCenter: const LatLng(-1.2921, 36.8219),
        initialZoom: 13.0,
      ),
      children: [
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: 'com.homepulse.app',
        ),
        MarkerLayer(
          markers: properties.map((property) {
            return Marker(
              width: 40,
              height: 40,
              point: LatLng(-1.2921 + (property.id.hashCode % 100) * 0.001, 36.8219 + (property.id.hashCode % 100) * 0.001),
              child: GestureDetector(
                onTap: () {
                  context.push('/property/${property.id}');
                },
                child: Icon(
                  Icons.location_on,
                  color: AppColors.primary,
                  size: 40,
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}