'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, Plus, Search, Loader2, Edit, Trash2, Shield, User as UserIcon,
  Mail, Lock, Eye, EyeOff, AlertCircle, Check, X, Menu,
  Phone, Briefcase, Calendar, MapPin
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
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
  phone?: string | null;
  address?: string | null;
  birthday?: string | null;
  is_active: boolean;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [viewUser, setViewUser] = useState<AdminUser | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [resetModal, setResetModal] = useState<{ open: boolean; userId: number | null; username: string }>({ open: false, userId: null, username: '' });
  const [newPassword, setNewPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [createForm, setCreateForm] = useState({
    username: '', fullname: '', email: '', password: '', role: 'user', profession: ''
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

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userToDelete.id));
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      } else {
        const data = await res.json();
        setStatusMsg({ type: 'error', text: data.message || 'Không thể xóa người dùng' });
      }
    } catch (err) { 
      console.error(err); 
      setStatusMsg({ type: 'error', text: 'Đã xảy ra lỗi khi xóa người dùng' });
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (user: AdminUser) => {
    if (user.id === currentUser?.id) {
      setStatusMsg({ type: 'error', text: 'Bạn không thể tự xóa tài khoản của chính mình!' });
      return;
    }
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    if (statusMsg) {
      const timer = setTimeout(() => setStatusMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMsg]);

  const handleToggleStatus = async (user: AdminUser) => {
    if (user.id === currentUser?.id) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_active: !user.is_active })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
      }
    } catch (err) { console.error(err); }
  };

  const filteredUsers = users.filter(u =>
    u.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm thành viên..."
        primaryAction={{
          label: "Thêm thành viên",
          icon: Plus,
          onClick: () => setShowCreateForm(true)
        }}
      />

      {statusMsg && (
        <div className={cn(
          "mb-6 p-4 rounded-xl text-sm font-bold flex items-center space-x-3 animate-in slide-in-from-top-4 duration-300",
          statusMsg.type === 'success' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
        )}>
          {statusMsg.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="ml-auto text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="space-y-6">
        <AdminCard padding="p-0" title={`Danh sách thành viên (${filteredUsers.length})`} icon={Users}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thông tin</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email & Ngày tham gia</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vai trò</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className={cn(
                    "group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                    !u.is_active && "opacity-60 grayscale-[0.5]"
                  )}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                          {u.avatar ? <img src={u.avatar} alt={u.fullname} className="w-full h-full object-cover" /> : (u.fullname || u.username)?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p onClick={() => setViewUser(u)} className="font-bold text-slate-900 dark:text-white hover:text-primary cursor-pointer transition-colors">
                            {u.fullname || u.username}
                          </p>
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
                        value={u.role || 'user'}
                        disabled={u.id === currentUser?.id}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-bold outline-none transition-all cursor-pointer",
                          u.role === 'admin' ? "bg-amber-100 text-amber-700" :
                            u.role === 'editor' ? "bg-blue-100 text-blue-700" :
                              "bg-slate-100 text-slate-600"
                        )}>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="user">User</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={u.id === currentUser?.id}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold transition-all",
                          u.is_active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
                          u.id !== currentUser?.id && "hover:scale-105 active:scale-95"
                        )}
                      >
                        {u.is_active ? "Hoạt động" : "Bị chặn"}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1 transition-opacity">
                        <button 
                          onClick={() => setResetModal({ open: true, userId: u.id, username: u.username })}
                          disabled={u.id === currentUser?.id}
                          title={u.id === currentUser?.id ? "Bạn không thể tự reset mật khẩu của mình" : "Đặt lại mật khẩu"}
                          className={cn(
                            "p-1.5 text-slate-400 rounded-lg transition-all",
                            u.id === currentUser?.id ? "opacity-30 cursor-not-allowed" : "hover:text-primary hover:bg-primary/5"
                          )}
                        >
                          <Lock size={14} />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(u)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                          title="Xóa người dùng"
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
        </AdminCard>
      </div>

      {/* ── View User Details Overlay ── */}
      {viewUser && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewUser(null)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-950 rounded-2xl p-0 shadow-2xl overflow-hidden animate-fade-in">
            <div className="h-24 bg-gradient-to-r from-primary to-indigo-600 w-full" />
            <button onClick={() => setViewUser(null)} className="absolute right-4 top-4 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all">
              <X size={20} />
            </button>
            <div className="px-8 pb-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-10 mb-8 px-2">
                <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 shadow-xl overflow-hidden flex items-center justify-center">
                  {viewUser.avatar ? <img src={viewUser.avatar} className="w-full h-full object-cover" /> : <UserIcon size={40} className="text-slate-400" />}
                </div>
                <div className="mt-4 sm:mt-0 pb-1">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{viewUser.fullname || viewUser.username}</h3>
                  <div className="flex items-center mt-1 space-x-3">
                    <span className="text-xs font-bold text-slate-400">@{viewUser.username}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest",
                      viewUser?.role === 'admin' ? "bg-amber-100 text-amber-600" :
                        viewUser?.role === 'editor' ? "bg-blue-100 text-blue-600" :
                          "bg-slate-100 text-slate-600"
                    )}>{viewUser?.role}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                {[
                  { label: 'Email', value: viewUser.email, icon: Mail },
                  { label: 'Số điện thoại', value: viewUser.phone, icon: Phone },
                  { label: 'Ngành nghề', value: viewUser.profession, icon: Briefcase },
                  { label: 'Ngày sinh', value: viewUser?.birthday, icon: Calendar },
                  { label: 'Địa chỉ', value: viewUser?.address, icon: MapPin },
                  { label: 'Ngày tham gia', value: viewUser?.created_at ? new Date(viewUser.created_at).toLocaleString('vi-VN') : null, icon: Check },
                ].map(item => (
                  <div key={item.label}>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</label>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                      {item.value || <span className="text-slate-300 italic">Chưa cập nhật</span>}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button onClick={() => setViewUser(null)} className="px-6 py-2.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Form Overlay ── */}
      {showCreateForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCreateForm(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 rounded-xl p-8 shadow-2xl overflow-hidden">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Thêm user</h2>
            </div>
            {createError && <div className="p-4 bg-red-50 text-red-500 rounded-lg text-sm mb-6 text-center">{createError}</div>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Username</label>
                  <input required placeholder="Username" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                    value={createForm.username} onChange={e => setCreateForm({ ...createForm, username: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Họ tên</label>
                  <input placeholder="Họ và tên" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                    value={createForm.fullname} onChange={e => setCreateForm({ ...createForm, fullname: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Email</label>
                <input required type="email" placeholder="mac@example.com" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                  value={createForm.email} onChange={e => setCreateForm({ ...createForm, email: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Mật khẩu</label>
                  <input required type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                    value={createForm.password} onChange={e => setCreateForm({ ...createForm, password: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Vai trò</label>
                  <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm appearance-none"
                    value={createForm.role} onChange={e => setCreateForm({ ...createForm, role: e.target.value })}>
                    <option value="user">User</option>
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
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        title="Xóa người dùng?"
        message={`Bạn có chắc chắn muốn xóa vĩnh viễn người dùng ${userToDelete?.fullname || userToDelete?.username}? Hành động này không thể hoàn tác.`}
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
        loading={isDeleting}
      />
    </>
  );
}
