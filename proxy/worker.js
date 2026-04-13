/**
 * Cloudflare Worker — proxy for the Fermat CDN upload endpoint.
 *
 * Why: the browser can't PUT directly to gateway.fermat.app due to CORS.
 * This worker forwards the request server-side, then returns the result
 * with proper CORS headers so the PWA can read it.
 *
 * The user's API key is sent in the `x-fermat-api-key` header from the
 * client and forwarded verbatim — it is never stored on the worker.
 */

const FERMAT_URL = 'https://gateway.fermat.app/resources/upload';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-fermat-api-key',
  'Access-Control-Expose-Headers': 'Location, X-Resource-Id',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'PUT') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const apiKey = request.headers.get('x-fermat-api-key');
    if (!apiKey) {
      return new Response('Missing x-fermat-api-key header', { status: 401, headers: corsHeaders });
    }

    const contentType = request.headers.get('content-type') || 'image/jpeg';
    if (contentType !== 'image/jpeg' && contentType !== 'image/png') {
      return new Response('Content-Type must be image/jpeg or image/png', { status: 400, headers: corsHeaders });
    }

    // Forward to Fermat CDN
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
      return new Response(`Upstream error: ${err.message}`, { status: 502, headers: corsHeaders });
    }

    // Build response with CORS + Location header passthrough
    const responseHeaders = { ...corsHeaders };
    const location = upstream.headers.get('Location');
    if (location) {
      responseHeaders['Location'] = location;
      // Also expose the resource ID directly so the client doesn't have
      // to parse the Location header (some browsers strip it).
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
