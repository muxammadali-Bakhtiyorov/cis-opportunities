const monthNames = {
  jan: 1, january: 1, январь: 1, января: 1, январе: 1,
  feb: 2, february: 2, февраль: 2, февраля: 2, феврале: 2,
  mar: 3, march: 3, март: 3, марта: 3, марте: 3,
  apr: 4, april: 4, апрель: 4, апреля: 4, апреле: 4,
  may: 5, май: 5, мая: 5, мае: 5,
  jun: 6, june: 6, июнь: 6, июня: 6, июне: 6,
  jul: 7, july: 7, июль: 7, июля: 7, июле: 7,
  aug: 8, august: 8, август: 8, августа: 8, августе: 8,
  sep: 9, september: 9, сентябрь: 9, сентября: 9, сентябре: 9,
  oct: 10, october: 10, октябрь: 10, октября: 10, октябре: 10,
  nov: 11, november: 11, ноябрь: 11, ноября: 11, ноябре: 11,
  dec: 12, december: 12, декабрь: 12, декабря: 12, декабре: 12
};

const datePattern = String.raw`(?:\d{4}-\d{1,2}-\d{1,2}|\d{1,2}[./-]\d{1,2}[./-]\d{2,4}|\d{1,2}\s+(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|январ(?:я|ь|е)?|феврал(?:я|ь|е)?|март(?:а|е)?|апрел(?:я|ь|е)?|ма[йяе]|июн(?:я|ь|е)?|июл(?:я|ь|е)?|август(?:а|е)?|сентябр(?:я|ь|е)?|октябр(?:я|ь|е)?|ноябр(?:я|ь|е)?|декабр(?:я|ь|е)?)\s+\d{4})`;

function toIsoDate(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return '';
  }
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseDate(value) {
  const iso = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) return toIsoDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));

  const numeric = value.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
  if (numeric) {
    const year = Number(numeric[3].length === 2 ? `20${numeric[3]}` : numeric[3]);
    return toIsoDate(year, Number(numeric[2]), Number(numeric[1]));
  }

  const named = value.match(/^(\d{1,2})\s+([^\s]+)\s+(\d{4})$/iu);
  if (named) {
    const monthName = named[2].toLocaleLowerCase('ru-RU').replace(/[.,]$/, '');
    const month = monthNames[monthName] || monthNames[monthName.slice(0, 3)];
    return month ? toIsoDate(Number(named[3]), month, Number(named[1])) : '';
  }

  return '';
}

function extractDeadline(text) {
  const marker = new RegExp(
    String.raw`(?:дедлайн|регистрация\s+до|при[её]м\s+до|до|deadline|apply\s+by|register\s+by)\s*[:—–-]?\s*(${datePattern})`,
    'iu'
  );
  const match = text.match(marker);
  return match ? parseDate(match[1]) : '';
}

function extractLink(text) {
  const match = text.match(/https?:\/\/[^\s<>]+/i);
  return match ? match[0].replace(/[),.!?;:]+$/, '') : '';
}

function inferCategory(text) {
  if (/(олимпиад|olympiad)/i.test(text)) return 'Олимпиада';
  if (/(волонт|volunteer)/i.test(text)) return 'Волонтерство';
  if (/(стажиров|internship)/i.test(text)) return 'Стажировка';
  if (/(конкурс|competition|contest)/i.test(text)) return 'Конкурс';
  return 'Олимпиада';
}

export function extractTelegramDraft(message) {
  const text = String(message || '').trim();
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const title = (lines.find(line => !/^https?:\/\//i.test(line)) || '').replace(/^[-*•#\s]+/, '').slice(0, 180);

  return {
    title,
    category: inferCategory(text),
    deadline: extractDeadline(text),
    link: extractLink(text)
  };
}
