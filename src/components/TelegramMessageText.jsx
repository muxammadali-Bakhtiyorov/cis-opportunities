import React from 'react';
import { extractTelegramLinks } from '../lib/telegramDraftParser';

export default function TelegramMessageText({ text, entities = [], className = '' }) {
  const message = String(text || '');
  const links = extractTelegramLinks(message, entities);
  const content = [];
  let cursor = 0;

  links.forEach((link, index) => {
    if (link.offset < cursor) return;
    content.push(message.slice(cursor, link.offset));
    content.push(
      <a
        key={`${link.offset}-${index}`}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-700 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-900"
      >
        {message.slice(link.offset, link.offset + link.length)}
      </a>
    );
    cursor = link.offset + link.length;
  });
  content.push(message.slice(cursor));

  return <div className={`whitespace-pre-wrap break-words ${className}`}>{content}</div>;
}
