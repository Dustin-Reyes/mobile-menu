export function getPasswordStrength(password) {
  if (!password) return null;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const mixed = [hasLower, hasUpper, hasDigit, hasSymbol].filter(
    Boolean,
  ).length;
  if (password.length >= 12 && mixed >= 3) return 'strong';
  if (password.length >= 8 && mixed >= 2) return 'medium';
  return 'weak';
}
