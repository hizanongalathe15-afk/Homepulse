import 'package:flutter/material.dart';

class StaggeredList extends StatefulWidget {
  final int itemCount;
  final double staggerDelay;
  final double distance;
  final Duration duration;
  final Curve curve;
  final Widget? Function(BuildContext, int) builder;
  final ScrollPhysics? physics;
  final EdgeInsetsGeometry? padding;
  final Axis scrollDirection;

  const StaggeredList({
    super.key,
    required this.itemCount,
    required this.builder,
    this.staggerDelay = 0.05,
    this.distance = 30.0,
    this.duration = const Duration(milliseconds: 600),
    this.curve = Curves.easeOutCubic,
    this.physics,
    this.padding,
    this.scrollDirection = Axis.vertical,
  });

  @override
  State<StaggeredList> createState() => _StaggeredListState();
}

class _StaggeredListState extends State<StaggeredList>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.duration,
      vsync: this,
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
    return ListView.builder(
      physics: widget.physics,
      padding: widget.padding,
      scrollDirection: widget.scrollDirection,
      itemCount: widget.itemCount,
      itemBuilder: (context, index) {
        final start = index * widget.staggerDelay;
        final end = start + 0.4;
        final interval = Interval(
          start.clamp(0.0, 1.0),
          end.clamp(0.0, 1.0),
          curve: widget.curve,
        );
        final opacity = CurvedAnimation(parent: _controller, curve: interval);
        final slide = Tween<double>(begin: widget.distance, end: 0).animate(
          CurvedAnimation(parent: _controller, curve: interval),
        );

        return AnimatedBuilder(
          animation: _controller,
          builder: (context, child) => Opacity(
            opacity: opacity.value,
            child: Transform.translate(
              offset: Offset(0, slide.value),
              child: child,
            ),
          ),
          child: widget.builder(context, index),
        );
      },
    );
  }
}

class AnimatedCard extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final Duration duration;
  final Curve curve;
  final double elevation;
  final double hoverElevation;
  final BorderRadius? borderRadius;
  final Color? color;
  final Border? border;
  final EdgeInsetsGeometry? padding;
  final bool enableHover;

  const AnimatedCard({
    super.key,
    required this.child,
    this.onTap,
    this.duration = const Duration(milliseconds: 200),
    this.curve = Curves.easeOutCubic,
    this.elevation = 2,
    this.hoverElevation = 8,
    this.borderRadius,
    this.color,
    this.border,
    this.padding,
    this.enableHover = true,
  });

  @override
  State<AnimatedCard> createState() => _AnimatedCardState();
}

class _AnimatedCardState extends State<AnimatedCard>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _scale;
  late final Animation<double> _elevationAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.duration,
      vsync: this,
    );
    _scale = Tween<double>(begin: 1.0, end: 1.02).animate(
      CurvedAnimation(parent: _controller, curve: widget.curve),
    );
    _elevationAnim = Tween<double>(
      begin: widget.elevation,
      end: widget.hoverElevation,
    ).animate(CurvedAnimation(parent: _controller, curve: widget.curve));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final hasBorder = widget.border != null;

    Widget content = Card(
      elevation: widget.elevation,
      color: widget.color,
      shape: RoundedRectangleBorder(
        borderRadius: widget.borderRadius ?? BorderRadius.circular(12),
        side: hasBorder
            ? BorderSide(
                color: widget.border!.top.color,
                width: widget.border!.top.width,
              )
            : BorderSide.none,
      ),
      child: widget.padding != null
          ? Padding(padding: widget.padding!, child: widget.child)
          : widget.child,
    );

    if (widget.enableHover) {
      content = MouseRegion(
        cursor: widget.onTap != null
            ? SystemMouseCursors.click
            : SystemMouseCursors.basic,
        onEnter: (_) => _controller.forward(),
        onExit: (_) => _controller.reverse(),
        child: GestureDetector(
          onTap: widget.onTap,
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, child) => Transform.scale(
              scale: _scale.value,
              child: Card(
                elevation: _elevationAnim.value,
                color: widget.color,
                shape: RoundedRectangleBorder(
                  borderRadius: widget.borderRadius ?? BorderRadius.circular(12),
                ),
                child: widget.padding != null
                    ? Padding(padding: widget.padding!, child: widget.child)
                    : widget.child,
              ),
            ),
          ),
        ),
      );
    } else if (widget.onTap != null) {
      content = GestureDetector(onTap: widget.onTap, child: content);
    }

    return content;
  }
}

class FadeInContainer extends StatefulWidget {
  final Widget child;
  final Duration duration;
  final Curve curve;
  final double distance;
  final bool animate;

  const FadeInContainer({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 400),
    this.curve = Curves.easeOutCubic,
    this.distance = 20,
    this.animate = true,
  });

  @override
  State<FadeInContainer> createState() => _FadeInContainerState();
}

class _FadeInContainerState extends State<FadeInContainer>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _opacity;
  late final Animation<Offset> _offset;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(duration: widget.duration, vsync: this);
    _opacity = CurvedAnimation(parent: _controller, curve: widget.curve);
    _offset = Tween<Offset>(
      begin: Offset(0, widget.distance),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _controller, curve: widget.curve));
    if (widget.animate) _controller.forward();
  }

  @override
  void didUpdateWidget(covariant FadeInContainer old) {
    if (widget.animate && !old.animate) _controller.forward();
    super.didUpdateWidget(old);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => animatedChild();

  Widget animatedChild() {
    if (!widget.animate) return widget.child;
    return FadeTransition(
      opacity: _opacity,
      child: SlideTransition(position: _offset, child: widget.child),
    );
  }
}

PageRouteBuilder<T> slidePageRoute<T>({
  required Widget page,
  Offset begin = const Offset(1, 0),
  Duration duration = const Duration(milliseconds: 350),
  Curve curve = Curves.easeOutCubic,
}) {
  return PageRouteBuilder<T>(
    pageBuilder: (context, animation, secondaryAnimation) => page,
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      final curved = CurvedAnimation(parent: animation, curve: curve);
      final offset = Tween<Offset>(begin: begin, end: Offset.zero)
          .animate(curved);
      return FadeTransition(
        opacity: curved,
        child: SlideTransition(position: offset, child: child),
      );
    },
    transitionDuration: duration,
    reverseTransitionDuration: duration ~/ 2,
  );
}
