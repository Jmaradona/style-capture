const CDN_URL = 'https://gateway.fermat.app/resources/upload';
const KEY_STORE = 'sc-ak';

// ── API Key management (localStorage, never in source) ──

export function getApiKey() {
  return localStorage.getItem(KEY_STORE);
}

export function setApiKey(key) {
  localStorage.setItem(KEY_STORE, key);
}

export function hasApiKey() {
  return !!getApiKey();
}

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
  // External URL — fetch as blob (may fail due to CORS)
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image (${res.status})`);
  return res.blob();
}

// ── Upload a single image to the CDN ──

async function uploadOne(imageUrl) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('No API key');

  const blob = await toBlob(imageUrl);

  // Ensure MIME is jpeg or png
  let ct = blob.type;
  if (ct !== 'image/jpeg' && ct !== 'image/png') ct = 'image/jpeg';

  const res = await fetch(CDN_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': ct,
      'x-fermat-api-key': apiKey,
    },
    body: blob,
  });

  if (res.status === 201) {
    const loc = res.headers.get('Location') || '';
    return { success: true, resourceId: loc.split('/').pop() };
  }

  const errText = await res.text().catch(() => '');
  throw new Error(`${res.status}${errText ? ': ' + errText : ''}`);
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
