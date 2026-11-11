import { timingSafeEqual } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

function matchesSecret(expected, received) {
  if (typeof received !== 'string') return false;
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  return expectedBuffer.length === receivedBuffer.length
    && timingSafeEqual(expectedBuffer, receivedBuffer);
}

async function replyToTelegram(botToken, chatId, text) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });

  if (!response.ok) {
    throw new Error(`Telegram reply failed with status ${response.status}`);
  }
}

function getForwardSource(message) {
  const origin = message.forward_origin;
  if (origin?.type === 'channel') {
    return {
      chatId: origin.chat?.id == null ? null : String(origin.chat.id),
      messageId: origin.message_id == null ? null : String(origin.message_id),
      channel: origin.chat?.title || (origin.chat?.username ? `@${origin.chat.username}` : ''),
      date: origin.date ? new Date(origin.date * 1000).toISOString() : null
    };
  }

  if (message.forward_from_chat) {
    return {
      chatId: String(message.forward_from_chat.id),
      messageId: message.forward_from_message_id == null ? null : String(message.forward_from_message_id),
      channel: message.forward_from_chat.title
        || (message.forward_from_chat.username ? `@${message.forward_from_chat.username}` : ''),
      date: message.forward_date ? new Date(message.forward_date * 1000).toISOString() : null
    };
  }

  return { chatId: null, messageId: null, channel: '', date: null };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!botToken || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Telegram webhook is not configured' });
  }

  if (!matchesSecret(webhookSecret, req.headers['x-telegram-bot-api-secret-token'])) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const update = req.body;
  const message = update?.message;
  if (!message || !Number.isSafeInteger(update.update_id)) {
    return res.status(200).json({ ok: true });
  }

  const chatId = message.chat?.id;
  const senderId = message.from?.id;
  if (!Number.isSafeInteger(chatId) || !Number.isSafeInteger(senderId)) {
    return res.status(200).json({ ok: true });
  }

  const text = message.text || message.caption || '';
  if (/^\/(?:start|id)(?:@\w+)?(?:\s|$)/i.test(text)) {
    try {
      await replyToTelegram(botToken, chatId, `Your Telegram ID is ${senderId}.`);
    } catch (error) {
      console.error(error.message);
    }
    return res.status(200).json({ ok: true });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  const { data: allowedSender, error: allowlistError } = await supabase
    .from('telegram_allowed_senders')
    .select('telegram_user_id')
    .eq('telegram_user_id', senderId)
    .maybeSingle();

  if (allowlistError) {
    console.error(`Telegram allowlist lookup failed: ${allowlistError.message}`);
    return res.status(500).json({ error: 'Could not verify Telegram sender' });
  }

  if (!allowedSender) {
    try {
      await replyToTelegram(botToken, chatId, `Your Telegram ID is ${senderId}. Ask an admin to allow it before submitting posts.`);
    } catch (error) {
      console.error(error.message);
    }
    return res.status(200).json({ ok: true });
  }

  if (!text.trim()) {
    try {
      await replyToTelegram(botToken, chatId, 'Please forward a text post or a post with a caption.');
    } catch (error) {
      console.error(error.message);
    }
    return res.status(200).json({ ok: true });
  }

  const source = getForwardSource(message);
  const rawEntities = message.text ? message.entities : message.caption_entities;
  const entities = (Array.isArray(rawEntities) ? rawEntities : [])
    .filter(entity => ['url', 'text_link'].includes(entity?.type)
      && Number.isSafeInteger(entity.offset)
      && Number.isSafeInteger(entity.length)
      && entity.offset >= 0
      && entity.length > 0)
    .map(entity => ({
      type: entity.type,
      offset: entity.offset,
      length: entity.length,
      ...(typeof entity.url === 'string' ? { url: entity.url } : {})
    }));
  const senderName = [message.from.first_name, message.from.last_name].filter(Boolean).join(' ');
  const { error: insertError } = await supabase
    .from('telegram_event_drafts')
    .insert({
      telegram_update_id: update.update_id,
      telegram_sender_id: senderId,
      sender_name: senderName,
      source_chat_id: source.chatId,
      source_message_id: source.messageId,
      source_channel: source.channel,
      source_date: source.date,
      message_text: text,
      message_entities: entities
    });

  if (insertError && insertError.code !== '23505') {
    console.error(`Telegram draft insert failed: ${insertError.message}`);
    return res.status(500).json({ error: 'Could not save Telegram draft' });
  }

  try {
    await replyToTelegram(
      botToken,
      chatId,
      insertError ? 'This post was already received.' : 'Saved as a draft for admin review.'
    );
  } catch (error) {
    console.error(error.message);
  }

  return res.status(200).json({ ok: true });
}
