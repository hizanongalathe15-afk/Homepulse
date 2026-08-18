import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/models/system_theme.dart';
import 'package:homepulse/state/system_theme_provider.dart';
import 'package:homepulse/widgets/app_toast.dart';
import 'package:homepulse/widgets/color_mix_canvas.dart';
import 'package:homepulse/widgets/color_picker_field.dart';
import 'package:homepulse/widgets/loading_spinner.dart';

class ThemeEditorScreen extends ConsumerStatefulWidget {
  const ThemeEditorScreen({super.key});

  @override
  ConsumerState<ThemeEditorScreen> createState() => _ThemeEditorScreenState();
}

class _ThemeEditorScreenState extends ConsumerState<ThemeEditorScreen>
    with SingleTickerProviderStateMixin {
  SystemThemeConfig? _workingConfig;
  bool _hasChanges = false;
  bool _isSaving = false;
  late TabController _tabController;
  Color _colorA = const Color(0xFF1A5276);
  Color _colorB = const Color(0xFF2E86C1);
  String _mixedColorKey = 'primary';

  final List<String> _colorKeys = [
    'primary',
    'primaryLight',
    'primaryDark',
    'secondary',
    'secondaryLight',
    'secondaryDark',
    'tertiary',
    'tertiaryLight',
    'tertiaryDark',
    'background',
    'surface',
    'surfaceVariant',
    'error',
    'onPrimary',
    'onSecondary',
    'onBackground',
    'onSurface',
    'onError',
    'textPrimary',
    'textSecondary',
    'textTertiary',
    'divider',
    'success',
    'warning',
    'info',
  ];

  final Map<String, String> _colorLabels = {
    'primary': 'Primary',
    'primaryLight': 'Primary Light',
    'primaryDark': 'Primary Dark',
    'secondary': 'Secondary',
    'secondaryLight': 'Secondary Light',
    'secondaryDark': 'Secondary Dark',
    'tertiary': 'Tertiary',
    'tertiaryLight': 'Tertiary Light',
    'tertiaryDark': 'Tertiary Dark',
    'background': 'Background',
    'surface': 'Surface',
    'surfaceVariant': 'Surface Variant',
    'error': 'Error',
    'onPrimary': 'On Primary',
    'onSecondary': 'On Secondary',
    'onBackground': 'On Background',
    'onSurface': 'On Surface',
    'onError': 'On Error',
    'textPrimary': 'Text Primary',
    'textSecondary': 'Text Secondary',
    'textTertiary': 'Text Tertiary',
    'divider': 'Divider',
    'success': 'Success',
    'warning': 'Warning',
    'info': 'Info',
  };

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _updateColor(String key, Color color) {
    final hex = colorToHex(color);
    setState(() {
      _workingConfig?.colors[key] = hex;
      _hasChanges = true;
    });
  }

  Future<void> _saveTheme() async {
    setState(() => _isSaving = true);
    try {
      final config = _workingConfig;
      if (config == null) return;
      await ref.read(systemThemeProvider.notifier).saveTheme(config);
      AppToast.success(context, 'Theme saved and broadcast to all devices');
      setState(() {
        _hasChanges = false;
        _isSaving = false;
      });
    } catch (e) {
      setState(() => _isSaving = false);
      AppToast.error(context, 'Failed to save theme: $e');
    }
  }

  Future<void> _resetTheme() async {
    final confirmed = await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Reset Theme'),
            content: const Text('Are you sure you want to reset to the default theme?'),
            actions: [
              TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
              TextButton(
                onPressed: () => Navigator.pop(ctx, true),
                style: TextButton.styleFrom(foregroundColor: AppColors.error),
                child: const Text('Reset'),
              ),
            ],
          ),
        ) ??
        false;

    if (!confirmed) return;

    setState(() => _isSaving = true);
    try {
      final reset = await ref.read(systemThemeProvider.notifier).resetTheme();
      setState(() {
        _workingConfig = reset;
        _hasChanges = false;
        _isSaving = false;
      });
      AppToast.success(context, 'Theme reset to defaults');
    } catch (e) {
      setState(() => _isSaving = false);
      AppToast.error(context, 'Failed to reset theme: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final themeAsync = ref.watch(systemThemeProvider);
    final isAdmin = ref.watch(isCurrentUserAdminProvider);

    if (!isAdmin) {
      return Scaffold(
        appBar: AppBar(title: const Text('Theme Editor')),
        body: const Center(
          child: Padding(
            padding: EdgeInsets.all(24),
            child: Text(
              'Access denied. This page is only available to administrators.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
          ),
        ),
      );
    }

    if (themeAsync.isLoading && _workingConfig?.colors.isEmpty != false) {
      return const Scaffold(
        body: Center(child: LoadingSpinner()),
      );
    }

    _workingConfig ??= themeAsync.valueOrNull ??
        SystemThemeConfig(colors: {});
    if (_workingConfig!.colors.isEmpty) {
      _workingConfig = themeAsync.valueOrNull ?? SystemThemeConfig(colors: {});
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Theme Editor'),
        actions: [
          if (_hasChanges)
            IconButton(
              onPressed: _isSaving ? null : _saveTheme,
              icon: _isSaving
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.save),
              tooltip: 'Save (Ctrl+S)',
            ),
          IconButton(
            onPressed: _isSaving ? null : _resetTheme,
            icon: const Icon(Icons.refresh),
            tooltip: 'Reset',
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Color Palette', icon: Icon(Icons.palette)),
            Tab(text: 'Color Mixer', icon: Icon(Icons.shuffle_rounded)),
            Tab(text: 'Live Preview', icon: Icon(Icons.preview)),
          ],
        ),
      ),
      body: themeAsync.when(
        data: (_) => _buildBody(context, theme, themeAsync.valueOrNull),
        loading: () => _buildBody(context, theme, themeAsync.valueOrNull),
        error: (e, _) => Center(child: Text('Error: $e')),
      ),
    );
  }

  Widget _buildBody(BuildContext context, ThemeData theme, SystemThemeConfig? serverConfig) {
    return TabBarView(
      controller: _tabController,
      children: [
        _buildColorPalette(context, theme),
        _buildColorMixer(context, theme),
        _buildLivePreview(context, theme),
      ],
    );
  }

  Widget _buildColorPalette(BuildContext context, ThemeData theme) {
    final config = _workingConfig;
    if (config == null) {
      return const Center(child: Text('Loading...'));
    }
    final nameController = TextEditingController(text: config.name ?? 'Default');

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'System Colors',
            style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 16,
            runSpacing: 20,
            children: _colorKeys.map((key) {
              final hex = config.colors[key] ?? '#FFFFFF';
              final color = hexToColor(hex);
              return SizedBox(
                width: 150,
                child: ColorPickerField(
                  label: _colorLabels[key] ?? key,
                  colorKey: key,
                  initialColor: color,
                  onColorChanged: (c) => _updateColor(key, c),
                  showAlpha: key.toLowerCase().contains('on') || key.toLowerCase().contains('text') || key.toLowerCase().contains('divider'),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),
          Text(
            'Theme Info',
            style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: 'Theme Name',
                    border: OutlineInputBorder(),
                    isDense: true,
                  ),
                  onChanged: (val) {
                    setState(() {
                      _workingConfig = config.copyWith(name: val);
                      _hasChanges = true;
                    });
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildColorMixer(BuildContext context, ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Expanded(
                child: DropdownButtonFormField<String>(
                  value: _mixedColorKey,
                  decoration: const InputDecoration(
                    labelText: 'Apply mix to',
                    border: OutlineInputBorder(),
                    isDense: true,
                  ),
                  items: _colorKeys.map((key) {
                    return DropdownMenuItem(
                      value: key,
                      child: Text(_colorLabels[key] ?? key),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _mixedColorKey = val);
                  },
                ),
              ),
              const SizedBox(width: 16),
              SizedBox(
                height: 48,
                child: FilledButton.icon(
                  onPressed: () {
                    final hex = colorToHex(
                      Color.lerp(_colorA, _colorB, 0.5)!,
                    );
                    _updateColor(_mixedColorKey, hexToColor(hex));
                  },
                  icon: const Icon(Icons.add),
                  label: const Text('Apply 50/50'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Expanded(
            child: ColorMixCanvas(
              colorA: _colorA,
              colorB: _colorB,
              onMixSelected: (color) {
                final hex = colorToHex(color);
                _updateColor(_mixedColorKey, color);
                setState(() {
                  _colorA = color;
                  _colorB = color;
                });
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLivePreview(BuildContext context, ThemeData theme) {
    final config = _workingConfig!;

    final previewTheme = ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: hexToColor(config.colors['primary'] ?? '#1A5276'),
        brightness: Brightness.light,
        primary: hexToColor(config.colors['primary'] ?? '#1A5276'),
        onPrimary: hexToColor(config.colors['onPrimary'] ?? '#FFFFFF'),
        secondary: hexToColor(config.colors['secondary'] ?? '#2E86C1'),
        tertiary: hexToColor(config.colors['tertiary'] ?? '#F39C12'),
        error: hexToColor(config.colors['error'] ?? '#E53935'),
        background: hexToColor(config.colors['background'] ?? '#FAFAFA'),
        surface: hexToColor(config.colors['surface'] ?? '#FFFFFF'),
        onSurface: hexToColor(config.colors['onSurface'] ?? '#1A1A1A'),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor:
            hexToColor(config.colors['primary'] ?? '#1A5276').withOpacity(0.85),
        foregroundColor: hexToColor(config.colors['onPrimary'] ?? '#FFFFFF'),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: hexToColor(config.colors['primary'] ?? '#1A5276'),
          foregroundColor: hexToColor(config.colors['onPrimary'] ?? '#FFFFFF'),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: hexToColor(config.colors['secondary'] ?? '#2E86C1'),
        foregroundColor: hexToColor(config.colors['onSecondary'] ?? '#FFFFFF'),
      ),
      scaffoldBackgroundColor:
          hexToColor(config.colors['background'] ?? '#FAFAFA'),
    );

    return Theme(
      data: previewTheme,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Preview'),
          actions: [
            IconButton(icon: const Icon(Icons.favorite), onPressed: () {}),
            IconButton(icon: const Icon(Icons.settings), onPressed: () {}),
          ],
        ),
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Dashboard', style: Theme.of(context).textTheme.headlineSmall),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 12,
                      runSpacing: 12,
                      children: [
                        Chip(label: const Text('Property 1')),
                        Chip(
                          label: const Text('Property 2'),
                          backgroundColor: Colors.grey.shade300,
                        ),
                        Chip(label: const Text('Urgent'), backgroundColor: Colors.red.shade100),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: ListTile(
                leading: CircleAvatar(backgroundColor: Theme.of(context).colorScheme.primary),
                title: const Text('Property Listing'),
                subtitle: Text('Modern apartment in the city center'),
                trailing: Chip(
                  label: const Text('NEW'),
                  backgroundColor: Theme.of(context).colorScheme.tertiary.withOpacity(0.15),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {},
                    child: const Text('Primary Action'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {},
                    child: const Text('Secondary'),
                  ),
                ),
              ],
            ),
          ],
        ),
        floatingActionButton: FloatingActionButton.extended(
          onPressed: () {},
          icon: const Icon(Icons.add),
          label: const Text('Floating Action'),
        ),
      ),
    );
  }
}
