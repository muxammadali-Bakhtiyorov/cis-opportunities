import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Star, Calendar, MapPin, ExternalLink, Plus, Trash2, 
  CheckCircle, Shield, User, Bookmark, ChevronRight, X, Sparkles, Trophy, 
  Briefcase, Heart, BookOpen, Clock, Tag, Globe, SlidersHorizontal, LogOut, Lock
} from 'lucide-react';

// Первоначальные демонстрационные данные (Мок-данные)
const INITIAL_EVENTS = [
  {
    id: 'evt-1',
    title: 'Международная олимпиада по искусственному интеллекту (IAIO 2026)',
    category: 'Олимпиада',
    organizer: 'НТИ & СНО СНГ',
    description: 'Масштабная олимпиада по машинному обучению и анализу данных для школьников старших классов и студентов 1-2 курсов. Победители получают льготы при поступлении и гранты.',
    format: 'Онлайн',
    location: 'Онлайн',
    targetAge: '15-22 года',
    deadline: '2026-12-01',
    link: 'https://example.com/iaio',
    active: true,
    tags: ['AI', 'Data Science', 'Программирование'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'evt-2',
    title: 'Экологическая волонтёрская программа "Чистый Байкал"',
    category: 'Волонтёрство',
    organizer: 'EcoYouth Eurasia',
    description: 'Летний лагерь и экспедиция по расчистке береговой линии, созданию эко-троп и исследованию биоразнообразия. Проезд и проживание компенсируются.',
    format: 'Офлайн',
    location: 'Иркутск / Озеро Байкал',
    targetAge: '16-25 лет',
    deadline: '2026-11-20',
    link: 'https://example.com/ecobaikal',
    active: true,
    tags: ['Экология', 'Природа', 'Экспедиция'],
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'evt-3',
    title: 'Стажировка в IT-лаборатории СБЕР / Яндекс для разработчиков',
    category: 'Стажировка',
    organizer: 'Tech CIS Internship Hub',
    description: 'Оплачиваемая 3-месячная программа стажировки для начинающих Backend, Frontend и QA инженеров с возможностью удаленной работы из любой страны СНГ.',
    format: 'Гибрид',
    location: 'Москва / Удаленно',
    targetAge: '18-24 года',
    deadline: '2026-11-15',
    link: 'https://example.com/tech-intern',
    active: true,
    tags: ['Frontend', 'Backend', 'Оплачиваемая'],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'evt-4',
    title: 'Евразийский конкурс социальных стартапов "Impact CIS"',
    category: 'Конкурс',
    organizer: 'Eurasia Social Fund',
    description: 'Конкурс предпринимательских проектов, решающих важные социальные и образовательные задачи в регионе. Призовой фонд $50,000.',
    format: 'Онлайн',
    location: 'Онлайн',
    targetAge: '16-28 лет',
    deadline: '2026-12-10',
    link: 'https://example.com/impact-cis',
    active: true,
    tags: ['Стартапы', 'Инновации', 'Гранты'],
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'evt-5',
    title: 'Олимпиада по математике и логике "Al-Khwarizmi Honor"',
    category: 'Олимпиада',
    organizer: 'Университет Иннополис & КазНУ',
    description: 'Престижное соревнование по высшей математике и алгоритмам. Победители получают приглашения в магистратуру и фаст-трек на гранты.',
    format: 'Онлайн',
    location: 'Онлайн',
    targetAge: '16-23 года',
    deadline: '2026-11-30',
    link: 'https://example.com/khwarizmi',
    active: true,
    tags: ['Математика', 'Логика'],
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'evt-6',
    title: 'Программа культурного обмена "Молодые лидеры Азии & СНГ"',
    category: 'Волонтёрство',
    organizer: 'Global Youth Forum',
    description: 'Недельный форум в Ташкенте для молодых лидеров, активных в сфере медиа, дипломатии и работы с молодежью.',
    format: 'Офлайн',
    location: 'Ташкент, Узбекистан',
    targetAge: '18-26 лет',
    deadline: '2026-10-01', // Завершилась
    link: 'https://example.com/youth-forum',
    active: false,
    tags: ['Лидерство', 'Дипломатия'],
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=60'
  }
];

const CATEGORIES = ['Все', 'Олимпиада', 'Волонтёрство', 'Стажировка', 'Конкурс'];
const FORMATS = ['Все', 'Онлайн', 'Офлайн', 'Гибрид'];

export default function App() {
  // Состояния пользователя и авторизации
  const [currentUser, setCurrentUser] = useState({
    name: 'Тимур Алиев',
    email: 'timur.student@example.com',
    role: 'student', // 'student' или 'admin'
    isLoggedIn: true
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' или 'register'
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', role: 'student' });

  // Основной список ивентов
  const [events, setEvents] = useState(INITIAL_EVENTS);
  
  // Избранные ивенты со звёздочками рейтинга: { [eventId]: importanceLevel (1-5) }
  const [favorites, setFavorites] = useState({
    'evt-1': 5,
    'evt-3': 4
  });

  // Навигация (вкладки)
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog', 'portfolio', 'admin'
  
  // Детальный просмотр ивента в модальном окне
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Состояния фильтрации и поиска
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedFormat, setSelectedFormat] = useState('Все');
  const [onlyOpenRegistration, setOnlyOpenRegistration] = useState(true);

  // Форма админки для создания нового ивента
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Олимпиада',
    organizer: '',
    description: '',
    format: 'Онлайн',
    location: 'Онлайн',
    targetAge: '14-22 года',
    deadline: '',
    link: '',
    tags: '',
    image: ''
  });

  // --- Переключение звёздочек (Важность / Избранное) ---
  const toggleFavoriteStar = (eventId, rating) => {
    setFavorites(prev => {
      const currentRating = prev[eventId];
      if (currentRating === rating) {
        // Убираем отметку при повторном клике на ту же звезду
        const updated = { ...prev };
        delete updated[eventId];
        return updated;
      }
      return { ...prev, [eventId]: rating };
    });
  };

  // --- Авторизация (Мок) ---
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setCurrentUser({
      name: authForm.name || (authForm.email.split('@')[0]),
      email: authForm.email,
      role: authForm.role,
      isLoggedIn: true
    });
    setAuthModalOpen(false);
    setAuthForm({ name: '', email: '', password: '', role: 'student' });
  };

  const handleLogout = () => {
    setCurrentUser({ name: '', email: '', role: 'student', isLoggedIn: false });
  };

  // --- Админка: Добавление ивента ---
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.link) return;

    const created = {
      ...newEvent,
      id: `evt-${Date.now()}`,
      active: true,
      tags: newEvent.tags ? newEvent.tags.split(',').map(t => t.trim()) : ['Новое'],
      image: newEvent.image || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60'
    };

    setEvents([created, ...events]);
    setNewEvent({
      title: '',
      category: 'Олимпиада',
      organizer: '',
      description: '',
      format: 'Онлайн',
      location: 'Онлайн',
      targetAge: '14-22 года',
      deadline: '',
      link: '',
      tags: '',
      image: ''
    });
  };

  // --- Админка: Изменение статуса активности ---
  const toggleEventStatus = (id) => {
    setEvents(events.map(evt => evt.id === id ? { ...evt, active: !evt.active } : evt));
  };

  // --- Админка: Удаление ивента ---
  const deleteEvent = (id) => {
    setEvents(events.filter(evt => evt.id !== id));
    // очищаем из избранного при удалении
    if (favorites[id]) {
      const updatedFavs = { ...favorites };
      delete updatedFavs[id];
      setFavorites(updatedFavs);
    }
  };

  // Отфильтрованный список ивентов для главной страницы
  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      // Ивенты только с открытой регистрацией для главной (если включена галочка)
      if (onlyOpenRegistration && !evt.active) return false;

      // Поиск
      const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            evt.organizer.toLowerCase().includes(searchQuery.toLowerCase());

      // Категория
      const matchesCategory = selectedCategory === 'Все' || evt.category === selectedCategory;

      // Формат
      const matchesFormat = selectedFormat === 'Все' || evt.format === selectedFormat;

      return matchesSearch && matchesCategory && matchesFormat;
    });
  }, [events, searchQuery, selectedCategory, selectedFormat, onlyOpenRegistration]);

  // Список избранных ивентов для портфолио
  const portfolioEvents = useMemo(() => {
    return Object.keys(favorites)
      .map(id => {
        const evt = events.find(e => e.id === id);
        return evt ? { ...evt, starRating: favorites[id] } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.starRating - a.starRating); // Сортировка по важности (количеству звёзд)
  }, [events, favorites]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      
      {/* ---------------- ШАПКА / НАВИГАЦИЯ ---------------- */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Логотип */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('catalog')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                EduPulse CIS
              </span>
              <span className="block text-[10px] text-slate-400 font-medium -mt-1">Внеучебные активности</span>
            </div>
          </div>

          {/* Переключение вкладок */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'catalog'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Все активности
              </div>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === 'portfolio'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                Моё портфолио
                {Object.keys(favorites).length > 0 && (
                  <span className="ml-1 bg-amber-500 text-white text-xs px-1.5 py-0.2 rounded-full font-bold">
                    {Object.keys(favorites).length}
                  </span>
                )}
              </div>
            </button>

            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'admin'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  Панель Админа
                </div>
              </button>
            )}
          </nav>

          {/* Блок пользователя и Быстрый переключатель роли */}
          <div className="flex items-center gap-3">
            {currentUser.isLoggedIn ? (
              <div className="flex items-center gap-3">
                
                {/* Кнопка мгновенного переключения роли для удобного тестирования */}
                <button 
                  onClick={() => {
                    const newRole = currentUser.role === 'admin' ? 'student' : 'admin';
                    setCurrentUser({ ...currentUser, role: newRole });
                    if (newRole === 'student' && activeTab === 'admin') setActiveTab('catalog');
                  }}
                  title="Кликните для быстрой смены роли в демо-режиме"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Роль: {currentUser.role === 'admin' ? 'Администратор' : 'Студент'}
                </button>

                <div className="hidden lg:block text-right">
                  <div className="text-sm font-semibold text-slate-800">{currentUser.name}</div>
                  <div className="text-xs text-slate-500">{currentUser.email}</div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Выйти"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Войти / Регистрация
              </button>
            )}
          </div>
        </div>

        {/* Мобильная навигация */}
        <div className="md:hidden flex border-t border-slate-200 bg-white px-2 py-2 justify-around">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 py-1.5 text-xs text-center font-medium ${activeTab === 'catalog' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
          >
            Активности
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex-1 py-1.5 text-xs text-center font-medium ${activeTab === 'portfolio' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
          >
            Избранное ({Object.keys(favorites).length})
          </button>
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-1.5 text-xs text-center font-medium ${activeTab === 'admin' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
            >
              Админка
            </button>
          )}
        </div>
      </header>


      {/* ---------------- ОСНОВНОЙ КОНТЕНТ ---------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ================= ВКТАДКА 1: КАТАЛОГ АКТИВНОСТЕЙ ================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-8">
            
            {/* Баннер / Геро-секция */}
            <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white p-8 sm:p-10 overflow-hidden shadow-xl">
              <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Единый хаб возможностей СНГ
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
                  Найди активности для идеального портфолио
                </h1>
                <p className="text-indigo-200 text-sm sm:text-base mb-6 leading-relaxed">
                  Олимпиады, международные стажировки, конкурсы и волонтёрские программы для школьников и студентов из стран СНГ в одном месте.
                </p>

                {/* Быстрая строка поиска */}
                <div className="relative max-w-xl">
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск олимпиад, стажировок, IT-конкурсов..."
                    className="w-full pl-12 pr-4 py-3 bg-white text-slate-900 rounded-2xl shadow-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium text-sm"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 text-xs bg-slate-100 p-1 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Фильтры и Панель управления */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Фильтр Категорий */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Категории:
                  </span>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Доп. Фильтры (Формат + Статус) */}
                <div className="flex flex-wrap items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Формат:</span>
                    <select
                      value={selectedFormat}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                      className="bg-slate-100 border-none text-slate-700 text-xs font-semibold rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
                    >
                      {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={onlyOpenRegistration}
                      onChange={(e) => setOnlyOpenRegistration(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>Только с открытой регистрацией</span>
                  </label>
                </div>

              </div>
            </div>

            {/* Карточки Ивентов */}
            {filteredEvents.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700 mb-1">Ничего не найдено</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  Попробуйте изменить параметры поиска или сбросить фильтры категории и формата.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Все');
                    setSelectedFormat('Все');
                    setOnlyOpenRegistration(false);
                  }}
                  className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-semibold hover:bg-indigo-100"
                >
                  Сбросить все фильтры
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(evt => (
                  <EventCard 
                    key={evt.id} 
                    event={evt} 
                    starRating={favorites[evt.id] || 0}
                    onStarClick={(rating) => toggleFavoriteStar(evt.id, rating)}
                    onOpenDetails={() => setSelectedEvent(evt)}
                  />
                ))}
              </div>
            )}
          </div>
        )}


        {/* ================= ВЛАДКА 2: МОЁ ПОРТФОЛИО / ИЗБРАННОЕ ================= */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Bookmark className="w-6 h-6 text-amber-500" />
                  Моё Портфолио & Отмеченные ивенты
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Здесь собраны важные для вас активности, отсортированные по приоритету (количеству звёзд).
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2 text-amber-800 text-xs font-medium">
                Всего сохранено: <span className="font-bold text-sm">{portfolioEvents.length}</span>
              </div>
            </div>

            {portfolioEvents.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                <Star className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">Ваше портфолио пока пусто</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                  Нажимайте на звёздочки у карточек активностей в каталоге, чтобы оценивать их значимость и добавлять сюда.
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
                >
                  Перейти к выбору активностей
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioEvents.map(evt => (
                  <EventCard 
                    key={evt.id} 
                    event={evt} 
                    starRating={evt.starRating}
                    onStarClick={(rating) => toggleFavoriteStar(evt.id, rating)}
                    onOpenDetails={() => setSelectedEvent(evt)}
                  />
                ))}
              </div>
            )}
          </div>
        )}


        {/* ================= ВЛАДКА 3: ПАНЕЛЬ АДМИНИСТРАТОРА ================= */}
        {activeTab === 'admin' && currentUser.role === 'admin' && (
          <div className="space-y-8">
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 mb-2">
                  <Shield className="w-3.5 h-3.5" /> Панель управления
                </div>
                <h2 className="text-2xl font-bold">Администрирование объявлений и ивентов</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Создавайте новые активности, управляйте ссылками на подачу заявок и модерируйте неактивные ивенты.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Форма создания нового ивента */}
              <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-600" />
                  Добавить новую активность
                </h3>

                <form onSubmit={handleCreateEvent} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Название мероприятия *</label>
                    <input
                      type="text"
                      required
                      placeholder="Например: Хакатон IT-Spring СНГ 2026"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Категория</label>
                      <select
                        value={newEvent.category}
                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        {CATEGORIES.filter(c => c !== 'Все').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Формат</label>
                      <select
                        value={newEvent.format}
                        onChange={(e) => setNewEvent({ ...newEvent, format: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        {FORMATS.filter(f => f !== 'Все').map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Организатор</label>
                    <input
                      type="text"
                      placeholder="Например: МГУ / СНО Узбекистан"
                      value={newEvent.organizer}
                      onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Локация / Город</label>
                      <input
                        type="text"
                        placeholder="Алматы / Онлайн"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Дедлайн подачи</label>
                      <input
                        type="date"
                        value={newEvent.deadline}
                        onChange={(e) => setNewEvent({ ...newEvent, deadline: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Целевой возраст/курс</label>
                    <input
                      type="text"
                      placeholder="Например: 16-22 года / 1-4 курс"
                      value={newEvent.targetAge}
                      onChange={(e) => setNewEvent({ ...newEvent, targetAge: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Ссылка на регистрацию (Кнопка) *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://example.com/apply"
                      value={newEvent.link}
                      onChange={(e) => setNewEvent({ ...newEvent, link: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Теги (через запятую)</label>
                    <input
                      type="text"
                      placeholder="Программирование, Грант, СНГ"
                      value={newEvent.tags}
                      onChange={(e) => setNewEvent({ ...newEvent, tags: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Подробное описание</label>
                    <textarea
                      rows="3"
                      placeholder="Опишите требования, условия и призы..."
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Опубликовать активность
                  </button>
                </form>
              </div>

              {/* Управление существующими ивентами */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Управление объявлениями ({events.length})</h3>
                  <span className="text-xs text-slate-500">
                    Неактивные объявления скрываются с главной страницы
                  </span>
                </div>

                <div className="space-y-3">
                  {events.map(evt => (
                    <div 
                      key={evt.id}
                      className={`p-4 bg-white rounded-2xl border transition-all ${
                        evt.active ? 'border-slate-200 shadow-sm' : 'border-slate-200 opacity-60 bg-slate-50'
                      } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                            evt.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {evt.active ? 'АКТИВЕН' : 'НЕАКТИВЕН'}
                          </span>
                          <span className="text-xs font-semibold text-indigo-600">{evt.category}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-base">{evt.title}</h4>
                        <div className="text-xs text-slate-500 flex items-center gap-3">
                          <span>Организатор: {evt.organizer}</span>
                          <span>•</span>
                          <span>Дедлайн: {evt.deadline || 'Не указан'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        {/* Переключатель Активен/Неактивен */}
                        <button
                          onClick={() => toggleEventStatus(evt.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                            evt.active 
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200' 
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {evt.active ? 'Деактивировать' : 'Активировать'}
                        </button>

                        {/* Кнопка удаления для неактивных ивентов */}
                        {!evt.active && (
                          <button
                            onClick={() => deleteEvent(evt.id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200"
                            title="Удалить неактивный ивент"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>


      {/* ---------------- МОДАЛЬНОЕ ОКНО ПОДРОБНОСТЕЙ ИВЕНТА ---------------- */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative my-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Картинка шапки */}
            <div className="h-48 sm:h-56 bg-slate-100 relative overflow-hidden">
              <img 
                src={selectedEvent.image} 
                alt={selectedEvent.title}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-slate-700 p-2 rounded-full hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                  {selectedEvent.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold leading-tight">{selectedEvent.title}</h3>
              </div>
            </div>

            {/* Контент модального окна */}
            <div className="p-6 space-y-6">
              
              {/* Параметры */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium mb-0.5">Формат</span>
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-indigo-500" /> {selectedEvent.format}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium mb-0.5">Локация</span>
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {selectedEvent.location}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium mb-0.5">Возраст</span>
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-500" /> {selectedEvent.targetAge}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium mb-0.5">Дедлайн</span>
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" /> {selectedEvent.deadline || 'Открыт'}
                  </span>
                </div>
              </div>

              {/* Описание */}
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-2">О мероприятии</h4>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Организатор и Теги */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div>
                  <span className="text-xs text-slate-400 block">Организатор:</span>
                  <span className="text-sm font-semibold text-slate-700">{selectedEvent.organizer}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {selectedEvent.tags?.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Кнопка отклика / Подачи заявки */}
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={selectedEvent.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm text-center shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  Перейти к подаче заявки
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* Оценка в модальном окне */}
                <div className="flex items-center gap-1 bg-slate-100 p-2 rounded-2xl border border-slate-200">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      onClick={() => toggleFavoriteStar(selectedEvent.id, star)}
                      className={`w-5 h-5 cursor-pointer transition-transform hover:scale-110 ${
                        (favorites[selectedEvent.id] || 0) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}


      {/* ---------------- МОДАЛЬНОЕ ОКНО АВТОРИЗАЦИИ ---------------- */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-indigo-600">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {authMode === 'login' ? 'Вход в аккаунт' : 'Регистрация студента'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Сохраняйте внеучебные активности в своё индивидуальное портфолио
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Имя и Фамилия</label>
                  <input
                    type="text"
                    required
                    placeholder="Алексей Смирнов"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Электронная почта</label>
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Пароль</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Роль (для демо-версии)</label>
                <select
                  value={authForm.role}
                  onChange={(e) => setAuthForm({ ...authForm, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 font-medium text-slate-700"
                >
                  <option value="student">Студент / Абитуриент</option>
                  <option value="admin">Администратор платформы</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition-all text-sm mt-2"
              >
                {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-xs text-indigo-600 hover:underline font-semibold"
              >
                {authMode === 'login' ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войти'}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ---------------- ПОДВАЛ (FOOTER) ---------------- */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400 space-y-2">
          <p>© 2026 EduPulse CIS — Агрегатор внеучебных активностей для поступивших и студентов стран СНГ.</p>
          <p>Все права на ссылки и олимпиады принадлежат их официальным организаторам.</p>
        </div>
      </footer>

    </div>
  );
}


// ---------------- ВСПОМОГАТЕЛЬНЫЙ КОМПОНЕНТ КАРТОЧКИ ИВЕНТА ----------------
function EventCard({ event, starRating, onStarClick, onOpenDetails }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      
      {/* Верхняя часть с картинкой */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

        {/* Категория */}
        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md text-slate-800 font-bold text-[11px] rounded-full shadow-sm">
          {event.category}
        </span>

        {/* Формат */}
        <span className="absolute top-3 right-3 px-2.5 py-1 bg-slate-900/70 backdrop-blur-md text-white font-medium text-[10px] rounded-full">
          {event.format}
        </span>

        {/* Интерактивные звёздочки прямо на превью карточки */}
        <div className="absolute bottom-3 left-3 flex items-center bg-slate-900/70 backdrop-blur-md px-2 py-1 rounded-xl gap-0.5">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              onClick={(e) => {
                e.stopPropagation();
                onStarClick(star);
              }}
              className={`w-4 h-4 cursor-pointer transition-transform hover:scale-125 ${
                starRating >= star
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Текстовая информация */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="text-xs text-slate-400 font-semibold mb-1">{event.organizer}</div>
          <h3 
            onClick={onOpenDetails} 
            className="font-bold text-slate-900 text-base leading-snug cursor-pointer hover:text-indigo-600 transition-colors line-clamp-2"
          >
            {event.title}
          </h3>
          <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-100">
          {/* Детали */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {event.location}
            </span>
            <span className="flex items-center gap-1 font-medium text-indigo-600">
              <Clock className="w-3.5 h-3.5" />
              {event.deadline ? `До ${event.deadline}` : 'Бессрочно'}
            </span>
          </div>

          {/* Кнопка открытия деталей */}
          <button
            onClick={onOpenDetails}
            className="w-full py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-200/80"
          >
            Подробнее и Регистрация
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}