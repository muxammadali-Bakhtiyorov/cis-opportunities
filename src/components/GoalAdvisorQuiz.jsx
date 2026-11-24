import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Compass,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import {
  COUNTRIES,
  FORMAT_OPTIONS,
  GOAL_OPTIONS,
  MAJORS,
  STAGE_OPTIONS,
  buildRecommendationPlan,
  matchActivitiesToProfile
} from '../lib/admissionsKnowledge';

const TOTAL_STEPS = 5;

const DEFAULT_ANSWERS = {
  country: 'usa',
  major: 'cs',
  stage: 'school_senior',
  goal: 'projects',
  format: 'Любой'
};

export default function GoalAdvisorQuiz({
  savedProfile,
  onSaveProfile,
  activities = [],
  favorites = {},
  onToggleFavorite,
  onFilterCatalogByCategory,
  onOpenScholarships
}) {
  const [answers, setAnswers] = useState(() => savedProfile || DEFAULT_ANSWERS);
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(() => Boolean(savedProfile));

  useEffect(() => {
    if (savedProfile) {
      setAnswers(savedProfile);
    }
  }, [savedProfile]);

  const handleSelect = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleFinish = () => {
    const completed = {
      ...answers,
      updatedAt: new Date().toISOString()
    };
    onSaveProfile(completed);
    setShowResults(true);
  };

  const handleRetake = () => {
    setStep(1);
    setShowResults(false);
  };

  const plan = buildRecommendationPlan(answers);
  const matchedActivities = matchActivitiesToProfile(activities, answers);

  if (showResults) {
    return (
      <div className="space-y-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium text-indigo-700">Персональный профиль поступления</p>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {plan.country.name} · {plan.major.name}
              </h2>
              <p className="text-sm text-slate-600">
                {plan.stage.label} · Фокус: {plan.goal.label} · Формат: {answers.format}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleRetake}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                <RotateCcw className="h-4 w-4" />
                Изменить ответы
              </button>
              <button
                type="button"
                onClick={() => onFilterCatalogByCategory('Все')}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 whitespace-nowrap shrink-0"
              >
                Перейти в каталог
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 border-t border-slate-200 pt-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                Стратегия отбора: {plan.country.philosophy}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">{plan.country.summary}</p>
              <ul className="space-y-2 pt-1">
                {plan.country.whatMattersMost.map((point, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-700" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-slate-50 p-5 space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Экзамены и финансирование</h4>
              <p className="text-xs leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-800">Тесты: </span>
                {plan.country.admissionsTests}
              </p>
              <p className="text-xs leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-800">Гранты: </span>
                {plan.country.financialAidNote}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Какие активности подойдут лучше всего для {plan.major.shortName}
              </h3>
              <p className="text-sm text-slate-600">
                Приоритетные форматы для поступления в {plan.country.name}, которые формируют сильный профиль.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {plan.blueprints.map(bp => (
              <article
                key={bp.title}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-indigo-700">{bp.category}</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{bp.title}</h4>
                  <p className="text-sm leading-relaxed text-slate-600">{bp.whyItMatters}</p>
                  {bp.targetOutcome && (
                    <p className="text-xs leading-relaxed text-slate-600">
                      <span className="font-semibold text-slate-800">Что положить в портфолио: </span>
                      {bp.targetOutcome}
                    </p>
                  )}
                  {bp.countryTip && (
                    <p className="text-xs leading-relaxed text-indigo-800 bg-indigo-50/70 rounded-lg px-3 py-2">
                      {bp.countryTip}
                    </p>
                  )}
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => onFilterCatalogByCategory(bp.category)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900"
                  >
                    Смотреть «{bp.category}» в каталоге
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Подходящие объявления из каталога сейчас
              </h3>
              <p className="text-sm text-slate-600">
                Отсортированы по совпадению с вашим направлением, страной и возрастом.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500 tabular-nums">
              Найдено совпадений: {matchedActivities.length}
            </span>
          </div>

          {matchedActivities.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {matchedActivities.map(({ activity, reasons }) => {
                const isFav = Boolean(favorites[activity.id]);
                return (
                  <article
                    key={activity.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-xs font-medium text-slate-500">
                          <span className="font-semibold text-indigo-700">{activity.category}</span>
                          {activity.format && (
                            <>
                              <span className="mx-1.5" aria-hidden="true">·</span>
                              <span>{activity.format}</span>
                            </>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => onToggleFavorite(activity.id)}
                          aria-label={isFav ? 'Убрать из портфолио' : 'Добавить в портфолио'}
                          className={`rounded-lg p-2 transition-colors ${
                            isFav
                              ? 'bg-amber-50 text-amber-600'
                              : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                          }`}
                        >
                          <Bookmark className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <h4 className="mt-2 text-base font-bold leading-snug text-slate-900">
                        {activity.title}
                      </h4>
                      <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                        {activity.description}
                      </p>

                      {reasons.length > 0 && (
                        <ul className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-600">
                          {reasons.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs">
                      <span className="text-slate-500 tabular-nums">
                        {activity.deadline ? `До ${activity.deadline}` : activity.age || 'Открыт набор'}
                      </span>
                      {activity.link ? (
                        <a
                          href={activity.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-700 px-3.5 py-2 font-semibold text-white transition-colors hover:bg-indigo-800 whitespace-nowrap shrink-0"
                        >
                          Регистрация
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="text-slate-400">Ссылка ожидается</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <Compass className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-slate-800">
                В текущем каталоге пока нет открытых объявлений точно под эти параметры
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Новые хакатоны, Game Jams и олимпиады регулярно добавляются администраторами из Telegram-каналов.
              </p>
              <button
                type="button"
                onClick={() => onFilterCatalogByCategory('Все')}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Открыть весь каталог
              </button>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Стипендии и финансирование: {plan.country.name}
              </h3>
              <p className="text-sm text-slate-600">
                Основные грантовые программы для абитуриентов и студентов из стран СНГ.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenScholarships(plan.country.id)}
              className="text-xs font-semibold text-indigo-700 hover:underline whitespace-nowrap shrink-0"
            >
              Все стипендии по странам →
            </button>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            {plan.relevantScholarships.map(item => (
              <div key={item.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-slate-500">
                    <span>{item.regionLabel}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>{item.level}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span className="tabular-nums">{item.deadlineWindow}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-600">{item.coverage}</p>
                </div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 sm:self-center"
                >
                  Сайт программы
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <p className="text-xs font-medium text-indigo-700 tabular-nums">
              Шаг {step} из {TOTAL_STEPS}
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Подбор активностей под цель поступления
            </h2>
          </div>
          {savedProfile && (
            <button
              type="button"
              onClick={() => setShowResults(true)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 whitespace-nowrap shrink-0"
            >
              Вернуться к результатам
            </button>
          )}
        </div>

        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-indigo-700 transition-all duration-200"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        <div className="mt-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">1. Куда вы планируете поступать?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  В разных странах приёмные комиссии ценят разные типы внеучебных активностей.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {COUNTRIES.map(country => {
                  const selected = answers.country === country.id;
                  return (
                    <button
                      key={country.id}
                      type="button"
                      onClick={() => handleSelect('country', country.id)}
                      className={`rounded-xl border p-4 text-left transition-colors ${
                        selected
                          ? 'border-indigo-700 bg-indigo-50/60'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">{country.name}</span>
                        {selected && <Check className="h-4 w-4 text-indigo-700" />}
                      </div>
                      <p className="mt-1 text-xs font-medium text-indigo-700">{country.philosophy}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">2. Какое направление (Major) вам интересно?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Подберём форматы активностей, которые доказывают ваш интерес именно к этой специальности.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {MAJORS.map(major => {
                  const selected = answers.major === major.id;
                  return (
                    <button
                      key={major.id}
                      type="button"
                      onClick={() => handleSelect('major', major.id)}
                      className={`rounded-xl border p-4 text-left transition-colors ${
                        selected
                          ? 'border-indigo-700 bg-indigo-50/60'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">{major.name}</span>
                        {selected && <Check className="h-4 w-4 text-indigo-700" />}
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{major.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">3. На каком этапе обучения вы сейчас?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Учитываем возрастные ограничения мероприятий и подходящий уровень программ.
                </p>
              </div>
              <div className="space-y-3">
                {STAGE_OPTIONS.map(option => {
                  const selected = answers.stage === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelect('stage', option.id)}
                      className={`w-full rounded-xl border p-4 text-left transition-colors ${
                        selected
                          ? 'border-indigo-700 bg-indigo-50/60'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">{option.label}</span>
                        {selected && <Check className="h-4 w-4 text-indigo-700" />}
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">4. Что сейчас важнее всего усилить в портфолио?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Это поможет расставить приоритеты между практикой, олимпиадами, лидерством и грантами.
                </p>
              </div>
              <div className="space-y-3">
                {GOAL_OPTIONS.map(option => {
                  const selected = answers.goal === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelect('goal', option.id)}
                      className={`w-full rounded-xl border p-4 text-left transition-colors ${
                        selected
                          ? 'border-indigo-700 bg-indigo-50/60'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">{option.label}</span>
                        {selected && <Check className="h-4 w-4 text-indigo-700" />}
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">5. Какой формат участия удобнее?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Учтём при ранжировании активностей из каталога.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {FORMAT_OPTIONS.map(option => {
                  const selected = answers.format === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelect('format', option.id)}
                      className={`rounded-xl border p-4 text-left transition-colors ${
                        selected
                          ? 'border-indigo-700 bg-indigo-50/60'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">{option.label}</span>
                        {selected && <Check className="h-4 w-4 text-indigo-700" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </button>

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={() => setStep(s => Math.min(TOTAL_STEPS, s + 1))}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 whitespace-nowrap shrink-0"
            >
              Далее
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 whitespace-nowrap shrink-0"
            >
              Показать рекомендации
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
