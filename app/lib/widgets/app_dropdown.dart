import 'package:flutter/material.dart';

class AppDropdown<T> extends StatefulWidget {
  final List<T> items;
  final T? value;
  final String? hintText;
  final String? labelText;
  final String? errorText;
  final bool enabled;
  final bool isExpanded;
  final String Function(T)? itemLabelBuilder;
  final Widget Function(BuildContext, T)? itemBuilder;
  final void Function(T?)? onChanged;
  final String? Function(T?)? validator;
  final FocusNode? focusNode;
  final String? semanticLabel;

  const AppDropdown({
    super.key,
    required this.items,
    this.value,
    this.hintText,
    this.labelText,
    this.errorText,
    this.enabled = true,
    this.isExpanded = true,
    this.itemLabelBuilder,
    this.itemBuilder,
    this.onChanged,
    this.validator,
    this.focusNode,
    this.semanticLabel,
  });

  @override
  State<AppDropdown<T>> createState() => _AppDropdownState<T>();
}

class _AppDropdownState<T> extends State<AppDropdown<T>> {
  final TextEditingController _searchController = TextEditingController();
  late List<T> _filteredItems;
  T? _selectedValue;

  @override
  void initState() {
    super.initState();
    _filteredItems = widget.items;
    _selectedValue = widget.value;
  }

  @override
  void didUpdateWidget(AppDropdown<T> oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.items != widget.items) {
      _filteredItems = widget.items;
    }
    if (oldWidget.value != widget.value) {
      _selectedValue = widget.value;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    final effectiveErrorText = widget.errorText;
    final hasError = effectiveErrorText != null && effectiveErrorText.isNotEmpty;

    final selectedLabel = _selectedValue != null
        ? widget.itemLabelBuilder?.call(_selectedValue!) ?? _selectedValue.toString()
        : null;

    final border = OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: BorderSide(
        color: hasError
            ? colorScheme.error
            : colorScheme.outlineVariant,
        width: 1,
      ),
    );

    final inputDecoration = InputDecoration(
      hintText: widget.hintText,
      labelText: widget.labelText,
      errorText: effectiveErrorText,
      filled: true,
      fillColor: widget.enabled
          ? colorScheme.surfaceContainerHighest.withOpacity(0.5)
          : colorScheme.surfaceContainerHighest.withOpacity(0.3),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      border: border,
      enabledBorder: border,
      focusedBorder: hasError
          ? border.copyWith(
              borderSide: BorderSide(color: colorScheme.error, width: 2),
            )
          : border.copyWith(
              borderSide: BorderSide(color: colorScheme.primary, width: 2),
            ),
      suffixIcon: const Icon(Icons.arrow_drop_down_rounded, size: 28),
    );

    return Semantics(
      label: widget.semanticLabel ?? widget.labelText ?? 'Dropdown',
      textField: true,
      child: GestureDetector(
        onTap: widget.enabled ? _showSearchModal : null,
        child: AbsorbPointer(
          child: TextFormField(
            controller: TextEditingController(text: selectedLabel),
            focusNode: widget.focusNode,
            decoration: inputDecoration,
            validator: widget.validator,
            enabled: widget.enabled,
          ),
        ),
      ),
    );
  }

  void _showSearchModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _SearchableDropdownSheet<T>(
        items: widget.items,
        itemLabelBuilder: widget.itemLabelBuilder,
        itemBuilder: widget.itemBuilder,
        onSelected: (item) {
          setState(() {
            _selectedValue = item;
          });
          widget.onChanged?.call(item);
          Navigator.of(context).pop();
        },
      ),
    );
  }
}

class _SearchableDropdownSheet<T> extends StatefulWidget {
  final List<T> items;
  final String Function(T)? itemLabelBuilder;
  final Widget Function(BuildContext, T)? itemBuilder;
  final void Function(T) onSelected;

  const _SearchableDropdownSheet({
    required this.items,
    this.itemLabelBuilder,
    this.itemBuilder,
    required this.onSelected,
  });

  @override
  State<_SearchableDropdownSheet<T>> createState() => _SearchableDropdownSheetState<T>();
}

class _SearchableDropdownSheetState<T> extends State<_SearchableDropdownSheet<T>> {
  final TextEditingController _searchController = TextEditingController();
  late List<T> _filteredItems;

  @override
  void initState() {
    super.initState();
    _filteredItems = widget.items;
    _searchController.addListener(_filterItems);
  }

  @override
  void dispose() {
    _searchController.removeListener(_filterItems);
    _searchController.dispose();
    super.dispose();
  }

  void _filterItems() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      _filteredItems = widget.items.where((item) {
        final label = widget.itemLabelBuilder?.call(item) ?? item.toString();
        return label.toLowerCase().contains(query);
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.6,
      ),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search...',
                prefixIcon: const Icon(Icons.search_rounded),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear_rounded),
                        onPressed: () {
                          _searchController.clear();
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: colorScheme.outlineVariant),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: colorScheme.outlineVariant),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: colorScheme.primary, width: 2),
                ),
                filled: true,
                fillColor: colorScheme.surfaceContainerHighest.withOpacity(0.5),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              ),
            ),
          ),
          const Divider(height: 1),
          Flexible(
            child: _filteredItems.isEmpty
                ? Padding(
                    padding: const EdgeInsets.all(32),
                    child: Text(
                      'No results found',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: colorScheme.onSurfaceVariant,
                      ),
                    ),
                  )
                : ListView.builder(
                    shrinkWrap: true,
                    itemCount: _filteredItems.length,
                    itemBuilder: (context, index) {
                      final item = _filteredItems[index];
                      return InkWell(
                        onTap: () => widget.onSelected(item),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          decoration: BoxDecoration(
                            border: Border(
                              bottom: BorderSide(
                                color: colorScheme.outlineVariant.withOpacity(0.3),
                                width: 0.5,
                              ),
                            ),
                          ),
                          child: widget.itemBuilder != null
                              ? widget.itemBuilder!(context, item)
                              : Text(
                                  widget.itemLabelBuilder?.call(item) ?? item.toString(),
                                  style: theme.textTheme.bodyLarge,
                                ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
