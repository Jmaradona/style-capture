// Proxy URL — the Cloudflare Worker that forwards uploads to the CDN.
// The API key lives as a secret on the worker, not in this codebase.
const PROXY_URL = 'https://style-capture-proxy.style-capture-proxy.workers.dev';

// ── Helpers ──

function dataUrlToBlob(dataUrl) {
  const [header, b64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

async function toBlob(url) {
  if (url.startsWith('data:')) return dataUrlToBlob(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image (${res.status})`);
  return res.blob();
}

// ── Upload a single image via the proxy ──

async function uploadOne(imageUrl) {
  let blob;
  try {
    blob = await toBlob(imageUrl);
  } catch (err) {
    throw new Error(`Image fetch failed: ${err.message}`);
  }

  let ct = blob.type;
  if (ct !== 'image/jpeg' && ct !== 'image/png') ct = 'image/jpeg';

  let res;
  try {
    res = await fetch(PROXY_URL, {
      method: 'PUT',
      headers: { 'Content-Type': ct },
      body: blob,
    });
  } catch (err) {
    throw new Error('Network error — proxy may be unreachable');
  }

  if (res.status === 201) {
    const rid = res.headers.get('X-Resource-Id')
      || (res.headers.get('Location') || '').split('/').pop();
    return { success: true, resourceId: rid };
  }

  const errText = await res.text().catch(() => '');
  throw new Error(`HTTP ${res.status}${errText ? ' — ' + errText : ''}`);
}

// ── Upload multiple images with progress callback ──

export async function uploadImages(images, onProgress) {
  const results = [];
  for (let i = 0; i < images.length; i++) {
    try {
      const r = await uploadOne(images[i].url);
      results.push({ ...r, id: images[i].id });
    } catch (err) {
      results.push({ success: false, id: images[i].id, error: err.message });
    }
    if (onProgress) onProgress(i + 1, images.length);
  }
  return results;
}
