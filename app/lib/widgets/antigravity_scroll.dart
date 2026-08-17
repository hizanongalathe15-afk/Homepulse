import 'package:flutter/material.dart';

class AntigravityScrollWrapper extends StatelessWidget {
  final Widget child;
  final double intensity;
  final bool parallax;
  final Curve curve;

  const AntigravityScrollWrapper({
    super.key,
    required this.child,
    this.intensity = 1.0,
    this.parallax = true,
    this.curve = Curves.easeOutCubic,
  });

  @override
  Widget build(BuildContext context) {
    if (!parallax) return child;

    return _ParallaxScroll(
      intensity: intensity,
      curve: curve,
      child: child,
    );
  }
}

class _ParallaxScroll extends StatefulWidget {
  final Widget child;
  final double intensity;
  final Curve curve;

  const _ParallaxScroll({
    required this.child,
    required this.intensity,
    required this.curve,
  });

  @override
  State<_ParallaxScroll> createState() => _ParallaxScrollState();
}

class _ParallaxScrollState extends State<_ParallaxScroll> {
  final ScrollController _controller = ScrollController();
  double _scrollDelta = 0;

  @override
  void initState() {
    super.initState();
    _controller.addListener(() {
      setState(() {
        _scrollDelta = _controller.hasClients ? _controller.position.pixels : 0;
      });
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Listener(
      onPointerMove: (event) {
        _scrollDelta += event.delta.dy;
        setState(() {});
      },
      child: Transform.translate(
        offset: Offset(0, -_scrollDelta * 0.02 * widget.intensity),
        child: widget.child,
      ),
    );
  }
}

class AntigravityListItem extends StatelessWidget {
  final int index;
  final int total;
  final double stagger;
  final Widget child;

  const AntigravityListItem({
    super.key,
    required this.index,
    required this.total,
    this.stagger = 0.1,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    final opacity = 1.0;
    final offset = 0.0;

    return Opacity(
      opacity: opacity,
      child: Transform.translate(
        offset: Offset(0, offset),
        child: child,
      ),
    );
  }
}

class AntigravityListView extends StatefulWidget {
  final ScrollController? controller;
  final List<Widget> children;
  final double staggerDelay;
  final double floatIntensity;
  final EdgeInsets? padding;

  const AntigravityListView({
    super.key,
    this.controller,
    required this.children,
    this.staggerDelay = 0.1,
    this.floatIntensity = 0.5,
    this.padding,
  });

  @override
  State<AntigravityListView> createState() => _AntigravityListViewState();
}

class _AntigravityListViewState extends State<AntigravityListView> {
  late final ScrollController _controller;
  final List<double> _itemOffsets = [];
  double _scrollY = 0;

  @override
  void initState() {
    super.initState();
    _controller = widget.controller ?? ScrollController();
    _controller.addListener(_onScroll);
  }

  @override
  void dispose() {
    _controller.removeListener(_onScroll);
    if (widget.controller == null) {
      _controller.dispose();
    }
    super.dispose();
  }

  void _onScroll() {
    setState(() {
      _scrollY = _controller.hasClients ? _controller.position.pixels : 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      controller: _controller,
      padding: widget.padding,
      itemCount: widget.children.length,
      itemBuilder: (context, index) {
        final itemScrollOffset = index * 100.0 * widget.staggerDelay;
        final relativeScroll = (_scrollY - itemScrollOffset).clamp(0.0, double.infinity);
        final parallaxFactor = (relativeScroll / 200).clamp(0.0, 1.0);
        final translateY = parallaxFactor * 20 * widget.floatIntensity;

        return Opacity(
          opacity: 1.0 - (parallaxFactor * 0.1),
          child: Transform.translate(
            offset: Offset(0, -translateY),
            child: widget.children[index],
          ),
        );
      },
    );
  }
}
