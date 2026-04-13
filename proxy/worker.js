/**
 * Cloudflare Worker — proxy for the Fermat CDN upload endpoint.
 *
 * The API key lives in a Cloudflare secret (FERMAT_API_KEY) and is
 * injected server-side, so it never reaches the browser or the repo.
 *
 * CORS is restricted to the PWA origin to prevent random callers from
 * abusing the proxy with our key.
 */

const FERMAT_URL = 'https://gateway.fermat.app/resources/upload';

const ALLOWED_ORIGINS = new Set([
  'https://jmaradona.github.io',
  'http://localhost:5173',
  'http://localhost:4173',
]);

function corsHeadersFor(origin) {
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : 'https://jmaradona.github.io';
  return {
    'Access-Control-Allow-Origin': allow,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Expose-Headers': 'Location, X-Resource-Id',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeadersFor(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'PUT') {
      return new Response('Method not allowed', { status: 405, headers: cors });
    }

    const apiKey = env.FERMAT_API_KEY;
    if (!apiKey) {
      return new Response('Server misconfigured: missing FERMAT_API_KEY secret', {
        status: 500, headers: cors,
      });
    }

    const contentType = request.headers.get('content-type') || 'image/jpeg';
    if (contentType !== 'image/jpeg' && contentType !== 'image/png') {
      return new Response('Content-Type must be image/jpeg or image/png', {
        status: 400, headers: cors,
      });
    }

    let upstream;
    try {
      upstream = await fetch(FERMAT_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
          'x-fermat-api-key': apiKey,
        },
        body: request.body,
      });
    } catch (err) {
      return new Response(`Upstream error: ${err.message}`, { status: 502, headers: cors });
    }

    const responseHeaders = { ...cors };
    const location = upstream.headers.get('Location');
    if (location) {
      responseHeaders['Location'] = location;
      const resourceId = location.split('/').pop();
      if (resourceId) responseHeaders['X-Resource-Id'] = resourceId;
    }

    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  },
};
