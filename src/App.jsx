import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  Clock,
  Compass,
  ExternalLink,
  LayoutGrid,
  LogOut,
  MapPin,
  Plus,
  Search,
  Shield,
  Sparkles,
  Trash2,
  User,
  Users,
  X
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import AdminUsersPanel from './components/AdminUsersPanel';
import TelegramInboxPanel from './components/TelegramInboxPanel';
import TelegramMessageText from './components/TelegramMessageText';
import GoalAdvisorQuiz from './components/GoalAdvisorQuiz';
import ScholarshipsGuide from './components/ScholarshipsGuide';
import StudentProfilePanel from './components/StudentProfilePanel';
import { ACTIVITY_CATEGORIES } from './lib/activityCategories';
import {
  getCountryById,
  getMajorById,
  matchActivitiesToProfile
} from './lib/admissionsKnowledge';

const EMPTY_EVENT = {
  title: '',
  category: 'Олимпиада',
  customCategory: '',
  format: 'Онлайн',
  age: '14-18 лет',
  deadline: '',
  location: '',
  description: '',
  link: ''
};

const PROFILE_STORAGE_KEY = 'cis_student_profile_v1';
const CHECKLIST_STORAGE_KEY = 'cis_student_checklist_v1';
const DEMOGRAPHICS_STORAGE_KEY = 'cis_student_demographics_v1';

function readStoredJson(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activities, setActivities] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'advisor' | 'scholarships' | 'profile' | 'admin'
  const [adminSection, setAdminSection] = useState('activities');
  const [scholarshipRegion, setScholarshipRegion] = useState('all');

  const [favorites, setFavorites] = useState(() => readStoredJson('cis_favorites', {}));
  const [studentProfile, setStudentProfile] = useState(() => readStoredJson(PROFILE_STORAGE_KEY, null));
  const [demographicInfo, setDemographicInfo] = useState(() => readStoredJson(DEMOGRAPHICS_STORAGE_KEY, null));
  const [completedChecklist, setCompletedChecklist] = useState(() => readStoredJson(CHECKLIST_STORAGE_KEY, {}));
  const [sortByMatch, setSortByMatch] = useState(false);

  const [authLoading, setAuthLoading] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authMessage, setAuthMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [resetEmailSubmitting, setResetEmailSubmitting] = useState(false);
  const [accountMessage, setAccountMessage] = useState('');
  const [accountError, setAccountError] = useState('');

  // Фильтры каталога
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedFormat, setSelectedFormat] = useState('Все');

  // Модальное окно создания ивента (для админа)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingDraft, setPendingDraft] = useState(null);
  const [newEvent, setNewEvent] = useState({ ...EMPTY_EVENT });

  useEffect(() => {
    localStorage.setItem('cis_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (studentProfile) {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(studentProfile));
    }
  }, [studentProfile]);

  useEffect(() => {
    if (demographicInfo) {
      localStorage.setItem(DEMOGRAPHICS_STORAGE_KEY, JSON.stringify(demographicInfo));
    }
  }, [demographicInfo]);

  useEffect(() => {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(completedChecklist));
  }, [completedChecklist]);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      setActivitiesLoading(false);
      return;
    }

    let isMounted = true;
    const syncMetadataFromUser = user => {
      if (!user?.user_metadata) return;
      const remoteProfile = user.user_metadata.admission_profile;
      const remoteChecklist = user.user_metadata.checklist_progress;
      const remoteDemographics = user.user_metadata.demographic_info;
      if (remoteProfile && typeof remoteProfile === 'object') {
        setStudentProfile(prev => prev || remoteProfile);
      }
      if (remoteDemographics && typeof remoteDemographics === 'object') {
        setDemographicInfo(prev => prev || remoteDemographics);
      }
      if (remoteChecklist && typeof remoteChecklist === 'object') {
        setCompletedChecklist(prev => ({ ...remoteChecklist, ...prev }));
      }
    };

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (error) setErrorMessage(`Не удалось проверить сессию: ${error.message}`);
      const sessionUser = data.session?.user ?? null;
      setAuthUser(sessionUser);
      syncMetadataFromUser(sessionUser);
      setAuthLoading(false);
    };

    loadSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const sessionUser = session?.user ?? null;
      setAuthUser(sessionUser);
      syncMetadataFromUser(sessionUser);
      setAuthLoading(false);
      if (event === 'PASSWORD_RECOVERY') {
        setActiveTab('profile');
        setAccountMessage('Ссылка подтверждена. Теперь задайте новый пароль ниже.');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let isMounted = true;

    const loadActivities = async () => {
      setActivitiesLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isMounted) return;
      if (error) {
        setErrorMessage(`Не удалось загрузить активности: ${error.message}`);
      } else {
        setActivities(data);
      }
      setActivitiesLoading(false);
    };

    loadActivities();
    return () => {
      isMounted = false;
    };
  }, [authUser?.id]);

  useEffect(() => {
    if (!supabase || !authUser) {
      setIsAdmin(false);
      return;
    }

    let isMounted = true;
    setIsAdmin(false);
    const loadRole = async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (!isMounted) return;
      if (error) {
        setIsAdmin(false);
        setErrorMessage(`Не удалось проверить права доступа: ${error.message}`);
      } else {
        setIsAdmin(data?.role === 'admin');
      }
    };

    loadRole();
    return () => {
      isMounted = false;
    };
  }, [authUser]);

  useEffect(() => {
    if (!isAdmin && activeTab === 'admin') setActiveTab('catalog');
  }, [isAdmin, activeTab]);

  const handleSaveStudentProfile = async nextProfile => {
    setStudentProfile(nextProfile);
    setSortByMatch(true);
    if (supabase && authUser) {
      try {
        await supabase.auth.updateUser({
          data: { admission_profile: nextProfile }
        });
      } catch {
        // Локальное сохранение уже выполнено
      }
    }
  };

  const handleSaveDemographicInfo = async nextDemographics => {
    setDemographicInfo(nextDemographics);
    if (supabase && authUser) {
      try {
        await supabase.auth.updateUser({
          data: { demographic_info: nextDemographics }
        });
      } catch {
        // Локальное сохранение уже выполнено
      }
    }
  };

  const handleToggleChecklistItem = async key => {
    const nextChecklist = {
      ...completedChecklist,
      [key]: !completedChecklist[key]
    };
    setCompletedChecklist(nextChecklist);
    if (supabase && authUser) {
      try {
        await supabase.auth.updateUser({
          data: { checklist_progress: nextChecklist }
        });
      } catch {
        // Локальное сохранение уже выполнено
      }
    }
  };

  const handleAuthSubmit = async e => {
    e.preventDefault();
    if (!supabase) {
      setErrorMessage('Supabase не настроен. Добавьте URL проекта и publishable key в файл .env.local.');
      return;
    }

    setErrorMessage('');
    setAuthMessage('');
    setAuthSubmitting(true);
    let result;
    try {
      result = authMode === 'login'
        ? await supabase.auth.signInWithPassword({
            email: authForm.email,
            password: authForm.password
          })
        : await supabase.auth.signUp({
            email: authForm.email,
            password: authForm.password,
            options: { data: { full_name: authForm.name } }
          });
    } catch (error) {
      setErrorMessage(`Ошибка авторизации: ${error.message}`);
      setAuthSubmitting(false);
      return;
    }
    setAuthSubmitting(false);

    if (result.error) {
      setErrorMessage(`Ошибка авторизации: ${result.error.message}`);
      return;
    }

    if (authMode === 'register' && !result.data.session) {
      setAuthMessage('Проверьте почту и подтвердите адрес, чтобы войти.');
      setAuthModalOpen(false);
    } else {
      setAuthModalOpen(false);
    }
    setAuthForm({ name: '', email: '', password: '' });
  };

  const handleLogout = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) setErrorMessage(`Не удалось выйти: ${error.message}`);
  };

  const handlePasswordChange = async e => {
    e.preventDefault();
    setAccountMessage('');
    setAccountError('');

    if (newPassword.length < 6) {
      setAccountError('Новый пароль должен содержать не менее 6 символов.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setAccountError('Пароли не совпадают.');
      return;
    }
    if (!supabase) {
      setAccountError('Supabase не настроен.');
      return;
    }

    setPasswordSubmitting(true);
    let error;
    try {
      ({ error } = await supabase.auth.updateUser({ password: newPassword }));
    } catch (requestError) {
      setAccountError(`Не удалось изменить пароль: ${requestError.message}`);
      setPasswordSubmitting(false);
      return;
    }
    setPasswordSubmitting(false);

    if (error) {
      setAccountError(`Не удалось изменить пароль: ${error.message}`);
      return;
    }

    setNewPassword('');
    setConfirmPassword('');
    setAccountMessage('Пароль успешно изменён.');
  };

  const handlePasswordResetEmail = async () => {
    setAccountMessage('');
    setAccountError('');
    if (!supabase || !authUser?.email) {
      setAccountError('Не удалось определить email аккаунта для сброса пароля.');
      return;
    }

    setResetEmailSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(authUser.email);
      if (error) {
        setAccountError(`Не удалось отправить письмо для сброса: ${error.message}`);
      } else {
        setAccountMessage(`Письмо для сброса отправлено на ${authUser.email}. Откройте ссылку из письма, затем задайте новый пароль здесь.`);
      }
    } catch (error) {
      setAccountError(`Не удалось связаться с Supabase Auth: ${error.message}. Проверьте подключение и повторите попытку.`);
    } finally {
      setResetEmailSubmitting(false);
    }
  };

  const toggleFavorite = (id, priority = 'medium') => {
    setFavorites(prev => {
      const copy = { ...prev };
      if (copy[id]) {
        delete copy[id];
      } else {
        copy[id] = priority;
      }
      return copy;
    });
  };

  const updateFavoritePriority = (id, priority) => {
    setFavorites(prev => ({
      ...prev,
      [id]: priority
    }));
  };

  const removeFavorite = id => {
    setFavorites(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleCreateEvent = async e => {
    e.preventDefault();
    if (!supabase) return;

    const category = newEvent.category === 'Другое' && newEvent.customCategory.trim()
      ? newEvent.customCategory.trim()
      : newEvent.category;
    let activity;
    if (pendingDraft) {
      const { data, error } = await supabase.rpc('publish_telegram_event_draft', {
        _draft_id: pendingDraft.id,
        _title: newEvent.title,
        _category: category,
        _format: newEvent.format,
        _age: newEvent.age,
        _deadline: newEvent.deadline || null,
        _location: newEvent.location,
        _description: newEvent.description,
        _link: newEvent.link
      });

      if (error) {
        setErrorMessage(`Не удалось опубликовать черновик: ${error.message}`);
        return;
      }
      activity = Array.isArray(data) ? data[0] : data;
    } else {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          title: newEvent.title,
          category,
          format: newEvent.format,
          age: newEvent.age,
          deadline: newEvent.deadline || null,
          location: newEvent.location,
          description: newEvent.description,
          link: newEvent.link,
          active: true
        })
        .select()
        .single();

      if (error) {
        setErrorMessage(`Не удалось создать активность: ${error.message}`);
        return;
      }
      activity = data;
    }

    if (!activity) {
      setErrorMessage('Активность не была возвращена базой данных.');
      return;
    }
    setErrorMessage('');
    setActivities(current => [activity, ...current]);
    setPendingDraft(null);
    setNewEvent({ ...EMPTY_EVENT });
    setIsModalOpen(false);
  };

  const handleSelectTelegramDraft = (draft, suggestions, mode = 'suggested') => {
    setNewEvent(mode === 'suggested' ? {
      ...EMPTY_EVENT,
      title: suggestions.title,
      category: suggestions.category,
      age: suggestions.age,
      deadline: suggestions.deadline,
      location: suggestions.location,
      description: draft.message_text,
      link: suggestions.link
    } : { ...EMPTY_EVENT, age: '', description: '' });
    setPendingDraft(draft);
    setAdminSection('activities');
    setIsModalOpen(true);
  };

  const closeEventModal = () => {
    setIsModalOpen(false);
    setPendingDraft(null);
  };

  const openNewEventModal = () => {
    setPendingDraft(null);
    setNewEvent({ ...EMPTY_EVENT });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async id => {
    if (!supabase) return;
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (error) {
      setErrorMessage(`Не удалось удалить активность: ${error.message}`);
      return;
    }
    setErrorMessage('');
    setActivities(current => current.filter(item => item.id !== id));
  };

  const handleToggleActive = async item => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('activities')
      .update({ active: !item.active })
      .eq('id', item.id)
      .select()
      .single();

    if (error) {
      setErrorMessage(`Не удалось изменить статус активности: ${error.message}`);
      return;
    }
    setErrorMessage('');
    setActivities(current => current.map(activity => activity.id === item.id ? data : activity));
  };

  const matchLookup = useMemo(() => {
    if (!studentProfile) return new Map();
    const matches = matchActivitiesToProfile(activities, studentProfile);
    return new Map(matches.map(entry => [entry.activity.id, entry]));
  }, [activities, studentProfile]);

  const filteredActivities = useMemo(() => {
    const base = activities.filter(item => {
      if (!item.active && !isAdmin) return false;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (item.title || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.location || '').toLowerCase().includes(q);
      const matchesCat = selectedCategory === 'Все' || item.category === selectedCategory;
      const matchesFormat =
        selectedFormat === 'Все' ||
        (item.format || '').toLowerCase().includes(selectedFormat.toLowerCase());
      return matchesSearch && matchesCat && matchesFormat;
    });

    if (sortByMatch && studentProfile) {
      return [...base].sort((a, b) => {
        const scoreA = matchLookup.get(a.id)?.score ?? -1;
        const scoreB = matchLookup.get(b.id)?.score ?? -1;
        return scoreB - scoreA;
      });
    }

    return base;
  }, [activities, isAdmin, searchQuery, selectedCategory, selectedFormat, sortByMatch, studentProfile, matchLookup]);

  const categoryFilters = [
    'Все',
    ...new Set([
      ...ACTIVITY_CATEGORIES.filter(category => category !== 'Другое'),
      ...activities.map(activity => activity.category).filter(Boolean)
    ])
  ];

  const userName = authUser?.user_metadata?.full_name || authUser?.email;
  const savedCountry = studentProfile ? getCountryById(studentProfile.country) : null;
  const savedMajor = studentProfile ? getMajorById(studentProfile.major) : null;

  const navItems = [
    ['catalog', 'Каталог'],
    ['advisor', 'Подбор по целям'],
    ['scholarships', 'Стипендии'],
    ['profile', `Профиль (${Object.keys(favorites).length})`]
  ];
  if (isAdmin) {
    navItems.push(['admin', 'Админ-панель']);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="relative md:sticky md:top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:h-16 md:gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-lg"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-slate-900">
              EduPulse CIS
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-6" aria-label="Основная навигация">
            {navItems.map(([tabId, label]) => (
              <button
                key={tabId}
                type="button"
                onClick={() => setActiveTab(tabId)}
                className={`border-b-2 py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === tabId
                    ? 'border-indigo-700 text-indigo-700 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`inline-flex md:hidden min-h-[40px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'admin'
                    ? 'bg-indigo-700 text-white'
                    : 'border border-slate-200 bg-white text-slate-700'
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                Админ
              </button>
            )}
            {authUser ? (
              <div className="flex items-center gap-3">
                <span className="hidden lg:inline max-w-[180px] truncate text-xs font-medium text-slate-600">
                  {userName}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Выйти
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthMessage(''); setAuthModalOpen(true); }}
                disabled={authLoading}
                className="min-h-[40px] rounded-xl bg-indigo-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-800 disabled:opacity-60 whitespace-nowrap shrink-0"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-5 pb-24 sm:px-6 md:py-8">
        {!isSupabaseConfigured && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Supabase не настроен. Создайте `.env.local` с `VITE_SUPABASE_URL` и `VITE_SUPABASE_PUBLISHABLE_KEY`, чтобы загрузить живой каталог и авторизацию. Разделы «Подбор по целям», «Стипендии» и «Профиль» доступны уже сейчас.
          </div>
        )}
        {errorMessage && (
          <div role="alert" className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            {errorMessage}
          </div>
        )}
        {authMessage && (
          <div role="status" className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            {authMessage}
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl space-y-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Внеучебные активности для поступления за рубеж
                  </h1>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Олимпиады, хакатоны, Game Jams, стажировки и волонтёрские программы для школьников и студентов из стран СНГ.
                  </p>
                </div>

                {studentProfile && savedCountry && savedMajor ? (
                  <div className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 border border-slate-200">
                    <div className="text-xs">
                      <div className="text-slate-500">Ваш трек</div>
                      <div className="font-bold text-slate-900">
                        {savedCountry.shortName} · {savedMajor.shortName}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSortByMatch(v => !v)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        sortByMatch
                          ? 'bg-indigo-700 text-white'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {sortByMatch ? 'Сначала подходящие' : 'Сортировать под цель'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('advisor')}
                      className="text-xs font-semibold text-indigo-700 hover:underline whitespace-nowrap shrink-0"
                    >
                      План →
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab('advisor')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 whitespace-nowrap shrink-0"
                  >
                    <Compass className="h-4 w-4" />
                    Подобрать под вашу цель
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Поиск по названию олимпиады, хакатона, стажировки или описанию..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>

                <select
                  aria-label="Фильтр по формату"
                  value={selectedFormat}
                  onChange={e => setSelectedFormat(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="Все">Все форматы</option>
                  <option value="Онлайн">Онлайн</option>
                  <option value="Очно">Очно</option>
                  <option value="Гибрид">Гибрид</option>
                </select>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={openNewEventModal}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 whitespace-nowrap shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    Добавить ивент
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                <span className="mr-1 text-xs font-medium text-slate-500">Категория:</span>
                {categoryFilters.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            {activitiesLoading && isSupabaseConfigured && (
              <div className="py-6 text-center text-sm text-slate-500">Загрузка активностей...</div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredActivities.map(item => {
                const isFav = Boolean(favorites[item.id]);
                const matchEntry = sortByMatch ? matchLookup.get(item.id) : null;
                return (
                  <article
                    key={item.id}
                    className={`flex flex-col justify-between rounded-2xl border bg-white p-6 transition-shadow ${
                      item.active
                        ? 'border-slate-200 hover:shadow-sm'
                        : 'border-amber-200 bg-amber-50/30 opacity-80'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-xs font-medium text-slate-500">
                          <span className="font-semibold text-indigo-700">{item.category}</span>
                          {item.format && (
                            <>
                              <span className="mx-1.5" aria-hidden="true">·</span>
                              <span>{item.format}</span>
                            </>
                          )}
                          {!item.active && (
                            <>
                              <span className="mx-1.5" aria-hidden="true">·</span>
                              <span className="font-semibold text-amber-700">Скрыт</span>
                            </>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleFavorite(item.id)}
                          aria-label={isFav ? 'Убрать из портфолио' : 'Добавить в портфолио'}
                          className={`rounded-lg p-2 transition-colors ${
                            isFav
                              ? 'bg-amber-50 text-amber-600'
                              : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                          }`}
                          title={isFav ? 'Убрать из портфолио' : 'Добавить в портфолио'}
                        >
                          <Bookmark className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <h2 className="mt-2 font-display text-lg font-bold leading-snug text-slate-900">
                        {item.title}
                      </h2>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
                        {item.description}
                      </p>

                      {matchEntry && matchEntry.reasons.length > 0 && (
                        <p className="mt-3 rounded-lg bg-indigo-50/70 px-3 py-2 text-xs font-medium text-indigo-800">
                          Подходит под цель: {matchEntry.reasons[0]}
                        </p>
                      )}

                      <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span>
                            Дедлайн:{' '}
                            <strong className="font-semibold text-slate-800 tabular-nums">
                              {item.deadline || 'Открытый набор'}
                            </strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span>
                            Место: <strong className="font-semibold text-slate-800">{item.location || 'Онлайн'}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span>
                            Возраст: <strong className="font-semibold text-slate-800 tabular-nums">{item.age || 'Любой'}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <span className="text-xs text-slate-500">{item.format || 'Формат уточняется'}</span>
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-800 whitespace-nowrap shrink-0"
                        >
                          Регистрация
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">Скоро ссылка</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {!activitiesLoading && filteredActivities.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white py-14 text-center">
                <p className="text-sm font-medium text-slate-600">
                  Активностей по вашему запросу не найдено.
                </p>
                {(selectedCategory !== 'Все' || selectedFormat !== 'Все' || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Все');
                      setSelectedFormat('Все');
                    }}
                    className="mt-3 text-xs font-semibold text-indigo-700 hover:underline"
                  >
                    Сбросить фильтры
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {(activeTab === 'advisor' || activeTab === 'scholarships') && (
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-200/70 p-1 md:hidden">
            <button
              type="button"
              onClick={() => setActiveTab('advisor')}
              className={`min-h-[44px] rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                activeTab === 'advisor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Подбор по целям
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('scholarships')}
              className={`min-h-[44px] rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                activeTab === 'scholarships' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Стипендии стран
            </button>
          </div>
        )}

        {activeTab === 'advisor' && (
          <GoalAdvisorQuiz
            savedProfile={studentProfile}
            onSaveProfile={handleSaveStudentProfile}
            activities={activities}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onFilterCatalogByCategory={category => {
              setSelectedCategory(category);
              setActiveTab('catalog');
            }}
            onOpenScholarships={countryId => {
              setScholarshipRegion(countryId || 'all');
              setActiveTab('scholarships');
            }}
          />
        )}

        {activeTab === 'scholarships' && (
          <ScholarshipsGuide
            initialCountry={scholarshipRegion}
            onStartQuiz={() => setActiveTab('advisor')}
          />
        )}

        {activeTab === 'profile' && (
          <StudentProfilePanel
            authUser={authUser}
            isAdmin={isAdmin}
            onOpenAdmin={() => setActiveTab('admin')}
            demographicInfo={demographicInfo}
            onSaveDemographicInfo={handleSaveDemographicInfo}
            studentProfile={studentProfile}
            completedChecklist={completedChecklist}
            onToggleChecklistItem={handleToggleChecklistItem}
            onOpenQuiz={() => setActiveTab('advisor')}
            onOpenAuth={() => { setAuthMode('login'); setAuthMessage(''); setAuthModalOpen(true); }}
            activities={activities}
            favorites={favorites}
            onUpdateFavoritePriority={updateFavoritePriority}
            onRemoveFavorite={removeFavorite}
            onOpenCatalog={() => setActiveTab('catalog')}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            passwordSubmitting={passwordSubmitting}
            resetEmailSubmitting={resetEmailSubmitting}
            accountMessage={accountMessage}
            accountError={accountError}
            onPasswordChange={handlePasswordChange}
            onPasswordResetEmail={handlePasswordResetEmail}
          />
        )}

        {activeTab === 'admin' && isAdmin && (
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Панель администратора</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Управление объявлениями, пользователями и Telegram-черновиками
                  </p>
                </div>
                {adminSection === 'activities' && (
                  <button
                    type="button"
                    onClick={openNewEventModal}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 whitespace-nowrap shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    Создать ивент
                  </button>
                )}
              </div>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                {[
                  ['activities', 'Активности'],
                  ['users', 'Пользователи'],
                  ['telegram', 'Telegram']
                ].map(([section, label]) => (
                  <button
                    key={section}
                    type="button"
                    onClick={() => setAdminSection(section)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                      adminSection === section
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {adminSection === 'activities' && (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
                        <th className="p-4">Название / Категория</th>
                        <th className="p-4">Дедлайн</th>
                        <th className="p-4">Статус</th>
                        <th className="p-4 text-right">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {activities.map(item => (
                        <tr key={item.id} className="transition-colors hover:bg-slate-50/60">
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{item.title}</div>
                            <div className="text-xs text-slate-500">{item.category} · {item.format}</div>
                          </td>
                          <td className="p-4 text-xs text-slate-600 tabular-nums">{item.deadline || '—'}</td>
                          <td className="p-4">
                            <button
                              type="button"
                              onClick={() => handleToggleActive(item)}
                              className={`rounded-lg border px-3 py-1 text-xs font-semibold transition-colors ${
                                item.active
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                  : 'border-amber-200 bg-amber-50 text-amber-700'
                              }`}
                            >
                              {item.active ? 'Активен' : 'Скрыт'}
                            </button>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block rounded-lg bg-slate-100 p-2 text-xs text-slate-600 hover:bg-slate-200"
                                title="Открыть ссылку"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteEvent(item.id)}
                              className="inline-block rounded-lg bg-rose-50 p-2 text-xs text-rose-600 hover:bg-rose-100"
                              title="Удалить ивент"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {adminSection === 'users' && <AdminUsersPanel currentUserId={authUser?.id} />}
            {adminSection === 'telegram' && <TelegramInboxPanel onSelectDraft={handleSelectTelegramDraft} />}
          </div>
        )}
      </main>

      <nav
        aria-label="Нижняя мобильная навигация"
        className="fixed bottom-0 left-0 right-0 z-40 grid h-16 grid-cols-3 border-t border-slate-200 bg-white/95 backdrop-blur-md md:hidden"
      >
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
            activeTab === 'catalog' ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutGrid className="h-5 w-5" />
          <span>Ивенты</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('advisor')}
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
            activeTab === 'advisor' || activeTab === 'scholarships'
              ? 'text-indigo-700'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="h-5 w-5" />
          <span>Разбор</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
            activeTab === 'profile' ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="h-5 w-5" />
          <span>Профиль</span>
        </button>
      </nav>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {pendingDraft ? 'Проверка Telegram-черновика' : 'Новое объявление об ивенте'}
              </h3>
              <button type="button" onClick={closeEventModal} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              {pendingDraft && (
                <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="mb-2 text-xs font-semibold text-slate-500">Оригинальный пересланный пост</h4>
                  <TelegramMessageText
                    text={pendingDraft.message_text}
                    entities={pendingDraft.message_entities}
                    className="max-h-40 overflow-auto text-sm text-slate-700"
                  />
                </section>
              )}
              {errorMessage && (
                <p role="alert" className="text-sm text-rose-700">{errorMessage}</p>
              )}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Название активности</label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Например: Хакатон по AI для молодежи"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Категория</label>
                  <select
                    value={newEvent.category}
                    onChange={e => setNewEvent({ ...newEvent, category: e.target.value, customCategory: '' })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    {ACTIVITY_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {newEvent.category === 'Другое' && (
                    <input
                      type="text"
                      required
                      value={newEvent.customCategory}
                      onChange={e => setNewEvent({ ...newEvent, customCategory: e.target.value })}
                      placeholder="Введите свою категорию"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Формат</label>
                  <select
                    value={newEvent.format}
                    onChange={e => setNewEvent({ ...newEvent, format: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="Онлайн">Онлайн</option>
                    <option value="Очно">Очно</option>
                    <option value="Гибрид">Гибрид</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Дедлайн</label>
                  <input
                    type="date"
                    value={newEvent.deadline}
                    onChange={e => setNewEvent({ ...newEvent, deadline: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Возраст / Аудитория</label>
                  <input
                    type="text"
                    value={newEvent.age}
                    onChange={e => setNewEvent({ ...newEvent, age: e.target.value })}
                    placeholder="14–18 лет"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Страна / место проведения</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Ташкент / Онлайн"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Ссылка на регистрацию (Кнопка)</label>
                <input
                  type="url"
                  value={newEvent.link}
                  onChange={e => setNewEvent({ ...newEvent, link: e.target.value })}
                  placeholder="https://example.com/register"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Описание</label>
                <textarea
                  rows="3"
                  required
                  value={newEvent.description}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Подробности об активности..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEventModal}
                  className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-700 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-800"
                >
                  Опубликовать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {authMode === 'login' ? 'Вход в аккаунт' : 'Регистрация студента'}
                </h2>
                <p className="mt-1 text-xs text-slate-500">Администраторские права назначаются отдельно.</p>
              </div>
              <button type="button" onClick={() => setAuthModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Имя</label>
                  <input
                    type="text"
                    required
                    value={authForm.name}
                    onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Электронная почта</label>
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Пароль</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={authForm.password}
                  onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
              {errorMessage && (
                <p role="alert" className="text-sm text-rose-700">{errorMessage}</p>
              )}
              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full rounded-xl bg-indigo-700 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-800 disabled:opacity-60"
              >
                {authSubmitting ? 'Подождите...' : authMode === 'login' ? 'Войти' : 'Создать аккаунт'}
              </button>
            </form>
            <button
              type="button"
              onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthMessage(''); setErrorMessage(''); }}
              className="mt-4 w-full text-center text-xs font-semibold text-indigo-700 hover:underline"
            >
              {authMode === 'login' ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
