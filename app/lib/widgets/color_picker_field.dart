import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ColorPickerField extends ConsumerStatefulWidget {
  final String label;
  final String colorKey;
  final Color initialColor;
  final ValueChanged<Color> onColorChanged;
  final bool showAlpha;

  const ColorPickerField({
    super.key,
    required this.label,
    required this.colorKey,
    required this.initialColor,
    required this.onColorChanged,
    this.showAlpha = true,
  });

  @override
  ConsumerState<ColorPickerField> createState() => _ColorPickerFieldState();
}

class _ColorPickerFieldState extends ConsumerState<ColorPickerField> {
  late Color _currentColor;
  late TextEditingController _hexController;

  @override
  void initState() {
    super.initState();
    _currentColor = widget.initialColor;
    _hexController = TextEditingController(text: _colorToHex(widget.initialColor));
  }

  String _colorToHex(Color color) {
    return '#${color.value.toRadixString(16).padLeft(8, '0').substring(2)}';
  }

  @override
  void didUpdateWidget(covariant ColorPickerField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.initialColor != widget.initialColor) {
      _currentColor = widget.initialColor;
      _hexController.text = _colorToHex(widget.initialColor);
    }
  }

  void _pickColor() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(widget.label, style: const TextStyle(fontSize: 18)),
        content: SizedBox(
          width: 320,
          height: 420,
          child: ColorPickerDialog(
            initialColor: _currentColor,
            showAlpha: widget.showAlpha,
            onColorChanged: (color) {
              setState(() {
                _currentColor = color;
                _hexController.text = _colorToHex(color);
              });
              widget.onColorChanged(color);
            },
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(widget.label, style: theme.textTheme.labelMedium),
        const SizedBox(height: 8),
        Row(
          children: [
            GestureDetector(
              onTap: _pickColor,
              child: Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: _currentColor,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Theme.of(context).dividerColor, width: 1),
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
            const SizedBox(width: 12),
            Expanded(
              child: TextField(
                controller: _hexController,
                inputFormatters: [
                  LengthLimitingTextInputFormatter(7),
                  _HexInputFormatter(),
                ],
                decoration: InputDecoration(
                  hintText: '#000000',
                  hintStyle: TextStyle(color: theme.hintColor),
                  isDense: true,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                ),
                style: const TextStyle(fontFamily: 'monospace', fontSize: 14),
                onChanged: (val) {
                  final hex = val.startsWith('#') ? val : '#$val';
                  final parsed = _parseHex(hex);
                  if (parsed != null && parsed != _currentColor) {
                    setState(() => _currentColor = parsed);
                    widget.onColorChanged(parsed);
                  }
                },
                onSubmitted: (val) {
                  final hex = val.startsWith('#') ? val : '#$val';
                  final parsed = _parseHex(hex);
                  if (parsed != null) {
                    setState(() => _currentColor = parsed);
                    widget.onColorChanged(parsed);
                  }
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Color? _parseHex(String hex) {
    final cleaned = hex.replaceAll('#', '');
    if (cleaned.length == 6) {
      return Color(int.parse('ff$cleaned', radix: 16));
    }
    if (cleaned.length == 8) {
      return Color(int.parse(cleaned, radix: 16));
    }
    return null;
  }
}

class _HexInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(TextEditingValue oldValue, TextEditingValue newValue) {
    final text = newValue.text;
    if (text.isEmpty) return newValue;
    if (text.length > 7) return oldValue;
    final hexRegex = RegExp(r'^#?[0-9a-fA-F]*$');
    if (!hexRegex.hasMatch(text)) return oldValue;
    return newValue;
  }
}

class ColorPickerDialog extends StatefulWidget {
  final Color initialColor;
  final bool showAlpha;
  final ValueChanged<Color> onColorChanged;

  const ColorPickerDialog({
    super.key,
    required this.initialColor,
    required this.showAlpha,
    required this.onColorChanged,
  });

  @override
  State<ColorPickerDialog> createState() => _ColorPickerDialogState();
}

class _ColorPickerDialogState extends State<ColorPickerDialog> {
  late double _hue;
  late double _saturation;
  late double _value;
  double _alpha = 1.0;

  @override
  void initState() {
    super.initState();
    final hsv = HSVColor.fromColor(widget.initialColor);
    _hue = hsv.hue;
    _saturation = hsv.saturation;
    _value = hsv.value;
    _alpha = widget.initialColor.alpha.toDouble() / 255;
  }

  @override
  Widget build(BuildContext context) {
    final currentColor = HSVColor.fromAHSV(_alpha, _hue, _saturation, _value).toColor();
    return Column(
      children: [
        Expanded(
          child: SatValPanel(
            hue: _hue,
            saturation: _saturation,
            value: _value,
            onSatValChanged: (s, v) {
              setState(() {
                _saturation = s;
                _value = v;
              });
              widget.onColorChanged(HSVColor.fromAHSV(_alpha, _hue, _saturation, _value).toColor());
            },
          ),
        ),
        const SizedBox(height: 16),
        HueSlider(
          hue: _hue,
          onChanged: (h) {
            setState(() => _hue = h);
            widget.onColorChanged(HSVColor.fromAHSV(_alpha, _hue, _saturation, _value).toColor());
          },
        ),
        if (widget.showAlpha) ...[
          const SizedBox(height: 16),
          AlphaSlider(
            alpha: _alpha,
            color: currentColor,
            onChanged: (a) {
              setState(() => _alpha = a);
              widget.onColorChanged(HSVColor.fromAHSV(_alpha, _hue, _saturation, _value).toColor());
            },
          ),
        ],
        const SizedBox(height: 12),
        Container(
          width: double.infinity,
          height: 44,
          decoration: BoxDecoration(
            color: currentColor,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Theme.of(context).dividerColor),
          ),
          child: Center(
            child: Text(
              '#${currentColor.value.toRadixString(16).padLeft(8, '0').substring(2)}',
              style: TextStyle(
                color: (currentColor.computeLuminance() > 0.5) ? Colors.black87 : Colors.white,
                fontFamily: 'monospace',
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class SatValPanel extends StatelessWidget {
  final double hue;
  final double saturation;
  final double value;
  final void Function(double s, double v) onSatValChanged;

  const SatValPanel({
    super.key,
    required this.hue,
    required this.saturation,
    required this.value,
    required this.onSatValChanged,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        const dotSize = 18.0;
        final cx = saturation * (constraints.maxWidth - dotSize) + dotSize / 2;
        final cy = (1 - value) * (constraints.maxHeight - dotSize) + dotSize / 2;
        return GestureDetector(
          onPanStart: (details) => _update(details.localPosition, constraints),
          onPanUpdate: (details) => _update(details.localPosition, constraints),
          child: CustomPaint(
            painter: _SatValPainter(hue: hue),
            child: Stack(
              children: [
                Positioned(
                  left: cx,
                  top: cy,
                  child: _cursor(),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _cursor() {
    return Container(
      width: 18,
      height: 18,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Colors.transparent,
        border: Border.all(color: Colors.white, width: 2),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.5), blurRadius: 2, spreadRadius: 1),
        ],
      ),
    );
  }

  void _update(Offset pos, BoxConstraints constraints) {
    final s = (pos.dx / constraints.maxWidth).clamp(0.0, 1.0);
    final v = 1 - (pos.dy / constraints.maxHeight).clamp(0.0, 1.0);
    onSatValChanged(s, v);
  }
}

class _SatValPainter extends CustomPainter {
  final double hue;

  const _SatValPainter({required this.hue});

  @override
  void paint(Canvas canvas, Size size) {
    final hueColor = HSVColor.fromAHSV(1, hue, 1, 1).toColor();

    final satGradient = Paint()
      ..shader = const LinearGradient(
        colors: [Colors.white, Colors.black],
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    final bg = Paint()..color = hueColor;
    canvas.drawRect(Offset.zero & size, bg);

    final paint = Paint()
      ..shader = const LinearGradient(
        colors: [Colors.white, Colors.transparent],
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawRect(Offset.zero & size, paint);

    final valPaint = Paint()
      ..shader = const LinearGradient(
        colors: [Colors.transparent, Colors.black],
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawRect(Offset.zero & size, valPaint);
  }

  @override
  bool shouldRepaint(covariant _SatValPainter old) => old.hue != hue;
}

class HueSlider extends StatelessWidget {
  final double hue;
  final ValueChanged<double> onChanged;

  const HueSlider({super.key, required this.hue, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 32,
      child: GestureDetector(
        onPanStart: (details) => _update(details.localPosition),
        onPanUpdate: (details) => _update(details.localPosition),
        child: CustomPaint(
          painter: _HueSliderPainter(),
          child: Align(
            alignment: Alignment(hue / 360 * 2 - 1, 0),
            child: Container(
              width: 16,
              height: 32,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: Colors.black26, width: 1),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.3), blurRadius: 2, offset: const Offset(0, 1))],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _update(Offset pos) {
    final h = (pos.dx / 200).clamp(0.0, 1.0) * 360;
    onChanged(h);
  }
}

class _HueSliderPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..shader = const LinearGradient(
        colors: [
          Color(0xFFFF0000),
          Color(0xFFFF8800),
          Color(0xFFFFff00),
          Color(0xFF00FF00),
          Color(0xFF0088FF),
          Color(0xFF0000FF),
          Color(0xFF8800FF),
          Color(0xFFFF00FF),
          Color(0xFFFF0000),
        ],
        tileMode: TileMode.clamp,
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawRRect(
      RRect.fromRectAndRadius(Offset.zero & size, Radius.circular(4)),
      paint,
    );
  }

  @override
  bool shouldRepaint(covariant _HueSliderPainter old) => false;
}

class AlphaSlider extends StatelessWidget {
  final double alpha;
  final Color color;
  final ValueChanged<double> onChanged;

  const AlphaSlider({super.key, required this.alpha, required this.color, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 24,
      child: GestureDetector(
        onPanStart: (details) => _update(details.localPosition),
        onPanUpdate: (details) => _update(details.localPosition),
        child: CustomPaint(
          painter: _AlphaSliderPainter(),
          child: Align(
            alignment: Alignment(alpha * 2 - 1, 0),
            child: Container(
              width: 12,
              height: 24,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: Colors.black26, width: 1),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.3), blurRadius: 2, offset: const Offset(0, 1))],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _update(Offset pos) {
    final a = (pos.dx / 200).clamp(0.0, 1.0);
    onChanged(a);
  }
}

class _AlphaSliderPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    const blockSize = 8.0;
    final paint = Paint()..color = Colors.grey.shade300;
    for (double i = 0; i < size.width; i += blockSize * 2) {
      for (double j = 0; j < size.height; j += blockSize * 2) {
        canvas.drawRect(
          Offset(i, j) & Size(blockSize, blockSize),
          paint,
        );
      }
    }

    final paint2 = Paint()..color = Colors.grey.shade400;
    for (double i = blockSize; i < size.width; i += blockSize * 2) {
      for (double j = 0; j < size.height; j += blockSize * 2) {
        canvas.drawRect(
          Offset(i, j) & Size(blockSize, blockSize),
          paint2,
        );
      }
    }
  }

  @override
  bool shouldRepaint(covariant _AlphaSliderPainter old) => false;
}
