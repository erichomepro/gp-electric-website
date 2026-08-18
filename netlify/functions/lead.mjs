/**
 * Netlify entry point for the lead form.
 *
 * Why this exists: gpelectric.ca is served by Netlify, but the hardened
 * endpoint was written as a Vercel function at api/lead.js. Posting to
 * /api/lead on the live domain returned Netlify's 404 page, so the spam filter
 * never ran for a single real visitor and five bot submissions were emailed to
 * the owner on 2026-08-17.
 *
 * This adapts the Vercel handler rather than reimplementing it. A second copy
 * of the filter is exactly how Beast Mode drifted out of sync and started
 * scoring an empty string, so there must remain one implementation.
 */
import handler from '../../api/lead.js';

export default async function netlifyLead(request) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Minimal Express-shaped shim so the Vercel handler runs unmodified.
  const req = {
    method: 'POST',
    body,
    headers: Object.fromEntries(request.headers.entries()),
  };

  let statusCode = 200;
  const outHeaders = {};
  let payload = '';

  const res = {
    setHeader(k, v) { outHeaders[k] = v; },
    status(code) { statusCode = code; return res; },
    json(obj) { payload = JSON.stringify(obj); return res; },
    end() { return res; },
  };

  await handler(req, res);

  return new Response(payload || '{}', {
    status: statusCode,
    headers: { 'Content-Type': 'application/json', ...outHeaders },
  });
}

export const config = { path: '/api/lead' };
