import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';

class QRCodeDisplay extends StatelessWidget {
  final String data;
  final double size;
  final Color backgroundColor;
  final Color foregroundColor;
  final int errorCorrectionLevel;
  final String? semanticLabel;

  const QRCodeDisplay({
    super.key,
    required this.data,
    this.size = 200.0,
    this.backgroundColor = Colors.white,
    this.foregroundColor = Colors.black,
    this.errorCorrectionLevel = QrErrorCorrectLevel.M,
    this.semanticLabel,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final effectiveBackgroundColor = backgroundColor;
    final effectiveForegroundColor = foregroundColor;

    return Semantics(
      label: semanticLabel ?? 'QR code for $data',
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: effectiveBackgroundColor,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: theme.colorScheme.shadow.withOpacity(0.1),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: QrImageView(
          data: data,
          version: QrVersions.auto,
          size: size,
          errorCorrectionLevel: errorCorrectionLevel,
          foregroundColor: effectiveForegroundColor,
          backgroundColor: effectiveBackgroundColor,
        ),
      ),
    );
  }
}
