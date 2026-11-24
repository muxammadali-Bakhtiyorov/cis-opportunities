import React, { useEffect, useState } from 'react';
import {
  Bookmark,
  Check,
  Clock,
  Compass,
  ExternalLink,
  Lock,
  Mail,
  MessageCircle,
  Shield,
  Trash2,
  UserCheck
} from 'lucide-react';
import {
  FORMAT_OPTIONS,
  GOAL_OPTIONS,
  STAGE_OPTIONS,
  buildRecommendationPlan
} from '../lib/admissionsKnowledge';

const PRIORITY_OPTIONS = [
  ['high', 'Высокий приоритет'],
  ['medium', 'Средний приоритет'],
  ['low', 'Запасной вариант']
];

const EMPTY_DEMOGRAPHICS = {
  fullName: '',
  age: '',
  countryCity: '',
  citizenship: '',
  schoolGrade: '',
  languagesAndScores: '',
  bio: ''
};

export default function StudentProfilePanel({
  authUser,
  isAdmin = false,
  onOpenAdmin,
  demographicInfo,
  onSaveDemographicInfo,
  studentProfile,
  completedChecklist = {},
  onToggleChecklistItem,
  onOpenQuiz,
  onOpenAuth,
  activities = [],
  favorites = {},
  onUpdateFavoritePriority,
  onRemoveFavorite,
  onOpenCatalog,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  passwordSubmitting,
  resetEmailSubmitting,
  accountMessage,
  accountError,
  onPasswordChange,
  onPasswordResetEmail
}) {
  const [demoForm, setDemoForm] = useState(() => ({
    ...EMPTY_DEMOGRAPHICS,
    ...(demographicInfo || {})
  }));
  const [demoSavedNotice, setDemoSavedNotice] = useState(false);

  useEffect(() => {
    setDemoForm(prev => ({
      ...EMPTY_DEMOGRAPHICS,
      ...prev,
      ...(demographicInfo || {}),
      fullName: (demographicInfo?.fullName ?? prev.fullName) || authUser?.user_metadata?.full_name || ''
    }));
  }, [demographicInfo, authUser]);

  const handleDemoSubmit = e => {
    e.preventDefault();
    onSaveDemographicInfo(demoForm);
    setDemoSavedNotice(true);
    setTimeout(() => setDemoSavedNotice(false), 2500);
  };

  const plan = studentProfile ? buildRecommendationPlan(studentProfile) : null;
  const savedActivities = activities.filter(item => Boolean(favorites[item.id]));
  const sortedSaved = [...savedActivities].sort((a, b) => {
    const rank = { high: 0, medium: 1, low: 2 };
    return (rank[favorites[a.id]] ?? 1) - (rank[favorites[b.id]] ?? 1);
  });

  const checklistDoneCount = plan
    ? plan.checklist.filter((_, idx) => Boolean(completedChecklist[`${plan.country.id}-${plan.major.id}-${idx}`])).length
    : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="space-y-6 lg:col-span-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-indigo-700" />
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Личные данные (Демография)</h2>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Заполните базовую информацию о себе — пригодится для заявок, стипендий и сохранения профиля.
              </p>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 whitespace-nowrap shrink-0 md:hidden"
              >
                <Shield className="h-4 w-4 text-indigo-700" />
                Админ-панель
              </button>
            )}
          </div>

          <form onSubmit={handleDemoSubmit} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="demo-name" className="mb-1 block text-xs font-medium text-slate-600">
                  Имя и фамилия
                </label>
                <input
                  id="demo-name"
                  type="text"
                  value={demoForm.fullName}
                  onChange={e => setDemoForm(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Например: Алишер Каримов"
                  className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
              <div>
                <label htmlFor="demo-age" className="mb-1 block text-xs font-medium text-slate-600">
                  Возраст
                </label>
                <input
                  id="demo-age"
                  type="text"
                  inputMode="numeric"
                  value={demoForm.age}
                  onChange={e => setDemoForm(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Например: 17 лет"
                  className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
              <div>
                <label htmlFor="demo-city" className="mb-1 block text-xs font-medium text-slate-600">
                  Страна и город проживания
                </label>
                <input
                  id="demo-city"
                  type="text"
                  value={demoForm.countryCity}
                  onChange={e => setDemoForm(prev => ({ ...prev, countryCity: e.target.value }))}
                  placeholder="Например: Ташкент, Узбекистан"
                  className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
              <div>
                <label htmlFor="demo-citizenship" className="mb-1 block text-xs font-medium text-slate-600">
                  Гражданство
                </label>
                <input
                  id="demo-citizenship"
                  type="text"
                  value={demoForm.citizenship}
                  onChange={e => setDemoForm(prev => ({ ...prev, citizenship: e.target.value }))}
                  placeholder="Например: Узбекистан / Казахстан"
                  className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
              <div>
                <label htmlFor="demo-school" className="mb-1 block text-xs font-medium text-slate-600">
                  Школа / Вуз и класс (курс)
                </label>
                <input
                  id="demo-school"
                  type="text"
                  value={demoForm.schoolGrade}
                  onChange={e => setDemoForm(prev => ({ ...prev, schoolGrade: e.target.value }))}
                  placeholder="Например: 11 класс, лицей"
                  className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
              <div>
                <label htmlFor="demo-scores" className="mb-1 block text-xs font-medium text-slate-600">
                  Языки и тесты (IELTS, SAT и др.)
                </label>
                <input
                  id="demo-scores"
                  type="text"
                  value={demoForm.languagesAndScores}
                  onChange={e => setDemoForm(prev => ({ ...prev, languagesAndScores: e.target.value }))}
                  placeholder="Например: IELTS 7.5, SAT 1460"
                  className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="demo-bio" className="mb-1 block text-xs font-medium text-slate-600">
                Коротко о себе и целях
              </label>
              <textarea
                id="demo-bio"
                rows="2"
                value={demoForm.bio}
                onChange={e => setDemoForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Интересы, проекты, планируемый год поступления..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="min-h-[44px] rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 whitespace-nowrap shrink-0"
              >
                Сохранить профиль
              </button>
              {demoSavedNotice && (
                <span role="status" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <Check className="h-4 w-4" />
                  Данные сохранены
                </span>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Трек поступления и чек-лист</h2>
              <p className="mt-1 text-sm text-slate-600">
                Ваша целевая страна, специальность и персональный план подготовки.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenQuiz}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-800 whitespace-nowrap shrink-0"
            >
              <Compass className="h-4 w-4" />
              {studentProfile ? 'Обновить цели' : 'Пройти подбор'}
            </button>
          </div>

          {plan ? (
            <div className="mt-5 space-y-5">
              <div className="grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-slate-500">Целевая страна</div>
                  <div className="mt-0.5 text-sm font-bold text-slate-900">{plan.country.name}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Направление (Major)</div>
                  <div className="mt-0.5 text-sm font-bold text-slate-900">{plan.major.name}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Текущий этап</div>
                  <div className="mt-0.5 text-sm font-semibold text-slate-800">
                    {STAGE_OPTIONS.find(s => s.id === studentProfile.stage)?.label || plan.stage.label}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Главный фокус и формат</div>
                  <div className="mt-0.5 text-sm font-semibold text-slate-800">
                    {GOAL_OPTIONS.find(g => g.id === studentProfile.goal)?.label || plan.goal.label}
                    {' · '}
                    {FORMAT_OPTIONS.find(f => f.id === studentProfile.format)?.label || studentProfile.format}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-bold text-slate-900">Чек-лист подготовки</h3>
                  <span className="text-xs font-medium text-slate-500 tabular-nums">
                    Выполнено {checklistDoneCount} из {plan.checklist.length}
                  </span>
                </div>
                <ul className="mt-3 space-y-2.5">
                  {plan.checklist.map((stepText, idx) => {
                    const key = `${plan.country.id}-${plan.major.id}-${idx}`;
                    const checked = Boolean(completedChecklist[key]);
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => onToggleChecklistItem(key)}
                          className={`flex min-h-[44px] w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left text-sm transition-colors ${
                            checked
                              ? 'border-emerald-200 bg-emerald-50/50 text-slate-500 line-through'
                              : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                              checked
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {checked && <Check className="h-3 w-3" />}
                          </span>
                          <span>{stepText}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-800">Трек поступления ещё не выбран</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Ответьте на 5 коротких вопросов: куда поступаете, на какой Major и какой формат ищете — мы соберём персональную стратегию, список активностей и стипендии.
              </p>
              <button
                type="button"
                onClick={onOpenQuiz}
                className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-indigo-700 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-800"
              >
                Начать подбор за 1 минуту
              </button>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Моё портфолио активностей</h2>
              <p className="mt-1 text-sm text-slate-600">
                Отмечайте приоритет для подачи в Common App, UCAS или резюме.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-600 tabular-nums">
              Сохранено: {Object.keys(favorites).length}
            </span>
          </div>

          <div className="mt-5">
            {sortedSaved.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-6 text-center">
                <Bookmark className="mx-auto h-9 w-9 text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-slate-700">Портфолио пока пусто</p>
                <p className="mt-1 text-xs text-slate-500">
                  Сохраняйте интересные олимпиады, хакатоны и стажировки из каталога или разбора.
                </p>
                <button
                  type="button"
                  onClick={onOpenCatalog}
                  className="mt-4 min-h-[44px] rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Перейти к ивентам
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {sortedSaved.map(item => {
                  const priority = favorites[item.id] || 'medium';
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
                          <span className="font-semibold text-indigo-700">{item.category}</span>
                          {item.deadline && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="inline-flex items-center gap-1 tabular-nums">
                                <Clock className="h-3.5 w-3.5" />
                                {item.deadline}
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                        <p className="line-clamp-1 text-xs text-slate-600">{item.description}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <select
                          aria-label={`Приоритет для ${item.title}`}
                          value={priority}
                          onChange={e => onUpdateFavoritePriority(item.id, e.target.value)}
                          className="min-h-[44px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                          {PRIORITY_OPTIONS.map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>

                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                          >
                            Сайт
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => onRemoveFavorite(item.id)}
                          aria-label={`Удалить ${item.title} из портфолио`}
                          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-rose-600 transition-colors hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      <aside className="space-y-6 lg:col-span-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">Поддержка и контакты</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            Есть вопрос по мероприятиям, хотите предложить ивент или нужна помощь по платформе — напишите напрямую:
          </p>

          <div className="mt-4 space-y-2.5">
            <a
              href="https://t.me/MywayMuhammadali"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-indigo-300 hover:bg-indigo-50/60"
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <MessageCircle className="h-4 w-4 shrink-0 text-indigo-700" />
                <span className="truncate">@MywayMuhammadali</span>
              </span>
              <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
            </a>

            <a
              href="mailto:tashkentmuxammadali@gmail.com"
              className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-indigo-300 hover:bg-indigo-50/60"
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Mail className="h-4 w-4 shrink-0 text-indigo-700" />
                <span className="truncate">tashkentmuxammadali@gmail.com</span>
              </span>
              <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
            </a>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="text-xs font-medium text-slate-500">Наш проект и аналитика</p>
            <a
              href="https://SwapInsight.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              <span>SwapInsight.vercel.app</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </section>

        {authUser ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-slate-500" />
              <h2 className="text-lg font-bold text-slate-900">Аккаунт</h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Профиль, демография и портфолио сохраняются для вашего аккаунта.
            </p>

            <div className="mt-4">
              <label htmlFor="account-email" className="mb-1 block text-xs font-medium text-slate-600">
                Электронная почта
              </label>
              <input
                id="account-email"
                type="email"
                readOnly
                value={authUser.email || ''}
                className="min-h-[44px] w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
              />
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              Пароль нельзя посмотреть: Supabase не хранит его в читаемом виде. Здесь можно задать новый пароль.
            </p>

            <form onSubmit={onPasswordChange} className="mt-4 space-y-3">
              {accountError && (
                <p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700">
                  {accountError}
                </p>
              )}
              {accountMessage && (
                <p role="status" className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700">
                  {accountMessage}
                </p>
              )}
              <div>
                <label htmlFor="new-password" className="mb-1 block text-xs font-medium text-slate-600">
                  Новый пароль
                </label>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="mb-1 block text-xs font-medium text-slate-600">
                  Повторите новый пароль
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="submit"
                  disabled={passwordSubmitting || resetEmailSubmitting}
                  className="min-h-[44px] w-full rounded-xl bg-indigo-700 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {passwordSubmitting ? 'Сохранение...' : 'Изменить пароль'}
                </button>
                <button
                  type="button"
                  onClick={onPasswordResetEmail}
                  disabled={passwordSubmitting || resetEmailSubmitting}
                  className="min-h-[44px] w-full rounded-xl px-4 py-2 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {resetEmailSubmitting ? 'Отправка письма...' : 'Не работает? Отправить ссылку для сброса'}
                </button>
              </div>
            </form>
          </section>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Синхронизация профиля</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Сейчас ваш трек поступления, личные данные и избранные активности сохраняются в браузере. Войдите в аккаунт, чтобы синхронизировать профиль между устройствами.
            </p>
            <button
              type="button"
              onClick={onOpenAuth}
              className="mt-4 min-h-[44px] w-full rounded-xl bg-indigo-700 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-800"
            >
              Войти или создать аккаунт
            </button>
          </section>
        )}
      </aside>
    </div>
  );
}
