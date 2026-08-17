import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../../core/theme/app_colors.dart';
import '../../widgets/app_toast.dart';

class ChatMediaPicker extends StatelessWidget {
  final Function(String type, dynamic data)? onPicked;

  const ChatMediaPicker({
    super.key,
    this.onPicked,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Attach', style: theme.textTheme.titleMedium),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _MediaOption(
                  icon: Icons.camera_alt_outlined,
                  label: 'Camera',
                  color: AppColors.primary,
                  onTap: () {
                    Navigator.pop(context);
                    _pickCamera(context);
                  },
                ),
                _MediaOption(
                  icon: Icons.photo_library_outlined,
                  label: 'Gallery',
                  color: AppColors.secondary,
                  onTap: () {
                    Navigator.pop(context);
                    _pickGallery(context);
                  },
                ),
                _MediaOption(
                  icon: Icons.location_on_outlined,
                  label: 'Location',
                  color: AppColors.error,
                  onTap: () {
                    Navigator.pop(context);
                    onPicked?.call('location', null);
                  },
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _MediaOption(
                  icon: Icons.emoji_emotions_outlined,
                  label: 'Stickers',
                  color: AppColors.warning,
                  onTap: () {
                    Navigator.pop(context);
                    onPicked?.call('sticker', null);
                  },
                ),
                _MediaOption(
                  icon: Icons.insert_drive_file_outlined,
                  label: 'File',
                  color: AppColors.info,
                  onTap: () {
                    Navigator.pop(context);
                    onPicked?.call('file', null);
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _pickCamera(BuildContext context) async {
    try {
      final ImagePicker picker = ImagePicker();
      final XFile? photo = await picker.pickImage(source: ImageSource.camera);
      if (photo != null) {
        onPicked?.call('camera', photo);
      }
    } on Exception catch (_) {
      AppToast.show(context, 'Failed to open camera');
    }
  }

  Future<void> _pickGallery(BuildContext context) async {
    try {
      final ImagePicker picker = ImagePicker();
      final XFile? image = await picker.pickImage(source: ImageSource.gallery);
      if (image != null) {
        onPicked?.call('gallery', image);
      }
    } on Exception catch (_) {
      AppToast.show(context, 'Failed to open gallery');
    }
  }
}

class _MediaOption extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _MediaOption({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 26),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
