import 'package:flutter/material.dart';

class RatingStars extends StatelessWidget {
  final double rating;
  final int starCount;
  final double size;
  final Color filledColor;
  final Color halfColor;
  final Color emptyColor;
  final bool readOnly;
  final ValueChanged<double>? onRatingChanged;
  final String? semanticLabel;

  const RatingStars({
    super.key,
    this.rating = 0.0,
    this.starCount = 5,
    this.size = 24.0,
    this.filledColor = Colors.amber,
    this.halfColor = Colors.amber,
    this.emptyColor = Colors.grey,
    this.readOnly = true,
    this.onRatingChanged,
    this.semanticLabel,
  })  : assert(rating >= 0 && rating <= starCount),
        assert(starCount > 0);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final stars = List.generate(starCount, (index) {
      final starValue = index + 1;
      return _StarWidget(
        value: starValue,
        rating: rating,
        size: size,
        filledColor: filledColor,
        halfColor: halfColor,
        emptyColor: emptyColor,
        readOnly: readOnly,
        onTap: () {
          if (!readOnly && onRatingChanged != null) {
            onRatingChanged!(starValue.toDouble());
          }
        },
      );
    });

    return Semantics(
      label: semanticLabel ?? 'Rating: $rating out of $starCount',
      value: rating.toStringAsFixed(1),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: stars,
      ),
    );
  }
}

class _StarWidget extends StatelessWidget {
  final double value;
  final double rating;
  final double size;
  final Color filledColor;
  final Color halfColor;
  final Color emptyColor;
  final bool readOnly;
  final VoidCallback onTap;

  const _StarWidget({
    required this.value,
    required this.rating,
    required this.size,
    required this.filledColor,
    required this.halfColor,
    required this.emptyColor,
    required this.readOnly,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    if (readOnly) {
      return _buildStar(context);
    }

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: _buildStar(context),
    );
  }

  Widget _buildStar(BuildContext context) {
    final theme = Theme.of(context);

    if (rating >= value) {
      return Icon(Icons.star_rounded, size: size, color: filledColor);
    } else if (rating >= value - 0.5) {
      return ShaderMask(
        shaderCallback: (bounds) {
          return LinearGradient(
            stops: const [0.5, 0.5],
            colors: [filledColor, emptyColor],
          ).createShader(bounds);
        },
        blendMode: BlendMode.srcIn,
        child: Icon(Icons.star_rounded, size: size, color: filledColor),
      );
    }
    return Icon(Icons.star_rounded, size: size, color: emptyColor);
  }
}
