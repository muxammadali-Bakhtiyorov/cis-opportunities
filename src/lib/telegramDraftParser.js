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

const countryPatterns = [
  ['Казахстан', /казахстан(?:а|е|у|ом)?/iu],
  ['Узбекистан', /узбекистан(?:а|е|у|ом)?/iu],
  ['Россия', /росси(?:я|и|ю|ей)/iu],
  ['Кыргызстан', /кыргызстан(?:а|е|у|ом)?|киргизия|киргизии/iu],
  ['Таджикистан', /таджикистан(?:а|е|у|ом)?/iu],
  ['Туркменистан', /туркменистан(?:а|е|у|ом)?/iu],
  ['Беларусь', /беларус(?:ь|и|ью)/iu],
  ['Армения', /армени(?:я|и|ю|ей)/iu],
  ['Азербайджан', /азербайджан(?:а|е|у|ом)?/iu],
  ['Грузия', /грузи(?:я|и|ю|ей)/iu]
];

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
    String.raw`(?:дедлайн|срок\s+подачи|последний\s+день|заявки?\s+(?:принимаются|до)|регистрация\s+до|при[её]м(?:\s+заявок)?\s+до|до|deadline|apply\s+by|register\s+by)\s*[:—–-]?\s*(${datePattern})`,
    'iu'
  );
  const match = text.match(marker);
  return match ? parseDate(match[1]) : '';
}

function safeHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
}

export function extractTelegramLinks(message, entities = []) {
  const text = String(message || '');
  const links = [];

  for (const entity of Array.isArray(entities) ? entities : []) {
    if (!['text_link', 'url'].includes(entity?.type)) continue;
    const offset = Number(entity.offset);
    const length = Number(entity.length);
    if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(length) || offset < 0 || length < 1) continue;

    const label = text.slice(offset, offset + length);
    const url = safeHttpUrl(entity.type === 'text_link' ? entity.url : label);
    if (!url || !label) continue;
    links.push({ url, offset, length, label });
  }

  const plainUrlPattern = /https?:\/\/[^\s<>]+/gi;
  for (const match of text.matchAll(plainUrlPattern)) {
    const rawUrl = match[0].replace(/[),.!?;:]+$/, '');
    const url = safeHttpUrl(rawUrl);
    if (!url) continue;
    const offset = match.index;
    const length = rawUrl.length;
    const overlaps = links.some(link => offset < link.offset + link.length && offset + length > link.offset);
    if (!overlaps) links.push({ url, offset, length, label: text.slice(offset, offset + length) });
  }

  return links.sort((a, b) => a.offset - b.offset);
}

function inferCategory(text) {
  if (/хакатон|hackathon/iu.test(text)) return 'Хакатон';
  if (/олимпиад|olympiad/iu.test(text)) return 'Олимпиада';
  if (/волонт[её]р|volunteer/iu.test(text)) return 'Волонтерство';
  if (/стажиров|интернатур|internship/iu.test(text)) return 'Стажировка';
  if (/грант|стипенди/iu.test(text)) return 'Грант / стипендия';
  if (/форум|forum/iu.test(text)) return 'Форум';
  if (/конференц|conference/iu.test(text)) return 'Конференция';
  if (/курс|обучени|course/iu.test(text)) return 'Курс';
  if (/конкурс|соревнован|competition|contest/iu.test(text)) return 'Конкурс';
  return 'Другое';
}

function extractAge(text) {
  const marker = /(?:возраст(?: участников|ная группа|ная категория)?|для участников|участникам)\s*[:—–-]?\s*(?:от\s*)?(\d{1,2}\s*(?:(?:до|[-–—])\s*\d{1,2})?\s*(?:лет|года|год)?\s*\+?)/iu;
  const match = text.match(marker)
    || text.match(/(\d{1,2}\s*(?:до|[-–—])\s*\d{1,2}\s*(?:лет|года|год))/iu);
  if (!match) return '';

  let age = match[1].replace(/\s+/g, ' ').trim().replace(/(\d)\s*[-—]\s*(\d)/, '$1–$2');
  if (!/(?:лет|года|год|\+)$/iu.test(age)) age += ' лет';
  return age;
}

function extractCountry(text) {
  const marker = text.match(/(?:страна(?:\s+проведения|\s+участия)?|участники\s+из|для\s+участников\s+из|граждане)\s*[:—–-]?\s*([^\n,;.!]+)/iu);
  if (!marker) return '';
  return countryPatterns.find(([, pattern]) => pattern.test(marker[1]))?.[0] || '';
}

export function extractTelegramDraft(message, entities = []) {
  const text = String(message || '').trim();
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const title = (lines.find(line => !/^https?:\/\//i.test(line)) || '').replace(/^[-*•#\s]+/, '').slice(0, 180);
  const links = extractTelegramLinks(text, entities);

  return {
    title,
    category: inferCategory(text),
    deadline: extractDeadline(text),
    age: extractAge(text),
    location: extractCountry(text),
    link: links[0]?.url || '',
    links
  };
}
