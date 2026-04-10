/**
 * localStorage abstraction.
 * Easy to swap for IndexedDB or remote persistence later.
 */
const STORAGE_KEY = 'fashion-inspo-v2';

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded — silently fail
  }
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}
