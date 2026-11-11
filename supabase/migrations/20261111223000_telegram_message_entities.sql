alter table public.telegram_event_drafts
  add column if not exists message_entities jsonb not null default '[]'::jsonb;
