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

class AntigravityListItem extends StatefulWidget {
  final int index;
  final int total;
  final double stagger;
  final double distance;
  final Widget child;

  const AntigravityListItem({
    super.key,
    required this.index,
    required this.total,
    this.stagger = 0.1,
    this.distance = 30,
    required this.child,
  });

  @override
  State<AntigravityListItem> createState() => _AntigravityListItemState();
}

class _AntigravityListItemState extends State<AntigravityListItem>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _opacity;
  late final Animation<double> _translateY;
  late final Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    final delay = widget.index * widget.stagger;
    final intervalEnd = (delay + 0.4).clamp(0.0, 1.0);

    _opacity = CurvedAnimation(
      parent: _controller,
      curve: Interval(delay, intervalEnd, curve: Curves.easeOut),
    );
    _translateY = Tween<double>(begin: widget.distance, end: 0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(delay, intervalEnd, curve: Curves.easeOutCubic),
      ),
    );
    _scale = Tween<double>(begin: 0.95, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(delay, intervalEnd, curve: Curves.easeOutCubic),
      ),
    );

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _scale,
      child: FadeTransition(
        opacity: _opacity,
        child: Transform.translate(
          offset: Offset(0, _translateY.value),
          child: widget.child,
        ),
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
        final parallaxFactor = (relativeScroll / 300).clamp(0.0, 1.0);
        final translateY = parallaxFactor * 20 * widget.floatIntensity;
        final scale = 1.0 - parallaxFactor * 0.02;

        return Transform.translate(
          offset: Offset(0, -translateY),
          child: Transform.scale(
            scale: scale,
            child: Opacity(
              opacity: 1.0 - (parallaxFactor * 0.15),
              child: AntigravityListItem(
                index: index,
                total: widget.children.length,
                stagger: widget.staggerDelay,
                distance: 40,
                child: widget.children[index],
              ),
            ),
          ),
        );
      },
    );
  }
}
