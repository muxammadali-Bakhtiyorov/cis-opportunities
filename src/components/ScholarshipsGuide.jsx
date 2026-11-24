import React, { useEffect, useState } from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { COUNTRIES, SCHOLARSHIPS } from '../lib/admissionsKnowledge';

export default function ScholarshipsGuide({ initialCountry = 'all', onStartQuiz }) {
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    setSelectedCountry(initialCountry || 'all');
  }, [initialCountry]);

  const filteredScholarships = SCHOLARSHIPS.filter(item => {
    const matchesCountry = selectedCountry === 'all' || item.countryId === selectedCountry;
    const matchesLevel =
      selectedLevel === 'all' ||
      (selectedLevel === 'bachelor' && item.level.toLowerCase().includes('бакалавр')) ||
      (selectedLevel === 'master' && item.level.toLowerCase().includes('магистр'));
    return matchesCountry && matchesLevel;
  });

  const activeCountryGuide =
    selectedCountry !== 'all' ? COUNTRIES.find(c => c.id === selectedCountry) : null;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Стипендии и правила отбора по странам
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Сравнение систем поступления (США, Великобритания, ЕС, Азия, Канада, СНГ) и ключевых грантовых программ, доступных студентам из стран СНГ.
            </p>
          </div>
          <button
            type="button"
            onClick={onStartQuiz}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 whitespace-nowrap shrink-0"
          >
            Подобрать под мой профиль
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCountry('all')}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                selectedCountry === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Все страны
            </button>
            {COUNTRIES.map(country => (
              <button
                key={country.id}
                type="button"
                onClick={() => setSelectedCountry(country.id)}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  selectedCountry === country.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {country.shortName}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 self-start">
            {[
              ['all', 'Все уровни'],
              ['bachelor', 'Бакалавриат'],
              ['master', 'Магистратура']
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedLevel(value)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedLevel === value
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeCountryGuide ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
            <Globe className="h-4 w-4" />
            <span>{activeCountryGuide.name} · {activeCountryGuide.philosophy}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{activeCountryGuide.summary}</p>
          <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900">На что смотрят комиссии</h3>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                {activeCountryGuide.whatMattersMost.map((point, idx) => (
                  <li key={idx}>• {point}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <p>
                <span className="font-bold text-slate-900">Экзамены: </span>
                {activeCountryGuide.admissionsTests}
              </p>
              <p>
                <span className="font-bold text-slate-900">Финансирование: </span>
                {activeCountryGuide.financialAidNote}
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-3">
          {COUNTRIES.slice(0, 3).map(country => (
            <article key={country.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-semibold text-indigo-700">{country.name}</div>
              <h3 className="mt-1 text-base font-bold text-slate-900">{country.philosophy}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{country.summary}</p>
              <button
                type="button"
                onClick={() => setSelectedCountry(country.id)}
                className="mt-3 text-xs font-semibold text-indigo-700 hover:underline"
              >
                Стипендии: {country.shortName} →
              </button>
            </article>
          ))}
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Проверенные программы финансирования</h3>
          <span className="text-xs text-slate-500 tabular-nums">
            Показано: {filteredScholarships.length}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredScholarships.map(item => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="space-y-2.5">
                <div className="text-xs font-medium text-slate-500">
                  <span className="font-semibold text-indigo-700">{item.regionLabel}</span>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span>{item.level}</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900">{item.name}</h4>
                <p className="text-sm leading-relaxed text-slate-600">{item.coverage}</p>
                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Окно подачи: </span>
                  <span className="tabular-nums">{item.deadlineWindow}</span>
                </p>
                <p className="text-xs leading-relaxed text-slate-500">{item.cisNote}</p>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900"
                >
                  Официальный портал
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
