import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;

  if (!supabaseUrl || !publishableKey || !botToken || !webhookSecret || !webhookUrl) {
    return res.status(500).json({ error: 'Add the Supabase and Telegram server environment variables in Vercel first.' });
  }

  let parsedWebhookUrl;
  try {
    parsedWebhookUrl = new URL(webhookUrl);
  } catch {
    return res.status(500).json({ error: 'TELEGRAM_WEBHOOK_URL must be a valid HTTPS URL.' });
  }
  if (parsedWebhookUrl.protocol !== 'https:') {
    return res.status(500).json({ error: 'TELEGRAM_WEBHOOK_URL must use HTTPS.' });
  }

  if (!/^[A-Za-z0-9_-]{1,256}$/.test(webhookSecret)) {
    return res.status(500).json({ error: 'TELEGRAM_WEBHOOK_SECRET must contain only letters, numbers, underscores, or hyphens.' });
  }

  const authorization = req.headers.authorization || '';
  const accessToken = authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : '';
  if (!accessToken) {
    return res.status(401).json({ error: 'Sign in as an admin to configure the bot.' });
  }

  const supabase = createClient(supabaseUrl, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } }
  });
  const { data: userData, error: authError } = await supabase.auth.getUser(accessToken);
  if (authError || !userData.user) {
    return res.status(401).json({ error: 'Your session is invalid or expired. Sign in again.' });
  }

  const { data: role, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userData.user.id)
    .maybeSingle();
  if (roleError) {
    return res.status(500).json({ error: `Could not verify admin access: ${roleError.message}` });
  }
  if (role?.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can configure the Telegram bot.' });
  }

  const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: parsedWebhookUrl.toString(),
      secret_token: webhookSecret,
      allowed_updates: ['message']
    })
  });
  const result = await telegramResponse.json();
  if (!telegramResponse.ok || !result.ok) {
    return res.status(502).json({ error: result.description || 'Telegram rejected the webhook configuration.' });
  }

  return res.status(200).json({ ok: true, message: 'Telegram webhook configured.' });
}
