/**
 * Upload API
 *
 * Handles sending images to the desktop app's backend.
 *
 * Flow:
 * 1. User captures/selects photos on mobile
 * 2. "Send to Fermat" triggers uploadImages()
 * 3. Images are POSTed to backend with the session token
 * 4. Backend stores them in the user's folder structure
 *
 * Currently a stub — logs to console.
 * Replace with real fetch calls when backend is ready.
 */

import { apiFetch } from './client';
import { getSession } from './session';

/**
 * Upload images to the backend.
 *
 * @param {Array<{id: string, url: string}>} images - images to send
 * @param {string} collectionName - name of the source collection
 * @returns {Promise<{success: boolean, count: number}>}
 */
export async function uploadImages(images, collectionName) {
  const session = getSession();

  // ── STUB MODE (no backend connected) ──
  if (!session?.token) {
    console.log('[FERMAT] No session — stub mode', {
      collectionName,
      imageCount: images.length,
      images: images.map((i) => i.url),
    });
    return { success: true, count: images.length, stub: true };
  }

  // ── REAL MODE (backend connected via QR) ──
  // TODO: Replace with actual endpoint when backend is ready
  //
  // Expected backend contract:
  //   POST /api/uploads
  //   Headers: Authorization: Bearer <token>
  //   Body (JSON): {
  //     folderId: string,        // from session
  //     collectionName: string,  // user's collection name
  //     images: [                // array of image data
  //       { id: string, dataUrl: string }
  //     ]
  //   }
  //   Response: { success: true, uploadedCount: number }

  try {
    const res = await apiFetch('/api/uploads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        folderId: session.folderId,
        collectionName,
        images: images.map((img) => ({
          id: img.id,
          dataUrl: img.url,
        })),
      }),
    });

    const data = await res.json();
    return { success: true, count: data.uploadedCount || images.length };
  } catch (err) {
    console.error('[FERMAT] Upload failed:', err);
    return { success: false, count: 0, error: err.message };
  }
}

/**
 * Check if the backend is reachable.
 * Useful for showing connection status in the UI.
 */
export async function pingBackend() {
  try {
    await apiFetch('/api/health');
    return true;
  } catch {
    return false;
  }
}
