import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Bookmark, User, Shield, Plus, Trash2, 
  ExternalLink, CheckCircle, Clock, MapPin, Users, Calendar, 
  Sparkles, X, ChevronRight, LogOut, Check
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import AdminUsersPanel from './components/AdminUsersPanel';
import TelegramInboxPanel from './components/TelegramInboxPanel';
import TelegramMessageText from './components/TelegramMessageText';
import { ACTIVITY_CATEGORIES } from './lib/activityCategories';

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

export default function App() {
  const [activities, setActivities] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog', 'profile', 'admin'
  const [adminSection, setAdminSection] = useState('activities');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('cis_favorites');
    return saved ? JSON.parse(saved) : {}; // id -> priority ('high' | 'medium' | 'low')
  });
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

  // Фильтры
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
    if (!supabase) {
      setAuthLoading(false);
      setActivitiesLoading(false);
      return;
    }

    let isMounted = true;
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (error) setErrorMessage(`Не удалось проверить сессию: ${error.message}`);
      setAuthUser(data.session?.user ?? null);
      setAuthLoading(false);
    };

    loadSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthUser(session?.user ?? null);
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

  const handleAuthSubmit = async (e) => {
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

  const handlePasswordChange = async (e) => {
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

  // Переключение избранного и приоритета
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

  const handleCreateEvent = async (e) => {
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

  const handleDeleteEvent = async (id) => {
    if (!supabase) return;
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (error) {
      setErrorMessage(`Не удалось удалить активность: ${error.message}`);
      return;
    }
    setErrorMessage('');
    setActivities(current => current.filter(item => item.id !== id));
  };

  const handleToggleActive = async (item) => {
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

  // Фильтрация
  const filteredActivities = activities.filter(item => {
    if (!item.active && !isAdmin) return false;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Все' || item.category === selectedCategory;
    const matchesFormat = selectedFormat === 'Все' || item.format.includes(selectedFormat);
    return matchesSearch && matchesCat && matchesFormat;
  });
  const categoryFilters = ['Все', ...new Set([
    ...ACTIVITY_CATEGORIES.filter(category => category !== 'Другое'),
    ...activities.map(activity => activity.category).filter(Boolean)
  ])];
  const userName = authUser?.user_metadata?.full_name || authUser?.email;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Шапка */}
      <header className="bg-indigo-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('catalog')}>
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-inner">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">EduPulse CIS</h1>
              <p className="text-xs text-indigo-300">Внеучебные активности для поступления за рубеж</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button 
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'catalog' ? 'bg-indigo-700 text-white shadow' : 'text-indigo-200 hover:bg-indigo-800'}`}
            >
              Каталог
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${activeTab === 'profile' ? 'bg-indigo-700 text-white shadow' : 'text-indigo-200 hover:bg-indigo-800'}`}
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              Моё портфолио ({Object.keys(favorites).length})
            </button>
            {isAdmin && (
              <button 
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${activeTab === 'admin' ? 'bg-indigo-700 text-white shadow' : 'text-indigo-200 hover:bg-indigo-800'}`}
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                Админ-панель
              </button>
            )}
            {authUser ? (
              <>
                <span className="text-xs text-indigo-200 hidden lg:inline">{userName}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-indigo-200 hover:bg-indigo-800 transition flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" /> Выйти
                </button>
              </>
            ) : (
              <button
                onClick={() => { setAuthMode('login'); setAuthMessage(''); setAuthModalOpen(true); }}
                disabled={authLoading}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 transition"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!isSupabaseConfigured && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Supabase не настроен. Создайте `.env.local` с `VITE_SUPABASE_URL` и `VITE_SUPABASE_PUBLISHABLE_KEY`, затем перезапустите сайт.
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
        {activitiesLoading && isSupabaseConfigured && (
          <div className="mb-6 text-center text-sm text-slate-500">Загрузка активностей...</div>
        )}
        
        {/* ВКЛАДКА: КАТАЛОГ */}
        {activeTab === 'catalog' && (
          <div>
            {/* Блок поиска и фильтров */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Поиск по названию олимпиады, стажировки или описанию..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                {isAdmin && (
                  <button 
                    onClick={openNewEventModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition"
                  >
                    <Plus className="w-5 h-5" /> Добавить ивент
                  </button>
                )}
              </div>

              {/* Фильтры категорий */}
              <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2">Категория:</span>
                {categoryFilters.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Список карточек */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map(item => {
                const isFav = !!favorites[item.id];
                return (
                  <div key={item.id} className={`bg-white rounded-2xl border ${item.active ? 'border-slate-200 shadow-sm hover:shadow-md' : 'border-amber-200 bg-amber-50/30 opacity-75'} transition flex flex-col justify-between overflow-hidden`}>
                    <div className="p-6">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-2">
                          {!item.active && (
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">Неактивен</span>
                          )}
                          <button 
                            onClick={() => toggleFavorite(item.id)}
                            className={`p-2 rounded-xl transition ${isFav ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                            title={isFav ? "Убрать из портфолио" : "Добавить в портфолио"}
                          >
                            <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current text-amber-500' : ''}`} />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-bold text-lg text-slate-900 mb-2 leading-snug">{item.title}</h3>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-3">{item.description}</p>

                      <div className="space-y-2 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>Дедлайн: <strong className="text-slate-700">{item.deadline}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span>Место: <strong className="text-slate-700">{item.location}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span>Возраст: <strong className="text-slate-700">{item.age}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">{item.format}</span>
                      {item.link ? (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-xl transition shadow-sm"
                        >
                          Регистрация <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">Скоро ссылка</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {!activitiesLoading && filteredActivities.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-500 text-base">Активностей по вашему запросу не найдено.</p>
              </div>
            )}
          </div>
        )}

        {/* ВКЛАДКА: ПРОФИЛЬ / ПОРТФОЛИО */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto">
            {authUser && (
              <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Аккаунт</h2>
                <div className="mt-4">
                  <label htmlFor="account-email" className="mb-1 block text-xs font-medium text-slate-600">Электронная почта</label>
                  <input
                    id="account-email"
                    type="email"
                    readOnly
                    value={authUser.email || ''}
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                  />
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Пароль нельзя посмотреть: Supabase не хранит его в читаемом виде. Здесь можно задать новый пароль.
                </p>
                <form onSubmit={handlePasswordChange} className="mt-5 space-y-3">
                  {accountError && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{accountError}</p>}
                  {accountMessage && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{accountMessage}</p>}
                  <div>
                    <label htmlFor="new-password" className="mb-1 block text-xs font-medium text-slate-600">Новый пароль</label>
                    <input
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      minLength={6}
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="mb-1 block text-xs font-medium text-slate-600">Повторите новый пароль</label>
                    <input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      minLength={6}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={passwordSubmitting || resetEmailSubmitting}
                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {passwordSubmitting ? 'Сохранение...' : 'Изменить пароль'}
                  </button>
                  <button
                    type="button"
                    onClick={handlePasswordResetEmail}
                    disabled={passwordSubmitting || resetEmailSubmitting}
                    className="ml-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resetEmailSubmitting ? 'Отправка письма...' : 'Не работает? Отправить ссылку для сброса'}
                  </button>
                </form>
              </section>
            )}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Моё студенческое портфолио</h2>
                <p className="text-sm text-slate-500">Сохраненные активности, которые вы планируете посетить</p>
              </div>
              <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold">
                Сохранено: {Object.keys(favorites).length} ивентов
              </div>
            </div>

            <div className="space-y-4">
              {Object.keys(favorites).length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                  <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">Ваше портфолио пока пусто</p>
                  <p className="text-slate-400 text-sm mt-1">Нажмите на звёздочку/закладку на любой карточке в каталоге, чтобы сохранить её.</p>
                </div>
              ) : (
                activities
                  .filter(item => favorites[item.id])
                  .map(item => (
                    <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
                            {item.category}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Дедлайн: {item.deadline}
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-slate-900">{item.title}</h4>
                        <p className="text-slate-600 text-xs line-clamp-1 mt-0.5">{item.description}</p>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        {item.link && (
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium rounded-xl transition"
                          >
                            Ссылка
                          </a>
                        )}
                        <button 
                          onClick={() => toggleFavorite(item.id)}
                          className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium rounded-xl transition"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* ВКЛАДКА: ПАНЕЛЬ АДМИНА */}
        {activeTab === 'admin' && isAdmin && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Панель администратора</h2>
                  <p className="text-sm text-slate-500">Управление объявлениями, пользователями и Telegram-черновиками</p>
                </div>
                {adminSection === 'activities' && (
                  <button
                    onClick={openNewEventModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 shadow-sm transition"
                  >
                    <Plus className="w-4 h-4" /> Создать ивент
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
                    onClick={() => setAdminSection(section)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${adminSection === section ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {adminSection === 'activities' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="p-4">Название / Категория</th>
                      <th className="p-4">Дедлайн</th>
                      <th className="p-4">Статус</th>
                      <th className="p-4 text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {activities.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{item.title}</div>
                          <div className="text-xs text-slate-400">{item.category} • {item.format}</div>
                        </td>
                        <td className="p-4 text-slate-600 text-xs">{item.deadline}</td>
                        <td className="p-4">
                          <button 
                            onClick={() => handleToggleActive(item)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${item.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}
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
                              className="inline-block p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs"
                              title="Открыть ссылку"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button 
                            onClick={() => handleDeleteEvent(item.id)}
                            className="inline-block p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs"
                            title="Удалить ивент"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* МОДАЛЬНОЕ ОКНО СОЗДАНИЯ ИВЕНТА */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {pendingDraft ? 'Проверка Telegram-черновика' : 'Новое объявление об ивенте'}
              </h3>
              <button onClick={closeEventModal} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              {pendingDraft && (
                <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Оригинальный пересланный пост</h4>
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
                <label className="block text-xs font-medium text-slate-600 mb-1">Название активности</label>
                <input 
                  type="text" 
                  required
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Например: Хакатон по AI для молодежи"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Категория</label>
                  <select 
                    value={newEvent.category}
                    onChange={e => setNewEvent({ ...newEvent, category: e.target.value, customCategory: '' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {ACTIVITY_CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}
                  </select>
                  {newEvent.category === 'Другое' && (
                    <input
                      type="text"
                      required
                      value={newEvent.customCategory}
                      onChange={e => setNewEvent({ ...newEvent, customCategory: e.target.value })}
                      placeholder="Введите свою категорию"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Формат</label>
                  <select 
                    value={newEvent.format}
                    onChange={e => setNewEvent({...newEvent, format: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Онлайн">Онлайн</option>
                    <option value="Очно">Очно</option>
                    <option value="Гибрид">Гибрид</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Дедлайн</label>
                  <input 
                    type="date" 
                    value={newEvent.deadline}
                    onChange={e => setNewEvent({...newEvent, deadline: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Возраст / Аудитория</label>
                  <input 
                    type="text" 
                    value={newEvent.age}
                    onChange={e => setNewEvent({...newEvent, age: e.target.value})}
                    placeholder="14–18 лет"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Страна / место проведения</label>
                <input 
                  type="text" 
                  value={newEvent.location}
                  onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                  placeholder="Ташкент / Онлайн"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Ссылка на регистрацию (Кнопка)</label>
                <input 
                  type="url" 
                  value={newEvent.link}
                  onChange={e => setNewEvent({...newEvent, link: e.target.value})}
                  placeholder="https://example.com/register"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Описание</label>
                <textarea 
                  rows="3"
                  required
                  value={newEvent.description}
                  onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Подробности об активности..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={closeEventModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-medium transition"
                >
                  Отмена
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium transition shadow-sm"
                >
                  Опубликовать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {authModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {authMode === 'login' ? 'Вход в аккаунт' : 'Регистрация студента'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">Администраторские права назначаются отдельно.</p>
              </div>
              <button onClick={() => setAuthModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Имя</label>
                  <input
                    type="text"
                    required
                    value={authForm.name}
                    onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Электронная почта</label>
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Пароль</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={authForm.password}
                  onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              {errorMessage && (
                <p role="alert" className="text-sm text-rose-700">{errorMessage}</p>
              )}
              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl transition"
              >
                {authSubmitting ? 'Подождите...' : authMode === 'login' ? 'Войти' : 'Создать аккаунт'}
              </button>
            </form>
            <button
              onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthMessage(''); setErrorMessage(''); }}
              className="mt-4 w-full text-center text-xs text-indigo-600 hover:underline font-semibold"
            >
              {authMode === 'login' ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
