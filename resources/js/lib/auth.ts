export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string | null;
  permissions: string[];
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}

let cache: AuthUser | null = null;
let pending: Promise<AuthUser | null> | null = null;

export function fetchCurrentUser(): Promise<AuthUser | null> {
  if (cache) return Promise.resolve(cache);
  if (pending) return pending;

  pending = fetch('/api/me', {
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      cache = data?.user ?? null;
      return cache;
    })
    .catch(() => null)
    .finally(() => {
      pending = null;
    });

  return pending;
}

export function can(user: AuthUser | null, permission: string): boolean {
  if (!user) return false;
  return user.permissions.includes(permission);
}

export function canAny(user: AuthUser | null, permissions: string[]): boolean {
  if (!user) return false;
  if (permissions.length === 0) return true;
  return permissions.some((p) => user.permissions.includes(p));
}

export function clearAuthCache(): void {
  cache = null;
}

export async function logout(): Promise<void> {
  const token = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');

  clearAuthCache();

  await fetch('/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': token || '',
    },
    credentials: 'same-origin',
  });

  window.location.href = '/login';
}
