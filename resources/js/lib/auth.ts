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

export const AUTH_UPDATED_EVENT = 'halcyon:auth-updated';

export function notifyAuthUpdated(): void {
  clearAuthCache();
  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.removeItem('__halcyon_permissions__');
    } catch {
      /* ignore quota/private-mode errors */
    }
    window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
  }
}

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
  pending = null;
}

export function refreshCurrentUser(): Promise<AuthUser | null> {
  return fetchCurrentUserAfterReset();
}

function fetchCurrentUserAfterReset(): Promise<AuthUser | null> {
  cache = null;
  pending = null;
  return fetchCurrentUser();
}

/**
 * React hook: ambil user login (sekali, cached) untuk gating tombol/menu di UI.
 * Mengembalikan { user, can, canAny } yang siap dipakai di JSX.
 */
import { useEffect, useState } from 'react';

export function useCurrentUser() {
  const [user, setUser] = useState<AuthUser | null>(cache);

  useEffect(() => {
    let alive = true;
    const load = () => {
      refreshCurrentUser().then((u) => {
        if (alive) setUser(u);
      });
    };
    load();
    window.addEventListener(AUTH_UPDATED_EVENT, load);
    return () => {
      alive = false;
      window.removeEventListener(AUTH_UPDATED_EVENT, load);
    };
  }, []);

  const canPermission = (permission: string): boolean => can(user, permission);
  const canAnyPermission = (permissions: string[]): boolean => canAny(user, permissions);

  return { user, can: canPermission, canAny: canAnyPermission };
}

export async function logout(): Promise<void> {
  const token = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');

  clearAuthCache();
  try {
    window.sessionStorage.removeItem('__halcyon_permissions__');
    window.sessionStorage.removeItem('__halcyon_profile__');
  } catch {
    /* ignore quota/private-mode errors */
  }

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
