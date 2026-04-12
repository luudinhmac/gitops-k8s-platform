'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, Plus, Search, Loader2, Edit, Trash2, Shield, User as UserIcon, 
  Mail, Lock, Eye, EyeOff, AlertCircle, Check, X, Menu
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useSidebar } from '@/context/SidebarContext';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCard from '@/components/admin/AdminCard';

interface AdminUser {
  id: number;
  username: string;
  fullname: string;
  email: string;
  role: string;
  profession: string | null;
  avatar?: string | null;
  created_at?: string;
  last_login?: string;
}

export default function UsersPage() {
  const { user: currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const { setSidebarOpen } = useSidebar();
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(createForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi đăng ký');
      setShowCreateForm(false);
      setCreateForm({ username: '', fullname: '', email: '', password: '', role: 'editor', profession: '' });
      fetchUsers();
    } catch (err: unknown) {
      setCreateError((err as Error).message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleChangeRole = async (userId: number, newRole: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) { console.error(err); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setResetLoading(true);
    setResetMsg(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${resetModal.userId}/reset-password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newPassword })
      });
      if (!res.ok) throw new Error('Không thể đặt lại mật khẩu');
      setResetMsg({ type: 'success', text: `Đã đặt lại mật khẩu cho ${resetModal.username}` });
      setTimeout(() => setResetModal({ open: false, userId: null, username: '' }), 2000);
    } catch (err: unknown) {
      setResetMsg({ type: 'error', text: (err as Error).message });
    } finally {
      setResetLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (id === currentUser?.id) return alert('Không thể xóa chính mình!');
    if (!confirm('Xóa người dùng này vĩnh viễn?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: 'DELETE', credentials: 'include'
      });
      if (res.ok) fetchUsers();
    } catch (err) { console.error(err); }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader 
        title="Quản lý người dùng"
        subtitle="Quản lý tài khoản, thành viên và phân quyền hệ thống."
        primaryAction={{
          label: "Thêm thành viên",
          icon: Plus,
          onClick: () => setShowCreateForm(true)
        }}
      />

      <div className="space-y-6">
        <AdminCard padding="p-0" title="Danh sách thành viên" icon={Users}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thông tin</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email & Ngày tham gia</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vai trò</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {users.map((u) => (
                  <tr key={u.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                          {u.avatar ? <img src={u.avatar} alt={u.fullname} className="w-full h-full object-cover" /> : (u.fullname || u.username)?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{u.fullname || u.username}</p>
                          <p className="text-xs text-slate-400">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 dark:text-slate-300">{u.email || 'N/A'}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Tham gia: {u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role || 'editor'}
                        disabled={u.id === currentUser?.id}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-bold outline-none transition-all cursor-pointer",
                          u.role === 'admin' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                        )}>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                      </select>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1 transition-opacity">
                        <button onClick={() => setResetModal({ open: true, userId: u.id, username: u.username })} 
                          className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                          <Lock size={14} />
                        </button>
                        <button onClick={() => handleDeleteUser(u.id)} 
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      </div>

      {/* ── Create Form Overlay ── */}
      {showCreateForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCreateForm(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 rounded-xl p-8 shadow-2xl overflow-hidden">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Thêm quản trị viên</h2>
              <p className="text-sm text-slate-500">Tạo tài khoản mới cho cộng tác viên.</p>
            </div>
            {createError && <div className="p-4 bg-red-50 text-red-500 rounded-lg text-sm mb-6 text-center">{createError}</div>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Username</label>
                  <input required placeholder="mac.ld" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                    value={createForm.username} onChange={e => setCreateForm({...createForm, username: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Họ tên</label>
                  <input placeholder="Lưu Đình Mác" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                    value={createForm.fullname} onChange={e => setCreateForm({...createForm, fullname: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Email</label>
                <input required type="email" placeholder="mac@example.com" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                  value={createForm.email} onChange={e => setCreateForm({...createForm, email: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Mật khẩu</label>
                  <input required type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                    value={createForm.password} onChange={e => setCreateForm({...createForm, password: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Vai trò</label>
                  <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm appearance-none"
                    value={createForm.role} onChange={e => setCreateForm({...createForm, role: e.target.value})}>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <button disabled={createLoading} className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/30 hover:opacity-90 transition-all flex items-center justify-center">
                {createLoading ? <Loader2 className="animate-spin mr-2" /> : <Plus size={20} className="mr-2" />}
                Tạo tài khoản
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Reset Password Modal ── */}
      {resetModal.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setResetModal({ open: false, userId: null, username: '' })} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-950 rounded-xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-2">Đặt lại mật khẩu</h2>
            <p className="text-sm text-slate-500 mb-6">Người dùng: <span className="font-bold text-slate-900 dark:text-white">{resetModal.username}</span></p>
            
            {resetMsg && (
              <div className={cn("p-4 rounded-xl text-sm mb-6 flex items-center space-x-2",
                resetMsg?.type === 'success' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {resetMsg?.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                <span>{resetMsg?.text}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <input required type={showNewPass ? 'text' : 'password'} placeholder="Mật khẩu mới..."
                  className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                  value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button disabled={resetLoading} className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/30 flex items-center justify-center">
                {resetLoading && <Loader2 className="animate-spin mr-2" />}
                Xác nhận đổi mật khẩu
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
