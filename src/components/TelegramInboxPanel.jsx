import React, { useEffect, useState } from 'react';
import { Bot, Send, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { extractTelegramDraft } from '../lib/telegramDraftParser';

export default function TelegramInboxPanel({ onSelectDraft }) {
  const [senders, setSenders] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [telegramId, setTelegramId] = useState('');
  const [senderLabel, setSenderLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadInbox = async () => {
    const [sendersResult, draftsResult] = await Promise.all([
      supabase.from('telegram_allowed_senders').select('*').order('created_at', { ascending: false }),
      supabase.from('telegram_event_drafts').select('*').eq('status', 'pending').order('created_at', { ascending: false })
    ]);

    if (sendersResult.error || draftsResult.error) {
      setErrorMessage(
        sendersResult.error?.message
        || draftsResult.error?.message
        || 'Не удалось загрузить Telegram-данные.'
      );
    } else {
      setSenders(sendersResult.data || []);
      setDrafts(draftsResult.data || []);
      setErrorMessage('');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadInbox();
  }, []);

  const configureWebhook = async () => {
    setWorking(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (!data.session) throw new Error('Войдите в аккаунт администратора заново.');

      const response = await fetch('/api/telegram-setup', {
        method: 'POST',
        headers: { Authorization: `Bearer ${data.session.access_token}` }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Не удалось подключить Telegram-бота.');
      setSuccessMessage('Webhook подключён. Напишите боту /id, чтобы узнать свой Telegram ID.');
    } catch (error) {
      setErrorMessage(error.message || 'Не удалось подключить Telegram-бота.');
    } finally {
      setWorking(false);
    }
  };

  const addSender = async (e) => {
    e.preventDefault();
    if (!/^\d+$/.test(telegramId) || !Number.isSafeInteger(Number(telegramId))) {
      setErrorMessage('Введите числовой Telegram ID из ответа бота /id.');
      return;
    }

    setWorking(true);
    setErrorMessage('');
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setErrorMessage(userError?.message || 'Войдите в аккаунт администратора заново.');
      setWorking(false);
      return;
    }

    const { error } = await supabase.from('telegram_allowed_senders').insert({
      telegram_user_id: Number(telegramId),
      label: senderLabel.trim(),
      added_by: userData.user.id
    });

    if (error) {
      setErrorMessage(`Не удалось разрешить этот Telegram ID: ${error.message}`);
    } else {
      setTelegramId('');
      setSenderLabel('');
      setSuccessMessage('Telegram ID добавлен в список разрешённых отправителей.');
      await loadInbox();
    }
    setWorking(false);
  };

  const removeSender = async (sender) => {
    if (!window.confirm(`Запретить отправку для ID ${sender.telegram_user_id}?`)) return;
    setWorking(true);
    setErrorMessage('');
    const { error } = await supabase
      .from('telegram_allowed_senders')
      .delete()
      .eq('telegram_user_id', sender.telegram_user_id);

    if (error) {
      setErrorMessage(`Не удалось удалить Telegram ID: ${error.message}`);
    } else {
      await loadInbox();
    }
    setWorking(false);
  };

  const rejectDraft = async (draft) => {
    setWorking(true);
    setErrorMessage('');
    const { error } = await supabase
      .from('telegram_event_drafts')
      .update({ status: 'rejected' })
      .eq('id', draft.id)
      .eq('status', 'pending');

    if (error) {
      setErrorMessage(`Не удалось отклонить черновик: ${error.message}`);
    } else {
      await loadInbox();
    }
    setWorking(false);
  };

  if (loading) {
    return <p className="py-8 text-center text-sm text-slate-500">Загрузка Telegram-входящих...</p>;
  }

  return (
    <div className="space-y-6">
      {errorMessage && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{errorMessage}</p>
      )}
      {successMessage && (
        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{successMessage}</p>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <Bot className="mt-1 h-5 w-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-slate-900">Подключение бота</h3>
              <p className="mt-1 text-sm text-slate-500">
                Создайте бота через @BotFather и добавьте серверные переменные в Vercel. Секреты не помещайте в переменные с префиксом VITE_.
              </p>
            </div>
          </div>
          <button
            onClick={configureWebhook}
            disabled={working}
            className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {working ? 'Подключение...' : 'Подключить webhook'}
          </button>
        </div>
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
          Нужны серверные переменные: <code>TELEGRAM_BOT_TOKEN</code>, <code>TELEGRAM_WEBHOOK_SECRET</code>, <code>TELEGRAM_WEBHOOK_URL</code> (ваш Vercel URL с <code>/api/telegram-webhook</code>) и <code>SUPABASE_SERVICE_ROLE_KEY</code>. Секретный ключ Supabase хранится только на сервере.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="font-bold text-slate-900">Разрешённые отправители</h3>
          <p className="mt-1 text-sm text-slate-500">Сначала подключите webhook, затем отправьте боту <code>/id</code> и добавьте полученный ID.</p>
        </div>
        <form onSubmit={addSender} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input
            inputMode="numeric"
            value={telegramId}
            onChange={e => setTelegramId(e.target.value)}
            placeholder="Telegram ID"
            required
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            value={senderLabel}
            onChange={e => setSenderLabel(e.target.value)}
            placeholder="Имя или описание (необязательно)"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <button disabled={working} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            Разрешить ID
          </button>
        </form>
        <div className="mt-4 space-y-2">
          {senders.map(sender => (
            <div key={sender.telegram_user_id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-sm text-slate-700">
                <strong>{sender.telegram_user_id}</strong>{sender.label ? ` · ${sender.label}` : ''}
              </span>
              <button
                onClick={() => removeSender(sender)}
                disabled={working}
                aria-label={`Удалить ID ${sender.telegram_user_id}`}
                className="rounded p-2 text-rose-600 hover:bg-rose-100 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {senders.length === 0 && <p className="text-sm text-slate-400">Пока нет разрешённых Telegram ID.</p>}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Черновики из Telegram</h3>
            <p className="text-sm text-slate-500">Ничего не публикуется без проверки администратора.</p>
          </div>
          <button onClick={loadInbox} className="text-sm font-semibold text-indigo-600 hover:underline">Обновить</button>
        </div>
        {drafts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Входящих черновиков пока нет.
          </div>
        ) : drafts.map(draft => {
          const suggestions = extractTelegramDraft(draft.message_text);
          return (
            <article key={draft.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>{draft.source_channel || 'Пересланное сообщение'} · от {draft.sender_name || draft.telegram_sender_id}</span>
                <span>{new Date(draft.created_at).toLocaleString()}</span>
              </div>
              <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 font-sans text-sm text-slate-700">{draft.message_text}</pre>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>Заголовок: {suggestions.title || 'не найден'}</span>
                <span>Дедлайн: {suggestions.deadline || 'не распознан - проверьте вручную'}</span>
                <span>Ссылка: {suggestions.link || 'не найдена'}</span>
              </div>
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <button
                  onClick={() => rejectDraft(draft)}
                  disabled={working}
                  className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  Отклонить
                </button>
                <button
                  onClick={() => onSelectDraft(draft, suggestions)}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  <Send className="h-3.5 w-3.5" /> Проверить и оформить
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
