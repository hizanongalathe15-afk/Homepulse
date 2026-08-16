
bool isValidEmail(String email) {
  final regex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
  return regex.hasMatch(email);
}

bool isValidKenyanPhone(String phone) {
  final cleaned = phone.replaceAll(RegExp(r'\s+'), '');
  final regex = RegExp(r'^(\+254|0|254)[17]\d{8}$');
  return regex.hasMatch(cleaned);
}

String? validateRequired(String? value, {String fieldName = 'Field'}) {
  if (value == null || value.trim().isEmpty) {
    return '$fieldName is required';
  }
  return null;
}

String? validatePassword(String password) {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!RegExp(r'[A-Z]').hasMatch(password)) return 'Password must contain an uppercase letter';
  if (!RegExp(r'[a-z]').hasMatch(password)) return 'Password must contain a lowercase letter';
  if (!RegExp(r'\d').hasMatch(password)) return 'Password must contain a number';
  if (!RegExp(r'[!@#$%^&*(),.?":{}|<>]').hasMatch(password)) return 'Password must contain a special character';
  return null;
}

String? validatePositiveNumber(String value) {
  final number = double.tryParse(value);
  if (number == null) return 'Enter a valid number';
  if (number <= 0) return 'Value must be greater than 0';
  return null;
}

String formatKenyanPhone(String phone) {
  final cleaned = phone.replaceAll(RegExp(r'\D'), '');
  if (cleaned.startsWith('254')) {
    return '+${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)} ${cleaned.substring(9)}';
  }
  if (cleaned.startsWith('0')) {
    return '+254 ${cleaned.substring(1, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}';
  }
  return phone;
}
