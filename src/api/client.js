/**
 * API Client
 *
 * Centralized HTTP client that attaches the session token
 * from the QR code to every request.
 *
 * Future: point BASE_URL to your real backend.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';

let _token = null;

export function setToken(token) {
  _token = token;
}

export function getToken() {
  return _token;
}

/**
 * Authenticated fetch wrapper.
 * Adds Authorization header when a session token exists.
 */
export async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    ...options.headers,
  };

  if (_token) {
    headers['Authorization'] = `Bearer ${_token}`;
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body}`);
  }

  return res;
}
