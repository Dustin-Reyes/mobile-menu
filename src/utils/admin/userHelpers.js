export function getUserStatus(u) {
  return u.disabled ? 'disabled' : 'active';
}

export function getProviderLabel(providers = []) {
  if (providers.includes('google.com')) return 'Google';
  if (providers.includes('password')) return 'Password';
  return providers[0] ?? 'Unknown';
}

export async function callUserManagement(action, user, body = null) {
  const idToken = await user.getIdToken();
  const res = await fetch(
    `/.netlify/functions/user-management?action=${action}`,
    {
      method: body ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Request failed');
  return data;
}
