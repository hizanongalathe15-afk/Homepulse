import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/property.dart';
import '../../../../services/map_service.dart';
import '../../../../state/map_provider.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/loading_spinner.dart';
import '../../../../widgets/app_toast.dart';
import 'widgets/property_pin.dart';
import 'widgets/property_card.dart';
import 'widgets/filter_bar.dart';
import 'widgets/safety_score_overlay.dart';
import 'widgets/neighborhood_boundary.dart';
import 'widgets/weather_overlay.dart';

class MapScreen extends ConsumerStatefulWidget {
  const MapScreen({super.key});

  @override
  ConsumerState<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends ConsumerState<MapScreen> {
  final MapController _mapController = MapController();
  final TextEditingController _searchController = TextEditingController();
  bool _showSafetyOverlay = false;
  bool _showWeatherOverlay = false;
  bool _showNeighborhoodBoundary = false;
  Property? _selectedProperty;
  PropertySearchFilters _filters = const PropertySearchFilters();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _locateUser() async {
    try {
      final position = await ref.read(mapProvider.notifier).getCurrentLocation();
      _mapController.move(LatLng(position.latitude, position.longitude), 14.0);
    } on Exception catch (e) {
      AppToast.show(context, 'Could not get location');
    }
  }

  void _onFilterChanged(PropertySearchFilters newFilters) {
    setState(() => _filters = newFilters);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final mapAsync = ref.watch(mapProvider);

    return Scaffold(
      body: Stack(
        children: [
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: const LatLng(-1.2921, 36.8219),
              initialZoom: 13.0,
              onTap: (tap, latLng) {
                if (_selectedProperty != null) {
                  setState(() => _selectedProperty = null);
                }
              },
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.homepulse.app',
              ),
              if (_showSafetyOverlay) const SafetyScoreOverlay(),
              if (_showNeighborhoodBoundary) const NeighborhoodBoundary(),
              if (_showWeatherOverlay) const WeatherOverlay(),
              MarkerLayer(
                markers: mapAsync.valueOrNull?.map((property) {
                  return Marker(
                    width: 48,
                    height: 48,
                    point: LatLng(
                      property.location.hashCode % 100 * 0.001 - 1.2921,
                      property.location.hashCode % 100 * 0.001 + 36.8219,
                    ),
                    child: PropertyPin(
                      property: property,
                      onTap: () {
                        setState(() => _selectedProperty = property);
                      },
                    ),
                  );
                }).toList() ?? [],
              ),
              MarkerLayer(
                markers: [
                  Marker(
                    width: 20,
                    height: 20,
                    point: const LatLng(-1.2921, 36.8219),
                    child: Container(
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 3),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primary.withOpacity(0.4),
                            blurRadius: 8,
                            spreadRadius: 2,
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
          Positioned(
            top: 16,
            left: 16,
            right: 16,
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _searchController,
                          decoration: InputDecoration(
                            hintText: 'Search location...',
                            border: InputBorder.none,
                            contentPadding: const EdgeInsets.symmetric(horizontal: 8),
                            prefixIcon: const Icon(Icons.search, size: 20),
                          ),
                        ),
                      ),
                      IconButton(
                        onPressed: _locateUser,
                        icon: const Icon(Icons.my_location, color: AppColors.primary),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                FilterBar(
                  onFilterChanged: _onFilterChanged,
                ),
              ],
            ),
          ),
          Positioned(
            bottom: 16,
            right: 16,
            child: Column(
              children: [
                FloatingActionButton(
                  mini: true,
                  onPressed: () {
                    setState(() => _showSafetyOverlay = !_showSafetyOverlay);
                  },
                  backgroundColor: _showSafetyOverlay ? AppColors.primary : AppColors.surface,
                  child: Icon(
                    Icons.security,
                    color: _showSafetyOverlay ? AppColors.onPrimary : AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 8),
                FloatingActionButton(
                  mini: true,
                  onPressed: () {
                    setState(() => _showWeatherOverlay = !_showWeatherOverlay);
                  },
                  backgroundColor: _showWeatherOverlay ? AppColors.primary : AppColors.surface,
                  child: Icon(
                    Icons.wb_sunny,
                    color: _showWeatherOverlay ? AppColors.onPrimary : AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 8),
                FloatingActionButton(
                  mini: true,
                  onPressed: () {
                    setState(() => _showNeighborhoodBoundary = !_showNeighborhoodBoundary);
                  },
                  backgroundColor: _showNeighborhoodBoundary ? AppColors.primary : AppColors.surface,
                  child: Icon(
                    Icons.map,
                    color: _showNeighborhoodBoundary ? AppColors.onPrimary : AppColors.textPrimary,
                  ),
                ),
              ],
            ),
          ),
          if (_selectedProperty != null)
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: PropertyCard(
                property: _selectedProperty!,
                onClose: () => setState(() => _selectedProperty = null),
              ),
            ),
        ],
      ),
    );
  }
}
