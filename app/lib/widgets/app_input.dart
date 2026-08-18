import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter/services.dart';

class AppInput extends StatefulWidget {
  final TextEditingController? controller;
  final String? hintText;
  final String? label;
  final String? labelText;
  final String? errorText;
  final String? helperText;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final bool isPassword;
  final bool isObscure;
  final VoidCallback? onToggleObscure;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final String? Function(String?)? validator;
  final void Function(String)? onChanged;
  final void Function(String)? onSubmitted;
  final bool enabled;
  final int? maxLines;
  final int? maxLength;
  final String? initialValue;
  final FocusNode? focusNode;
  final String? semanticLabel;
  final bool autofocus;
  final bool isMultiline;
  final TextAlign? textAlign;

  const AppInput({
    super.key,
    this.controller,
    this.hintText,
    this.label,
    this.labelText,
    this.errorText,
    this.helperText,
    this.prefixIcon,
    this.suffixIcon,
    this.isPassword = false,
    this.isObscure = false,
    this.onToggleObscure,
    this.keyboardType,
    this.textInputAction,
    this.validator,
    this.onChanged,
    this.onSubmitted,
    this.enabled = true,
    this.maxLines = 1,
    this.maxLength,
    this.initialValue,
    this.focusNode,
    this.semanticLabel,
    this.autofocus = false,
    this.isMultiline = false,
    this.textAlign,
  });

  @override
  State<AppInput> createState() => _AppInputState();
}

class _AppInputState extends State<AppInput> {
  bool _obscureText = false;
  bool _hasFocus = false;

  @override
  void initState() {
    super.initState();
    _obscureText = widget.isObscure;
  }

  @override
  void didUpdateWidget(AppInput oldWidget) {
    super.didUpdateWidget(oldWidget);
    _obscureText = widget.isObscure;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    final effectiveErrorText = widget.errorText;
    final hasError = effectiveErrorText != null && effectiveErrorText.isNotEmpty;

    final effectiveBorder = OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: BorderSide(
        color: _resolveBorderColor(colorScheme, hasError),
        width: _hasFocus ? 2 : 1,
      ),
    );

    final inputDecoration = InputDecoration(
      hintText: widget.hintText,
      labelText: widget.label ?? widget.labelText,
      helperText: widget.helperText,
      errorText: effectiveErrorText,
      prefixIcon: widget.prefixIcon,
      suffixIcon: widget.isPassword
          ? IconButton(
              icon: Icon(
                _obscureText ? LucideIcons.eye_off : LucideIcons.eye,
                semanticLabel: _obscureText ? 'Show password' : 'Hide password',
              ),
              onPressed: () {
                setState(() {
                  _obscureText = !_obscureText;
                });
                widget.onToggleObscure?.call();
              },
            )
          : widget.suffixIcon,
      filled: true,
      fillColor: colorScheme.surfaceContainerHighest.withOpacity(0.5),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      border: effectiveBorder,
      enabledBorder: effectiveBorder,
      focusedBorder: effectiveBorder,
      errorBorder: effectiveBorder,
      focusedErrorBorder: effectiveBorder,
      errorMaxLines: 2,
    );

    Widget result = TextFormField(
      controller: widget.controller,
      initialValue: widget.initialValue,
      obscureText: widget.isPassword && _obscureText,
      keyboardType: widget.isMultiline ? TextInputType.multiline : widget.keyboardType,
      textInputAction: widget.isMultiline ? TextInputAction.newline : widget.textInputAction,
      textAlign: widget.textAlign ?? TextAlign.start,
      validator: widget.validator,
      onChanged: widget.onChanged,
      onFieldSubmitted: widget.onSubmitted,
      enabled: widget.enabled,
      maxLines: widget.isMultiline ? 3 : widget.maxLines,
      maxLength: widget.maxLength,
      focusNode: widget.focusNode,
      autofocus: widget.autofocus,
      decoration: inputDecoration,
      onTapOutside: (_) => FocusScope.of(context).unfocus(),
      inputFormatters: widget.maxLength != null
          ? [LengthLimitingTextInputFormatter(widget.maxLength)]
          : null,
    );

    if (widget.focusNode != null) {
      result = AnimatedBuilder(
        animation: widget.focusNode!,
        builder: (context, child) {
          _hasFocus = widget.focusNode!.hasFocus;
          return child!;
        },
        child: result,
      );
    }

    return Semantics(
      label: widget.semanticLabel ?? widget.label ?? widget.labelText ?? widget.hintText,
      textField: true,
      child: result,
    );
  }

  Color _resolveBorderColor(ColorScheme colorScheme, bool hasError) {
    if (hasError) {
      return colorScheme.error;
    }
    if (_hasFocus) {
      return colorScheme.primary;
    }
    return colorScheme.outlineVariant;
  }
}
