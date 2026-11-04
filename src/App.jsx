import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Bookmark, User, Shield, Plus, Trash2, 
  ExternalLink, CheckCircle, Clock, MapPin, Users, Calendar, 
  Sparkles, X, ChevronRight, LogOut, Check
} from 'lucide-react';

// Начальные демо-данные активностей
const initialActivities = [
  {
    id: 1,
    title: 'Международная олимпиада по физике "Физтех.International"',
    category: 'Олимпиада',
    format: 'Онлайн / Очно',
    age: '14–18 лет',
    deadline: '2026-04-15',
    location: 'Москва / Онлайн',
    description: 'Масштабная олимпиада для школьников стран СНГ, дающая льготы при поступлении в ведущие технические вузы РФ.',
    link: 'https://mipt.ru',
    active: true
  },
  {
    id: 2,
    title: 'Волонтерский форум молодежи Центральной Азии',
    category: 'Волонтерство',
    format: 'Очно',
    age: '16–25 лет',
    deadline: '2026-05-01',
    location: 'Алматы, Казахстан',
    description: 'Трехдневный форум для лидеров социальных инициатив и волонтеров. Полное покрытие расходов на проживание.',
    link: 'https://example.com/volunteer',
    active: true
  },
  {
    id: 3,
    title: 'Летняя стажировка для IT-студентов в InDrive',
    category: 'Стажировка',
    format: 'Гибрид',
    age: '18–22 года',
    deadline: '2026-05-20',
    location: 'Астана / Удаленно',
    description: 'Оплачиваемая летняя стажировка по направлениям Frontend, Backend и Product Design с возможностью оффера.',
    link: 'https://indriver.com/careers',
    active: true
  }
];

export default function App() {
  // Состояния приложения
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('cis_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [user, setUser] = useState({ name: 'Студент СНГ', email: 'student@mail.com', role: 'student' });
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog', 'profile', 'admin'
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('cis_favorites');
    return saved ? JSON.parse(saved) : {}; // id -> priority ('high' | 'medium' | 'low')
  });

  // Фильтры
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedFormat, setSelectedFormat] = useState('Все');

  // Модальное окно создания ивента (для админа)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '', category: 'Олимпиада', format: 'Онлайн', age: '14-18 лет',
    deadline: '', location: '', description: '', link: ''
  });

  // Сохранение в localStorage
  useEffect(() => {
    localStorage.setItem('cis_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('cis_favorites', JSON.stringify(favorites));
  }, [favorites]);

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

  // Добавление ивента админом
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.description) return;
    const item = {
      id: Date.now(),
      ...newEvent,
      active: true
    };
    setActivities([item, ...activities]);
    setNewEvent({ title: '', category: 'Олимпиада', format: 'Онлайн', age: '14-18 лет', deadline: '', location: '', description: '', link: '' });
    setIsModalOpen(false);
  };

  // Удаление ивента админом
  const handleDeleteEvent = (id) => {
    setActivities(activities.filter(item => item.id !== id));
  };

  // Переключение статуса активность/неактивность
  const handleToggleActive = (id) => {
    setActivities(activities.map(item => item.id === id ? { ...item, active: !item.active } : item));
  };

  // Фильтрация
  const filteredActivities = activities.filter(item => {
    if (!item.active && user.role !== 'admin') return false;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Все' || item.category === selectedCategory;
    const matchesFormat = selectedFormat === 'Все' || item.format.includes(selectedFormat);
    return matchesSearch && matchesCat && matchesFormat;
  });

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

          <div className="flex items-center gap-2">
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
            {user.role === 'admin' && (
              <button 
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${activeTab === 'admin' ? 'bg-indigo-700 text-white shadow' : 'text-indigo-200 hover:bg-indigo-800'}`}
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                Админ-панель
              </button>
            )}

            {/* Быстрое переключение роли для теста */}
            <button 
              onClick={() => setUser(prev => ({ ...prev, role: prev.role === 'admin' ? 'student' : 'admin' }))}
              className="ml-4 text-xs bg-indigo-800 hover:bg-indigo-700 text-indigo-200 px-3 py-2 rounded-lg border border-indigo-700 transition"
              title="Переключить режим Студент / Админ"
            >
              Роль: <span className="font-bold text-white">{user.role === 'admin' ? '👑 Админ' : '🎓 Студент'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
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
                {user.role === 'admin' && (
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition"
                  >
                    <Plus className="w-5 h-5" /> Добавить ивент
                  </button>
                )}
              </div>

              {/* Фильтры категорий */}
              <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2">Категория:</span>
                {['Все', 'Олимпиада', 'Волонтерство', 'Стажировка', 'Конкурс'].map(cat => (
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

            {filteredActivities.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-500 text-base">Активностей по вашему запросу не найдено.</p>
              </div>
            )}
          </div>
        )}

        {/* ВКЛАДКА: ПРОФИЛЬ / ПОРТФОЛИО */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto">
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
        {activeTab === 'admin' && user.role === 'admin' && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Панель администратора</h2>
                <p className="text-sm text-slate-500">Управление объявлениями, ссылками и статусами активностей</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 shadow-sm transition"
              >
                <Plus className="w-4 h-4" /> Создать ивент
              </button>
            </div>

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
                            onClick={() => handleToggleActive(item.id)}
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
          </div>
        )}

      </main>

      {/* МОДАЛЬНОЕ ОКНО СОЗДАНИЯ ИВЕНТА */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Новое объявление об ивенте</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
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
                    onChange={e => setNewEvent({...newEvent, category: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Олимпиада">Олимпиада</option>
                    <option value="Волонтерство">Волонтерство</option>
                    <option value="Стажировка">Стажировка</option>
                    <option value="Конкурс">Конкурс</option>
                  </select>
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
                    required
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
                <label className="block text-xs font-medium text-slate-600 mb-1">Место проведения</label>
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
                  onClick={() => setIsModalOpen(false)}
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

    </div>
  );
}
