export function getUserInitials(email) {
  const username = (email || '').split('@')[0] || '';
  return username.slice(0, 2).toUpperCase();
}

export function getUserDisplayName(email) {
  const username = (email || '').split('@')[0] || '';
  return username.charAt(0).toUpperCase() + username.slice(1);
}
