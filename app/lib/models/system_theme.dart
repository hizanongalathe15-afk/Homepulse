import 'package:flutter/material.dart';

class SystemThemeConfig {
  final Map<String, String> colors;
  final Map<String, dynamic>? typography;
  final Map<String, dynamic>? borderRadius;
  final Map<String, dynamic>? spacing;
  final String? name;
  final DateTime? updatedAt;
  final DateTime? createdAt;
  final String? updatedBy;

  SystemThemeConfig({
    required this.colors,
    this.typography,
    this.borderRadius,
    this.spacing,
    this.name,
    this.updatedAt,
    this.createdAt,
    this.updatedBy,
  });

  factory SystemThemeConfig.fromJson(Map<String, dynamic> json) {
    final colorMap = <String, String>{};
    final rawColors = json['colors'] as Map<String, dynamic>? ?? {};
    for (final entry in rawColors.entries) {
      colorMap[entry.key] = entry.value as String;
    }

    return SystemThemeConfig(
      colors: colorMap,
      typography: json['typography'] as Map<String, dynamic>?,
      borderRadius: json['borderRadius'] as Map<String, dynamic>?,
      spacing: json['spacing'] as Map<String, dynamic>?,
      name: json['name'] as String?,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : null,
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : null,
      updatedBy: json['updatedBy']?['id'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    final colorJson = <String, String>{};
    for (final entry in colors.entries) {
      colorJson[entry.key] = entry.value;
    }

    return {
      'colors': colorJson,
      if (typography != null) 'typography': typography,
      if (borderRadius != null) 'borderRadius': borderRadius,
      if (spacing != null) 'spacing': spacing,
      if (name != null) 'name': name,
      if (createdAt != null) 'createdAt': createdAt!.toIso8601String(),
      if (updatedAt != null) 'updatedAt': updatedAt!.toIso8601String(),
    };
  }

  SystemThemeConfig copyWith({
    Map<String, String>? colors,
    Map<String, dynamic>? typography,
    Map<String, dynamic>? borderRadius,
    Map<String, dynamic>? spacing,
    String? name,
    DateTime? updatedAt,
    DateTime? createdAt,
    String? updatedBy,
  }) {
    return SystemThemeConfig(
      colors: colors ?? this.colors,
      typography: typography ?? this.typography,
      borderRadius: borderRadius ?? this.borderRadius,
      spacing: spacing ?? this.spacing,
      name: name ?? this.name,
      updatedAt: updatedAt ?? this.updatedAt,
      createdAt: createdAt ?? this.createdAt,
      updatedBy: updatedBy ?? this.updatedBy,
    );
  }
}

Color hexToColor(String hex) {
  final buffer = StringBuffer();
  if (hex.length == 6 || hex.length == 7) {
    buffer.write('ff');
  }
  buffer.write(hex.replaceFirst('#', ''));
  return Color(int.parse(buffer.toString(), radix: 16));
}

String colorToHex(Color color) {
  return '#${color.value.toRadixString(16).padLeft(8, '0').substring(2)}';
}
