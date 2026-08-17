import 'package:flutter/material.dart';
import '../widgets/staggered_animation.dart';
import '../widgets/glass_container.dart';

class MultiSplitScreen extends StatefulWidget {
  final List<MultiSplitItem> items;
  final double gap;
  final bool animate;
  final Axis direction;
  final Curve curve;
  final Duration duration;

  const MultiSplitScreen({
    super.key,
    required this.items,
    this.gap = 12,
    this.animate = true,
    this.direction = Axis.horizontal,
    this.curve = Curves.easeOutCubic,
    this.duration = const Duration(milliseconds: 600),
  });

  @override
  State<MultiSplitScreen> createState() => _MultiSplitScreenState();
}

class _MultiSplitScreenState extends State<MultiSplitScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(duration: widget.duration, vsync: this);
    if (widget.animate) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _controller.forward());
    }
  }

  @override
  void didUpdateWidget(covariant MultiSplitScreen old) {
    if (widget.animate && !old.animate) _controller.forward();
    super.didUpdateWidget(old);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final count = widget.items.length;
    if (count == 0) return const SizedBox.shrink();

    final flexValues = widget.items.map((e) => e.flex).toList();

    return LayoutBuilder(
      builder: (context, constraints) {
        final mainSize = constraints.maxWidth;
        final gaps = widget.gap * (count - 1);
        final available = mainSize - gaps;
        final ratios = flexValues.fold<int>(0, (a, b) => a + b);
        final itemSizes = flexValues.map((f) => (available * f / ratios)).toList();

        if (widget.direction == Axis.horizontal) {
          return SizedBox(
            height: _maxHeight(widget.items),
            child: Row(
              children: List.generate(count, (index) {
                final item = widget.items[index];
                final start = _calculateStart(index, itemSizes, widget.gap);
                return _buildAnimatedItem(
                  context,
                  item,
                  Offset(start, _maxHeight(widget.items)),
                );
              }),
            ),
          );
        }

        return Column(
          children: List.generate(count, (index) {
            final item = widget.items[index];
            return _buildAnimatedItem(context, item, Offset.zero, delay: index * 0.1);
          }),
        );
      },
    );
  }

  double _calculateStart(int index, List<double> sizes, double gap) {
    var start = 0.0;
    for (var i = 0; i < index; i++) {
      start += sizes[i] + gap;
    }
    return start;
  }

  double _maxHeight(List<MultiSplitItem> items) {
    return items.map((e) => e.height).reduce((a, b) => a > b ? a : b);
  }

  Widget _buildAnimatedItem(
    BuildContext context,
    MultiSplitItem item,
    Offset startOffset, {
    double delay = 0.0,
  }) {
    final screenWidth = MediaQuery.of(context).size.width;
    final slideIn = Tween<Offset>(
      begin: startOffset.dx.isFinite && startOffset.dx != 0
          ? Offset(startOffset.dx.sign * (screenWidth * 0.02), startOffset.dy * 0.02)
          : Offset(0, startOffset.dy),
      end: Offset.zero,
    );

    final opacity = Interval(delay, (delay + 0.4).clamp(0.0, 1.0), curve: widget.curve);

    if (!widget.animate) {
      return Expanded(flex: item.flex, child: item.child);
    }

    return Expanded(
      flex: item.flex,
      child: FadeTransition(
        opacity: CurvedAnimation(parent: _controller, curve: opacity),
        child: SlideTransition(
          position: slideIn.animate(CurvedAnimation(parent: _controller, curve: Interval(delay, (delay + 0.4).clamp(0.0, 1.0), curve: widget.curve))),
          child: item.child,
        ),
      ),
    );
  }
}

class MultiSplitItem {
  final Widget child;
  final int flex;
  final double height;

  const MultiSplitItem({
    required this.child,
    this.flex = 1,
    this.height = 200,
  });
}

class SplitView extends StatelessWidget {
  final Widget left;
  final Widget right;
  final double? dividerWidth;
  final Widget? divider;

  const SplitView({
    super.key,
    required this.left,
    required this.right,
    this.dividerWidth = 2,
    this.divider,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final defaultDivider = SizedBox(
      width: dividerWidth,
      child: GestureDetector(
        onPanUpdate: (details) {},
        child: Container(
          color: theme.colorScheme.outline.withOpacity(0.2),
        ),
      ),
    );

    return Row(
      children: [
        Expanded(child: left),
        divider ?? defaultDivider,
        Expanded(child: right),
      ],
    );
  }
}

class SplitScreenLayout extends StatelessWidget {
  final Widget mainContent;
  final Widget? sidePanel;
  final bool showSidePanel;

  const SplitScreenLayout({
    super.key,
    required this.mainContent,
    this.sidePanel,
    this.showSidePanel = false,
  });

  @override
  Widget build(BuildContext context) {
    if (!showSidePanel || sidePanel == null) {
      return mainContent;
    }

    final theme = Theme.of(context);
    final isDesktop = MediaQuery.of(context).size.width > 1024;

    if (isDesktop) {
      return Row(
        children: [
          Expanded(flex: 2, child: mainContent),
          const SizedBox(width: 1),
          Expanded(flex: 1, child: Container(
            decoration: BoxDecoration(
              color: theme.colorScheme.surface,
              boxShadow: [
                BoxShadow(
                  color: theme.colorScheme.shadow.withOpacity(0.05),
                  blurRadius: 8,
                  offset: const Offset(-2, 0),
                ),
              ],
            ),
            child: sidePanel!,
          )),
        ],
      );
    }

    return Scaffold(
      body: mainContent,
      bottomSheet: SizedBox(
        height: 200,
        child: sidePanel!,
      ),
    );
  }
}

class PropertyTypeCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback? onTap;
  final bool selected;

  const PropertyTypeCard({
    super.key,
    required this.icon,
    required this.label,
    this.onTap,
    this.selected = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return FadeInContainer(
      animate: true,
      child: GestureDetector(
        onTap: onTap,
        child: GlassContainer(
          padding: const EdgeInsets.all(16),
          borderRadius: BorderRadius.circular(16),
          backgroundColor: selected
              ? theme.colorScheme.primary.withOpacity(0.1)
              : theme.colorScheme.surface,
          borderWidth: selected ? 2 : 1,
          borderColor: selected
              ? theme.colorScheme.primary
              : theme.colorScheme.outline.withOpacity(0.2),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 32,
                color: selected
                    ? theme.colorScheme.primary
                    : theme.colorScheme.onSurface.withOpacity(0.5),
              ),
              const SizedBox(height: 8),
              Text(
                label,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: selected
                      ? theme.colorScheme.primary
                      : theme.colorScheme.onSurface.withOpacity(0.7),
                  fontWeight: selected ? FontWeight.w600 : FontWeight.normal,
                ),
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class GlassContainer extends StatelessWidget {
  final Widget child;
  final double? width;
  final double? height;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final BorderRadius? borderRadius;
  final Color? backgroundColor;
  final double borderWidth;
  final Color? borderColor;
  final double blurSigma;
  final double elevation;
  final VoidCallback? onTap;

  const GlassContainer({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderRadius,
    this.backgroundColor,
    this.borderWidth = 1,
    this.borderColor,
    this.blurSigma = 10,
    this.elevation = 0,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final effectiveBg = backgroundColor ??
        theme.colorScheme.surface.withOpacity(0.7);
    final effectiveBorder = borderColor ??
        theme.colorScheme.outline.withOpacity(0.2);

    Widget content = Container(
      width: width,
      height: height,
      padding: padding,
      margin: margin,
      decoration: BoxDecoration(
        color: effectiveBg,
        borderRadius: borderRadius ?? BorderRadius.circular(16),
        border: Border.all(color: effectiveBorder, width: borderWidth),
        boxShadow: elevation > 0
            ? [
                BoxShadow(
                  color: theme.colorScheme.shadow.withOpacity(0.08),
                  blurRadius: elevation * 2,
                  offset: Offset(0, elevation),
                ),
              ]
            : [],
      ),
      child: child,
    );

    if (onTap != null) {
      content = GestureDetector(onTap: onTap, child: content);
    }

    return content;
  }
}
