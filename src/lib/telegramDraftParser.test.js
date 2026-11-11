import test from 'node:test';
import assert from 'node:assert/strict';
import { extractTelegramDraft } from './telegramDraftParser.js';

test('extracts a deadline after a Russian deadline marker and a link', () => {
  assert.deepEqual(
    extractTelegramDraft('Олимпиада по математике\nРегистрация до 15 мая 2027\nПодробности: https://example.org/apply.'),
    {
      title: 'Олимпиада по математике',
      category: 'Олимпиада',
      deadline: '2027-05-15',
      link: 'https://example.org/apply'
    }
  );
});

test('does not guess a deadline from an unmarked date', () => {
  assert.equal(extractTelegramDraft('Форум пройдет 05.06.2027').deadline, '');
});

test('rejects invalid calendar dates', () => {
  assert.equal(extractTelegramDraft('Deadline: 31.02.2027').deadline, '');
});
