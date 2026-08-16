import 'dart:async';
import 'package:flutter/material.dart';

class BannerDisplay extends StatefulWidget {
  final List<Widget> items;
  final Duration autoPlayInterval;
  final bool autoPlay;
  final ValueChanged<int>? onPageChanged;
  final PageController? pageController;
  final bool showIndicators;
  final Color indicatorColor;
  final Color activeIndicatorColor;
  final double indicatorSize;
  final EdgeInsetsGeometry padding;

  const BannerDisplay({
    super.key,
    required this.items,
    this.autoPlayInterval = const Duration(seconds: 4),
    this.autoPlay = true,
    this.onPageChanged,
    this.pageController,
    this.showIndicators = true,
    this.indicatorColor = Colors.white24,
    this.activeIndicatorColor = Colors.white,
    this.indicatorSize = 8.0,
    this.padding = EdgeInsets.zero,
  });

  @override
  State<BannerDisplay> createState() => _BannerDisplayState();
}

class _BannerDisplayState extends State<BannerDisplay> {
  late PageController _pageController;
  int _currentPage = 0;
  Timer? _autoPlayTimer;

  @override
  void initState() {
    super.initState();
    _pageController = widget.pageController ??
        PageController(initialPage: 0, viewportFraction: 1.0);
    if (widget.autoPlay && widget.items.length > 1) {
      _startAutoPlay();
    }
  }

  @override
  void didUpdateWidget(BannerDisplay oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.autoPlay != widget.autoPlay || oldWidget.items.length != widget.items.length) {
      if (widget.autoPlay && widget.items.length > 1) {
        _startAutoPlay();
      } else {
        _stopAutoPlay();
      }
    }
  }

  @override
  void dispose() {
    _stopAutoPlay();
    if (widget.pageController == null) {
      _pageController.dispose();
    }
    super.dispose();
  }

  void _startAutoPlay() {
    _stopAutoPlay();
    _autoPlayTimer = Timer.periodic(widget.autoPlayInterval, (timer) {
      if (_pageController.hasClients) {
        final nextPage = (_currentPage + 1) % widget.items.length;
        _pageController.animateToPage(
          nextPage,
          duration: const Duration(milliseconds: 400),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  void _stopAutoPlay() {
    _autoPlayTimer?.cancel();
    _autoPlayTimer = null;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Semantics(
      label: 'Promotional banner carousel',
      child: Stack(
        children: [
          PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() {
                _currentPage = index;
              });
              widget.onPageChanged?.call(index);
              if (widget.autoPlay) {
                _startAutoPlay();
              }
            },
            itemCount: widget.items.length,
            itemBuilder: (context, index) {
              return Padding(
                padding: widget.padding,
                child: widget.items[index],
              );
            },
          ),
          if (widget.showIndicators && widget.items.length > 1)
            Positioned(
              bottom: 16,
              left: 0,
              right: 0,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(widget.items.length, (index) {
                  return AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    width: _currentPage == index ? 24 : widget.indicatorSize,
                    height: widget.indicatorSize,
                    decoration: BoxDecoration(
                      color: _currentPage == index
                          ? widget.activeIndicatorColor
                          : widget.indicatorColor,
                      borderRadius: BorderRadius.circular(widget.indicatorSize),
                    ),
                  );
                }),
              ),
            ),
        ],
      ),
    );
  }
}
