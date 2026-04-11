'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Users, Mail, Shield, Trash2, Loader2,
  Calendar, User as UserIcon, Plus, X, Key, Eye, EyeOff,
  ChevronDown, Check, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UsersPage() {
  const { user: currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [resetModal, setResetModal] = useState<{ open: boolean; userId: number | null; username: string }>({ open: false, userId: null, username: '' });
  const [newPassword, setNewPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [createForm, setCreateForm] = useState({
    username: '', fullname: '', email: '', password: '', role: 'editor', profession: ''
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || currentUser?.role !== 'admin')) {
      router.push('/admin');
    }
  }, [authLoading, isAuthenticated, currentUser]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, { credentials: 'include' });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(createForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Không thể tạo người dùng');
      setCreateForm({ username: '', fullname: '', email: '', password: '', role: 'editor', profession: '' });
      setShowCreateForm(false);
      fetchUsers();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (!confirm(`Xóa tài khoản "${username}"? Thao tác này không thể hoàn tác.`)) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: 'DELETE', credentials: 'include'
      });
      if (!res.ok) {
        const d = await res.json();
        alert(d.message || 'Không thể xóa người dùng');
        return;
      }
      fetchUsers();
    } catch (err) {
      alert('Có lỗi xảy ra khi xóa người dùng');
    }
  };

  const handleResetPassword = async () => {
    if (!resetModal.userId || !newPassword) return;
    setResetLoading(true);
    setResetMsg(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${resetModal.userId}/reset-password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResetMsg({ type: 'success', text: 'Đã đặt lại mật khẩu thành công!' });
      setNewPassword('');
      setTimeout(() => { setResetModal({ open: false, userId: null, username: '' }); setResetMsg(null); }, 2000);
    } catch (err: any) {
      setResetMsg({ type: 'error', text: err.message });
    } finally {
      setResetLoading(false);
    }
  };

  const handleChangeRole = async (id: number, role: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role })
      });
      fetchUsers();
    } catch (err) {
      alert('Không thể thay đổi vai trò');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-all">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý Người dùng</h1>
              <p className="text-sm text-slate-500">{users.length} thành viên trong hệ thống</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-5 py-2.5 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={18} className="mr-2" />
            Tạo người dùng
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Users Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Người dùng</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Email</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Vai trò</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Tham gia</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-5"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full"/><div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded"/></div></td>
                      <td className="px-6 py-5"><div className="h-4 w-40 bg-slate-100 dark:bg-slate-800 rounded"/></td>
                      <td className="px-6 py-5"><div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-full"/></td>
                      <td className="px-6 py-5"><div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded"/></td>
                      <td className="px-6 py-5 text-right"><div className="h-8 w-20 bg-slate-100 dark:bg-slate-800 rounded ml-auto"/></td>
                    </tr>
                  ))
                ) : users.map((u) => (
                  <tr key={u.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                          {u.avatar ? <img src={u.avatar} className="w-full h-full rounded-full object-cover" /> : (u.fullname || u.username)?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{u.fullname || u.username}</p>
                          <p className="text-xs text-slate-400">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{u.email || <span className="italic text-slate-300">Chưa cập nhật</span>}</td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role || 'editor'}
                        disabled={u.id === currentUser?.id}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border-0 cursor-pointer outline-none transition-colors",
                          u.role === 'admin' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700",
                          u.id === currentUser?.id && "opacity-60 cursor-not-allowed"
                        )}
                      >
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(u.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          title="Reset mật khẩu"
                          onClick={() => setResetModal({ open: true, userId: u.id, username: u.username })}
                          className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                        >
                          <Key size={16} />
                        </button>
                        <button
                          title="Xóa tài khoản"
                          onClick={() => handleDelete(u.id, u.username)}
                          disabled={u.id === currentUser?.id || (u.role === 'admin' && users.filter(x => x.role === 'admin').length <= 1)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tạo người dùng mới</h2>
              <button onClick={() => { setShowCreateForm(false); setCreateError(''); }} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            {createError && (
              <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl mb-6 text-sm text-red-600 dark:text-red-400">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tên đăng nhập *</label>
                  <input required type="text" placeholder="username" value={createForm.username}
                    onChange={e => setCreateForm({ ...createForm, username: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Họ tên</label>
                  <input type="text" placeholder="Nguyễn Văn A" value={createForm.fullname}
                    onChange={e => setCreateForm({ ...createForm, fullname: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
                <input type="email" placeholder="email@example.com" value={createForm.email}
                  onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Mật khẩu * <span className="normal-case font-normal">(tối thiểu 8 ký tự, gồm chữ và số)</span></label>
                <input required type="password" placeholder="••••••••" value={createForm.password}
                  onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Vai trò</label>
                  <select value={createForm.role} onChange={e => setCreateForm({ ...createForm, role: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary">
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Ngành nghề</label>
                  <input type="text" placeholder="System Engineer" value={createForm.profession}
                    onChange={e => setCreateForm({ ...createForm, profession: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button type="button" onClick={() => { setShowCreateForm(false); setCreateError(''); }}
                  className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-2xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Hủy bỏ
                </button>
                <button type="submit" disabled={createLoading}
                  className="flex-1 py-3 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center">
                  {createLoading ? <Loader2 size={18} className="animate-spin mr-2" /> : <Plus size={18} className="mr-2" />}
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetModal.open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Đặt lại mật khẩu</h2>
                <p className="text-sm text-slate-500 mt-1">Tài khoản: <span className="font-bold text-primary">@{resetModal.username}</span></p>
              </div>
              <button onClick={() => { setResetModal({ open: false, userId: null, username: '' }); setNewPassword(''); setResetMsg(null); }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            {resetMsg && (
              <div className={cn("flex items-center space-x-2 p-4 rounded-2xl mb-6 text-sm",
                resetMsg.type === 'success' ? "bg-emerald-50 border border-emerald-200 text-emerald-600" : "bg-red-50 border border-red-200 text-red-600"
              )}>
                {resetMsg.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                <span>{resetMsg.text}</span>
              </div>
            )}

            <div className="relative mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Mật khẩu mới</label>
              <input
                type={showNewPass ? 'text' : 'password'}
                placeholder="Tối thiểu 8 ký tự, gồm chữ và số"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="button" onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600">
                {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex space-x-3">
              <button onClick={() => { setResetModal({ open: false, userId: null, username: '' }); setNewPassword(''); setResetMsg(null); }}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-colors">
                Hủy bỏ
              </button>
              <button onClick={handleResetPassword} disabled={resetLoading || !newPassword}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center">
                {resetLoading ? <Loader2 size={18} className="animate-spin mr-2" /> : <Key size={18} className="mr-2" />}
                Xác nhận đặt lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
