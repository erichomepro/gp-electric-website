// Vercel serverless function — receives lead form submissions for GP Electric
// and emails them via Resend. Astro builds a static site, so this lives as a
// standalone Vercel function at the project root.

const OWNER_EMAIL = 'gpelectric@outlook.com';
const BCC_EMAIL = 'eric@aiprecisionmarketing.ca';
const FROM = 'GP Electric Leads <leads@aiprecisionmarketing.ca>';
const ORG_ID = 'b5f41841-b166-406c-af3d-f8308226186b';

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Email backend not configured' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  if (!body.name || !body.phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

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
