import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:homepulse/widgets/color_picker_field.dart';

class ColorMixCanvas extends StatefulWidget {
  final Color colorA;
  final Color colorB;
  final ValueChanged<Color> onMixSelected;

  const ColorMixCanvas({
    super.key,
    required this.colorA,
    required this.colorB,
    required this.onMixSelected,
  });

  @override
  State<ColorMixCanvas> createState() => _ColorMixCanvasState();
}

class _ColorMixCanvasState extends State<ColorMixCanvas> with SingleTickerProviderStateMixin {
  double _zoom = 1.0;
  double _panX = 0.5;
  late Color _colorA;
  late Color _colorB;
  Offset _dragPosition = Offset.zero;
  bool _isDragging = false;

  @override
  void initState() {
    super.initState();
    _colorA = widget.colorA;
    _colorB = widget.colorB;
  }

  @override
  void didUpdateWidget(covariant ColorMixCanvas oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.colorA != widget.colorA) _colorA = widget.colorA;
    if (oldWidget.colorB != widget.colorB) _colorB = widget.colorB;
  }

  Color _mixAt(double t) {
    return Color.lerp(_colorA, _colorB, t.clamp(0.0, 1.0))!;
  }

  void _pickColorA() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Pick Color A', style: TextStyle(fontSize: 18)),
        content: SizedBox(
          width: 320,
          height: 420,
          child: ColorPickerDialog(
            initialColor: _colorA,
            showAlpha: false,
            onColorChanged: (color) {
              setState(() => _colorA = color);
              Navigator.pop(ctx);
            },
          ),
        ),
      ),
    );
  }

  void _pickColorB() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Pick Color B', style: TextStyle(fontSize: 18)),
        content: SizedBox(
          width: 320,
          height: 420,
          child: ColorPickerDialog(
            initialColor: _colorB,
            showAlpha: false,
            onColorChanged: (color) {
              setState(() => _colorB = color);
              Navigator.pop(ctx);
            },
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final mixedColor = _mixAt(_panX);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Color Mixer', style: theme.textTheme.titleMedium),
        Text(
          'Drag along the gradient below. Pinch to zoom into the color spectrum.',
          style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            _colorWell(_colorA, 'Color A', _pickColorA),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                children: [
                  Container(
                    width: double.infinity,
                    height: 120,
                    decoration: BoxDecoration(
                      color: mixedColor,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: theme.dividerColor, width: 2),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.15),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Center(
                      child: Text(
                        '#${mixedColor.value.toRadixString(16).padLeft(8, '0').substring(2).toUpperCase()}',
                        style: TextStyle(
                          color: mixedColor.computeLuminance() > 0.5 ? Colors.black87 : Colors.white,
                          fontWeight: FontWeight.w700,
                          fontFamily: 'monospace',
                          fontSize: 16,
                          shadows: [
                            Shadow(
                              color: Colors.black.withOpacity(0.3),
                              blurRadius: 2,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Drag to mix | Pinch to zoom (x${_zoom.toStringAsFixed(1)})',
                    style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 16),
            _colorWell(_colorB, 'Color B', _pickColorB),
          ],
        ),
        const SizedBox(height: 24),
        Expanded(
          child: MouseRegion(
            cursor: _isDragging ? SystemMouseCursors.grabbing : SystemMouseCursors.click,
            child: GestureDetector(
              onPanStart: (details) {
                setState(() => _isDragging = true);
                _handlePan(details.localPosition);
              },
              onPanUpdate: (details) {
                _handlePan(details.localPosition);
              },
              onPanEnd: (_) {
                setState(() {
                  _isDragging = false;
                });
                widget.onMixSelected(_mixAt(_panX));
              },
              child: Listener(
                onPointerSignal: (event) {
                  if (event is PointerScrollEvent) {
                    final delta = event.scrollDelta;
                    final zoomChange = delta.direction < 0 ? 1.1 : 0.9;
                    setState(() {
                      _zoom = (_zoom * zoomChange).clamp(1.0, 5.0);
                    });
                  }
                },
                child: CustomPaint(
                  painter: _MixCanvasPainter(
                    colorA: _colorA,
                    colorB: _colorB,
                    zoom: _zoom,
                    panX: _panX,
                  ),
                  size: const Size(double.infinity, double.infinity),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  void _handlePan(Offset localPosition) {
    final box = context.findRenderObject() as RenderBox?;
    if (box == null) return;
    final size = box.size;
    final width = size.width - 32;
    final x = (localPosition.dx - 16) / width;
    setState(() {
      _panX = x.clamp(0.0, 1.0);
    });
  }

  Widget _colorWell(Color color, String label, VoidCallback onTap) {
    return Column(
      children: [
        GestureDetector(
          onTap: onTap,
          child: Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Theme.of(context).dividerColor, width: 2),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.15),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(label, style: Theme.of(context).textTheme.bodySmall),
      ],
    );
  }
}

class _MixCanvasPainter extends CustomPainter {
  final Color colorA;
  final Color colorB;
  final double zoom;
  final double panX;

  const _MixCanvasPainter({
    required this.colorA,
    required this.colorB,
    required this.zoom,
    required this.panX,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..shader = LinearGradient(
        colors: [colorA, colorB],
        tileMode: TileMode.mirror,
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    final strokeWidth = 3.0 / zoom;
    final dotSize = 20.0 / zoom;
    final labelHeight = 40.0;

    canvas.drawRect(Offset(0, labelHeight) & Size(size.width, size.height - labelHeight), paint);

    final gradientRect = Rect.fromLTWH(0, labelHeight, size.width, size.height - labelHeight);
    final clipped = Canvas(
      paint,
      gradientRect.deflate(8),
    );

    final highlightPaint = Paint()
      ..color = Colors.white.withOpacity(0.3)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 12);
    final cx = panX * size.width;
    canvas.drawCircle(
      Offset(cx, labelHeight + (size.height - labelHeight) / 2),
      40 / zoom,
      highlightPaint,
    );

    final indicatorX = cx;
    final indicatorY = labelHeight + (size.height - labelHeight) / 2;
    final indicatorPaint = Paint()
      ..color = Colors.white
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;
    canvas.drawCircle(
      Offset(indicatorX, indicatorY),
      dotSize,
      indicatorPaint,
    );

    canvas.drawLine(
      Offset(indicatorX - dotSize * 1.5, indicatorY),
      Offset(indicatorX + dotSize * 1.5, indicatorY),
      indicatorPaint,
    );
    canvas.drawLine(
      Offset(indicatorX, indicatorY - dotSize * 1.5),
      Offset(indicatorX, indicatorY + dotSize * 1.5),
      indicatorPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _MixCanvasPainter old) {
    return old.colorA != colorA ||
        old.colorB != colorB ||
        old.zoom != zoom ||
        old.panX != panX;
  }
}
