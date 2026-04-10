/**
 * Session Management
 *
 * Handles the QR code flow:
 * 1. Desktop app generates a QR with URL like:
 *    https://your-domain.com/?token=abc123&uid=user456
 * 2. User scans with phone, opens this PWA
 * 3. We parse token + uid from URL params
 * 4. Store in sessionStorage so it survives page refreshes
 *    but not new sessions (user must scan QR again)
 * 5. All API calls use this token for auth
 */

import { setToken } from './client';

const SESSION_KEY = 'fashion-inspo-session';

/**
 * Session data shape:
 * {
 *   token: string,    // auth token from QR
 *   uid: string,      // user ID
 *   folderId: string, // optional: target folder in desktop app
 *   ts: number,       // when session was created
 * }
 */

export function initSession() {
  // 1. Check URL params (fresh QR scan)
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const uid = params.get('uid');
  const folderId = params.get('folder');

  if (token) {
    const session = {
      token,
      uid: uid || null,
      folderId: folderId || null,
      ts: Date.now(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setToken(token);

    // Clean URL without reloading (remove token from address bar)
    const clean = new URL(window.location.href);
    clean.searchParams.delete('token');
    clean.searchParams.delete('uid');
    clean.searchParams.delete('folder');
    window.history.replaceState({}, '', clean.pathname + clean.search);

    return session;
  }

  // 2. Fall back to stored session
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const session = JSON.parse(raw);
      setToken(session.token);
      return session;
    }
  } catch {
    // corrupted — ignore
  }

  // 3. No session — anonymous / demo mode
  return null;
}

export function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  setToken(null);
}

export function isLinked() {
  return !!getSession()?.token;
}
