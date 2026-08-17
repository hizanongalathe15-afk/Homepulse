import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class NeighborhoodBoundary extends StatelessWidget {
  const NeighborhoodBoundary({super.key});

  @override
  Widget build(BuildContext context) {
    return PolygonLayer(
      polygons: [
        Polygon(
          points: const [
            LatLng(-1.295, 36.818),
            LatLng(-1.295, 36.825),
            LatLng(-1.289, 36.825),
            LatLng(-1.289, 36.818),
          ],
          color: Colors.blue.withOpacity(0.15),
          borderColor: Colors.blue,
          borderStrokeWidth: 2,
        ),
        Polygon(
          points: const [
            LatLng(-1.298, 36.828),
            LatLng(-1.298, 36.835),
            LatLng(-1.292, 36.835),
            LatLng(-1.292, 36.828),
          ],
          color: Colors.green.withOpacity(0.15),
          borderColor: Colors.green,
          borderStrokeWidth: 2,
        ),
      ],
    );
  }
}
