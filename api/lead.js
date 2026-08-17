// Vercel serverless function — receives lead form submissions for GP Electric
// and emails them via Resend. Astro builds a static site, so this lives as a
// standalone Vercel function at the project root.

import { classify, canonicalEmail } from './spam-filter.mjs';

const OWNER_EMAIL = 'gpelectric@outlook.com';
const BCC_EMAIL = 'eric@aiprecisionmarketing.ca';
const FROM = 'GP Electric Leads <leads@aiprecisionmarketing.ca>';
const ORG_ID = 'b5f41841-b166-406c-af3d-f8308226186b';

/**
 * Origins allowed to POST here. Previously this was '*', which let any origin on
 * the internet submit the form without ever loading the site -- the likely
 * vector for the 5 bot submissions on 2026-08-17, three of which landed within
 * 5 seconds of each other.
 */
const ALLOWED_ORIGINS = [
  'https://gpelectricinc.com',
  'https://www.gpelectricinc.com',
];

/**
 * Burst limiter keyed by canonical email, so Gmail dot-variants collapse to one
 * identity. In-memory: a cold start empties it, which only means a burst may
 * restart. The content filter is the real defence; this is a cheap second layer.
 */
const recentByEmail = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_IN_WINDOW = 3;

function isRateLimited(email) {
  const key = canonicalEmail(email);
  const now = Date.now();
  const hits = (recentByEmail.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  recentByEmail.set(key, hits);

  if (recentByEmail.size > 500) {
    for (const [k, v] of recentByEmail) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) recentByEmail.delete(k);
    }
  }

  return hits.length > RATE_MAX_IN_WINDOW;
}

/** Anti-spam plumbing is not lead data; never store or email it. */
function stripInternalFields(body) {
  const { website: _website, elapsedMs: _elapsedMs, ...rest } = body;
  return rest;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function row(label, value) {
  if (!value) return '';
  return `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(value)}</td></tr>`;
}

async function backupToSupabase(body) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

  const services = body.service ? [body.service] : [];
  const payload = {
    org_id: ORG_ID,
    business_name: 'GP Electric (Website Lead)',
    contact_name: body.name || null,
    email: body.email || null,
    phone: body.phone || null,
    source: 'Website Form',
    inquiry_type: 'Quote Request',
    form_data: body,
    services_interested: services,
    lead_score: 'Warm',
    pipeline_stage: 'New',
    notes: body.message || null,
  };

  try {
    await fetch(`${url}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Best effort — don't fail the request if backstop fails
  }
}

export default async function handler(req, res) {
  // Reflect only known origins. Same-origin form posts from the site itself send
  // no Origin header, so they are unaffected by this.
  const origin = req.headers?.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Email backend not configured' });

  let body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  if (!body.name || !body.phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  // Spam gate. A rejected submission returns 200 rather than 4xx on purpose: a
  // bot that sees an error retunes its payload, one that sees success keeps
  // sending the signature we already detect. The classifier fails open, because
  // losing one real quote request costs more than forwarding one more spam.
  const verdict = classify({
    name: body.name,
    email: body.email,
    phone: body.phone,
    message: body.message,
    website: body.website,
    elapsedMs: body.elapsedMs,
  });
  if (verdict.isSpam) {
    console.warn(JSON.stringify({
      scope: 'lead.spam', score: verdict.score, reasons: verdict.reasons,
      email: body.email, page: body.page,
    }), 'Submission rejected as spam; not emailed, not stored');
    return res.status(200).json({ ok: true });
  }

  if (body.email && isRateLimited(body.email)) {
    console.warn(JSON.stringify({
      scope: 'lead.ratelimit', email: canonicalEmail(body.email), page: body.page,
    }), 'Submission rejected as rate limited; not emailed, not stored');
    return res.status(200).json({ ok: true });
  }

  body = stripInternalFields(body);

  const rows = [
    row('Name', body.name),
    row('Phone', body.phone),
    row('Email', body.email),
    row('Service', body.service),
    row('Location', body.location),
    row('Message', body.message),
    row('Page', body.page),
  ].join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#0a0f1a;color:#fff;padding:24px;text-align:center;">
        <h1 style="margin:0;font-size:22px;">New Quote Request</h1>
        <p style="margin:8px 0 0 0;color:#bbb;font-size:14px;">gpelectricinc.com</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">${rows}</table>
      <p style="margin-top:24px;color:#666;font-size:13px;">Reply directly to this email to respond${body.email ? ` to ${escapeHtml(body.email)}` : ''}.</p>
    </div>
  `;

  const plain = Object.entries(body)
    .filter(([, v]) => v != null && String(v).trim() !== '')
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const payload = {
    from: FROM,
    to: [OWNER_EMAIL],
    bcc: [BCC_EMAIL],
    subject: `New quote request from ${body.name}${body.service ? ` — ${body.service}` : ''}`,
    html,
    text: plain,
    ...(body.email ? { reply_to: body.email } : {}),
  };

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      const detail = await r.text();
      await backupToSupabase(body);
      return res.status(502).json({ error: 'Email send failed', detail });
    }
    await backupToSupabase(body);
    return res.status(200).json({ ok: true });
  } catch (err) {
    await backupToSupabase(body);
    return res.status(502).json({ error: 'Email send failed', detail: String(err) });
  }
}
