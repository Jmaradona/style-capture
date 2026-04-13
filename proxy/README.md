# Upload Proxy (Cloudflare Worker)

A tiny serverless proxy that forwards image uploads from the PWA to the
upstream CDN. Needed because browsers can't PUT directly to the CDN due
to CORS restrictions.

The user's API key travels in the `x-fermat-api-key` header — the worker
**never stores it**, just forwards it.

## Deploy (5 minutes)

### 1. Install Wrangler

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

(Opens a browser; create a free account if you don't have one)

### 3. Deploy

```bash
cd proxy
wrangler deploy
```

You'll get a URL like:
```
https://style-capture-proxy.<your-subdomain>.workers.dev
```

### 4. Wire it to the frontend

Open `src/api/uploads.js` and set `PROXY_URL` to your deployed URL.
Then commit + push and GitHub Actions will rebuild the PWA.

## Local testing

```bash
cd proxy
wrangler dev
```

Runs at `http://localhost:8787`.

## Free tier limits

Cloudflare Workers free tier: **100,000 requests/day**. Way more than enough.
