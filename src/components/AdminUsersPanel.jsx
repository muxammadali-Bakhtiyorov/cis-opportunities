import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminUsersPanel({ currentUserId }) {
  const [users, setUsers] = useState([]);
  const [adminIds, setAdminIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [busyUserId, setBusyUserId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loadUsers = async () => {
    const [profilesResult, rolesResult] = await Promise.all([
      supabase.from('profiles').select('id, email, full_name, created_at').order('created_at', { ascending: false }),
      supabase.from('user_roles').select('user_id').eq('role', 'admin')
    ]);

    if (profilesResult.error || rolesResult.error) {
      setErrorMessage(
        profilesResult.error?.message
        || rolesResult.error?.message
        || 'Не удалось загрузить пользователей.'
      );
      setLoading(false);
      return;
    }

    setUsers(profilesResult.data || []);
    setAdminIds(new Set((rolesResult.data || []).map(role => role.user_id)));
    setErrorMessage('');
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const changeAdminRole = async (user) => {
    const makeAdmin = !adminIds.has(user.id);
    if (!makeAdmin && !window.confirm(`Снять права администратора у ${user.email || 'этого пользователя'}?`)) {
      return;
    }

    setBusyUserId(user.id);
    setErrorMessage('');
    const { error } = await supabase.rpc('set_user_admin', {
      _target_user_id: user.id,
      _grant_admin: makeAdmin
    });

    if (error) {
      setErrorMessage(`Не удалось изменить права: ${error.message}`);
    } else {
      await loadUsers();
    }
    setBusyUserId('');
  };

  if (loading) {
    return <p className="py-8 text-center text-sm text-slate-500">Загрузка пользователей...</p>;
  }

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <h3 className="font-bold text-slate-900">Пользователи</h3>
        <p className="text-sm text-slate-500 mt-1">Назначайте и снимайте права администратора.</p>
      </div>
      {errorMessage && (
        <p role="alert" className="m-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</p>
      )}
      {users.length === 0 ? (
        <p className="p-6 text-center text-sm text-slate-500">Пользователи пока не зарегистрированы.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                <th className="p-4">Пользователь</th>
                <th className="p-4">Зарегистрирован</th>
                <th className="p-4">Роль</th>
                <th className="p-4 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {users.map(user => {
                const isAdmin = adminIds.has(user.id);
                const isCurrentUser = user.id === currentUserId;
                return (
                  <tr key={user.id}>
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{user.full_name || 'Без имени'}</div>
                      <div className="text-xs text-slate-500">{user.email || 'Нет электронной почты'}</div>
                    </td>
                    <td className="p-4 text-xs text-slate-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${isAdmin ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                        {isAdmin ? 'Администратор' : 'Пользователь'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => changeAdminRole(user)}
                        disabled={busyUserId === user.id || (isAdmin && isCurrentUser)}
                        title={isAdmin && isCurrentUser ? 'Нельзя снять собственные права администратора' : ''}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${isAdmin ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                      >
                        {busyUserId === user.id ? 'Сохранение...' : isCurrentUser && isAdmin ? 'Это вы' : isAdmin ? 'Снять права' : 'Сделать админом'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
