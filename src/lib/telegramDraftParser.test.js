import test from 'node:test';
import assert from 'node:assert/strict';
import { extractTelegramDraft } from './telegramDraftParser.js';

test('extracts a deadline after a Russian deadline marker and a link', () => {
  const message = 'Олимпиада по математике\nРегистрация до 15 мая 2027\nПодробности: https://example.org/apply.';
  const url = 'https://example.org/apply';
  assert.deepEqual(
    extractTelegramDraft(message),
    {
      title: 'Олимпиада по математике',
      category: 'Олимпиада',
      deadline: '2027-05-15',
      age: '',
      location: '',
      link: url,
      links: [{
        url,
        offset: message.indexOf(url),
        length: url.length,
        label: url
      }]
    }
  );
});

test('does not guess a deadline from an unmarked date', () => {
  assert.equal(extractTelegramDraft('Форум пройдет 05.06.2027').deadline, '');
});

test('rejects invalid calendar dates', () => {
  assert.equal(extractTelegramDraft('Deadline: 31.02.2027').deadline, '');
});

test('uses Russian keywords and Telegram text-link entities for suggestions', () => {
  const message = 'Хакатон для школьников\nРегистрация до 15 мая 2027\nВозраст: 14–18 лет\nСтрана: Казахстан\nНажмите здесь';
  const offset = message.indexOf('здесь');
  const draft = extractTelegramDraft(message, [{
    type: 'text_link',
    offset,
    length: 'здесь'.length,
    url: 'https://example.org/register'
  }]);

  assert.equal(draft.category, 'Хакатон');
  assert.equal(draft.deadline, '2027-05-15');
  assert.equal(draft.age, '14–18 лет');
  assert.equal(draft.location, 'Казахстан');
  assert.equal(draft.link, 'https://example.org/register');
  assert.equal(draft.links[0].label, 'здесь');
});

test('does not classify a regular post as an olympiad by default', () => {
  assert.equal(extractTelegramDraft('Новости молодежного центра').category, 'Другое');
});
