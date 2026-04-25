'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, Plus, Loader2, Trash2, User as UserIcon,
  Mail, Lock, Eye, EyeOff, AlertCircle, Check, X,
  Phone, Briefcase, Calendar, MapPin,
  Settings, Shield, ShieldAlert, ShieldOff, MessageSquareOff, Edit3
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import AdminPageHeader from '@/features/admin/components/AdminPageHeader';
import AdminCard from '@/features/admin/components/AdminCard';
import UserAvatar from '@/features/users/components/UserAvatar';
import Badge from '@/shared/components/common/Badge';
import FormattedDate from '@/shared/components/common/FormattedDate';
import Button from '@/shared/components/ui/Button';
import IconBadge from '@/shared/components/ui/IconBadge';
import AnimateList from '@/shared/components/ui/AnimateList';
import ConfirmationDialog from '@/shared/components/ui/ConfirmationDialog';
import PromptDialog from '@/shared/components/ui/PromptDialog';

import { userService } from '@/features/users/services/userService';
import { User as AdminUser, UserRole } from '@portfolio/contracts';

const ROLE_HIERARCHY: Record<string, number> = {
  'superadmin': 100,
  'admin': 50,
  'editor': 20,
  'user': 10
};

export default function UsersPage() {
  const { user: currentUser, isAuthenticated, loading: authLoading } = useAuth();
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
  const [settingsUser, setSettingsUser] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [promptData, setPromptData] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    userId: number | null;
    fields: any;
  }>({ isOpen: false, title: '', message: '', userId: null, fields: null });

  const [createForm, setCreateForm] = useState({
    username: '', fullname: '', email: '', password: '', role: 'user', profession: ''
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !['admin', 'superadmin'].includes(currentUser?.role || ''))) {
      router.push('/admin');
    }
  }, [authLoading, isAuthenticated, currentUser, router]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');
    try {
      await userService.create(createForm);
      setShowCreateForm(false);
      setCreateForm({ username: '', fullname: '', email: '', password: '', role: 'user', profession: '' });
      fetchUsers();
    } catch (err: any) {
      setCreateError(err.response?.data?.message || 'Lỗi đăng ký');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdatePermissions = async (userId: number, fields: { role?: UserRole | string; is_active?: boolean; can_comment?: boolean; can_post?: boolean }, reason?: string) => {
    try {
      if (fields.is_active === false && userId === currentUser?.id) {
        setStatusMsg({ type: 'error', text: 'Bạn không thể tự khóa tài khoản của mình!' });
        return;
      }

      // If we need a reason and it's not provided yet, open prompt
      const isRestricting = fields.is_active === false || fields.can_comment === false || fields.can_post === false;
      if (isRestricting && reason === undefined) {
        setPromptData({
          isOpen: true,
          title: 'Lý do thực hiện',
          message: 'Vui lòng nhập lý do thực hiện hành động này (ví dụ: Vi phạm quy định cộng đồng):',
          userId,
          fields
        });
        return;
      }

      const updateData = { ...fields, reason };
      await userService.updatePermissions(userId, updateData);
      
      setUsers(users.map(u => u.id === userId ? { ...u, ...fields } as AdminUser : u));
      if (settingsUser?.id === userId) {
        setSettingsUser(prev => prev ? { ...prev, ...fields } : null);
      }
      setStatusMsg({ type: 'success', text: 'Đã cập nhật quyền hạn thành công' });
      setPromptData({ ...promptData, isOpen: false });
    } catch (err: any) { 
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Không thể cập nhật quyền hạn' });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !resetModal.userId) return;
    setResetLoading(true);
    try {
      await userService.resetPassword(resetModal.userId, { newPassword });
      setStatusMsg({ type: 'success', text: `Đã đặt lại mật khẩu cho ${resetModal.username}` });
      setResetModal({ open: false, userId: null, username: '' });
      setNewPassword('');
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Không thể đặt lại mật khẩu' });
    } finally {
      setResetLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await userService.delete(userToDelete.id);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      setStatusMsg({ type: 'success', text: 'Đã xóa người dùng thành công' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Không thể xóa người dùng' });
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
      await userService.toggleStatus(user.id, user.is_active || false);
      const updatedUser = { ...user, is_active: !user.is_active };
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      if (settingsUser?.id === user.id) {
        setSettingsUser(updatedUser);
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

  const canModifyUser = (targetUser: AdminUser) => {
    if (!currentUser) return false;
    if (currentUser.role === 'superadmin') return true;
    if (targetUser.id === currentUser.id) return false; // Usually handle self via profile, but here we block self-mod in table actions
    
    const currentLevel = ROLE_HIERARCHY[currentUser.role] || 0;
    const targetLevel = ROLE_HIERARCHY[targetUser.role] || 0;
    
    return currentLevel > targetLevel;
  };

  const getRoleDisplayName = (role: string) => {
    if (role === 'superadmin') return 'SUPER ADMIN';
    return role.toUpperCase();
  };

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
          "mb-6 p-4 rounded-xl text-sm font-bold flex items-center space-x-3 animate-in slide-in-from-top-4 duration-300 shadow-sm border",
          statusMsg.type === 'success' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
        )}>
          {statusMsg.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="ml-auto text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="space-y-1">
        <AdminCard padding="p-0" title={`Danh sách thành viên (${filteredUsers.length})`} icon={Users}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thông tin</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email & Ngày tham gia</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vai trò</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <AnimateList component="tbody" className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className={cn(
                    "group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                    !u.is_active && "opacity-60 grayscale-[0.3]"
                  )}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <UserAvatar user={u} size="md" />
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
                      <p className="text-[10px] text-slate-400 font-medium">
                        Tham gia: <FormattedDate date={u.created_at || ''} className="font-bold" />
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge type="role" variant={u.role as any}>{getRoleDisplayName(u.role)}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-center">
                        <span className={cn("px-2 py-[3px] rounded-md text-[10px] font-bold min-w-20 text-center shadow-sm", u.is_active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
                          {u.is_active ? "Hoạt động" : "Bị chặn Login"}
                        </span>
                        {(!u.can_comment || !u.can_post) && (
                           <div className="flex gap-1 justify-center mt-0.5">
                             {!u.can_comment && <span className="bg-orange-100/80 text-orange-700 px-1.5 py-[2px] text-[9px] rounded font-bold" title="Cấm bình luận"><MessageSquareOff size={8} className="inline mr-1" />Cmt</span>}
                             {!u.can_post && <span className="bg-orange-100/80 text-orange-700 px-1.5 py-[2px] text-[9px] rounded font-bold" title="Cấm đăng bài"><Edit3 size={8} className="inline mr-1" />Bài</span>}
                           </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1 relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn("h-8 w-8 transition-all", settingsUser?.id === u.id && "bg-slate-100 dark:bg-slate-800")}
                          onClick={() => setSettingsUser(u)}
                          disabled={!canModifyUser(u)}
                        >
                          <Settings size={14} className={cn("text-slate-400", !canModifyUser(u) && "opacity-20")} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-red-600 hover:bg-red-50"
                          onClick={() => openDeleteModal(u)}
                          disabled={!canModifyUser(u)}
                        >
                          <Trash2 size={14} className={cn("text-slate-400", !canModifyUser(u) && "opacity-20")} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </AnimateList>
            </table>
          </div>
        </AdminCard>
      </div>

      {/* ── View User Details Overlay ── */}
      {viewUser && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewUser(null)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-950 rounded-2xl p-0 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="h-24 bg-gradient-to-r from-primary to-blue-600 w-full" />
            <button onClick={() => setViewUser(null)} className="absolute right-4 top-4 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all">
              <X size={20} />
            </button>
            <div className="px-8 pb-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-10 mb-8 px-2">
                <UserAvatar user={viewUser} size="lg" className="border-4 border-white dark:border-slate-950 shadow-xl" />
                <div className="mt-4 sm:mt-0 pb-1">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{viewUser.fullname || viewUser.username}</h3>
                  <div className="flex items-center mt-1 space-x-3">
                    <span className="text-xs font-bold text-slate-400">@{viewUser.username}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 px-2">
                {[
                  { label: 'Email', value: viewUser.email, icon: Mail },
                  { label: 'Số điện thoại', value: viewUser.phone, icon: Phone },
                  { label: 'Ngành nghề', value: viewUser.profession, icon: Briefcase },
                  { label: 'Ngày sinh', value: viewUser?.birthday, icon: Calendar },
                  { label: 'Địa chỉ', value: viewUser?.address, icon: MapPin },
                  { label: 'Ngày tham gia', value: <FormattedDate date={viewUser?.created_at || ''} />, icon: Check },
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
                <Button variant="outline" onClick={() => setViewUser(null)}>
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Form Overlay ── */}
      {showCreateForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCreateForm(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 rounded-2xl p-8 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Thêm thành viên mới</h2>
              <p className="text-sm text-slate-400 mt-1">Điền thông tin để tạo tài khoản mới trong hệ thống.</p>
            </div>
            {createError && <div className="p-4 bg-red-50 text-red-500 rounded-xl text-xs mb-6 text-center border border-red-100 font-medium">{createError}</div>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Username</label>
                  <input required placeholder="Username" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={createForm.username} onChange={e => setCreateForm({ ...createForm, username: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Họ tên</label>
                  <input placeholder="Họ và tên" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={createForm.fullname} onChange={e => setCreateForm({ ...createForm, fullname: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Email</label>
                <input required type="email" placeholder="mac@example.com" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={createForm.email} onChange={e => setCreateForm({ ...createForm, email: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Mật khẩu</label>
                  <input required type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={createForm.password} onChange={e => setCreateForm({ ...createForm, password: e.target.value })} />
                </div>
              </div>
              <Button type="submit" isLoading={createLoading} className="w-full" size="lg">
                Tạo tài khoản
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* ── Reset Password Modal ── */}
      {resetModal.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setResetModal({ open: false, userId: null, username: '' })} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-950 rounded-2xl p-8 shadow-2xl animate-in fade-in scale-95 duration-200">
            <h2 className="text-xl font-bold mb-2">Đặt lại mật khẩu</h2>
            <p className="text-sm text-slate-500 mb-6 font-medium">Người dùng: <span className="text-primary">@{resetModal.username}</span></p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <input required type={showNewPass ? 'text' : 'password'} placeholder="Mật khẩu mới..."
                  className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                  value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <Button type="submit" isLoading={resetLoading} className="w-full" size="lg">
                Xác nhận thay đổi
              </Button>
            </form>
          </div>
        </div>
      )}
      {/* ── User Settings Modal (Portal) ── */}
      {settingsUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSettingsUser(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-1 py-1 border-b border-slate-100 dark:border-slate-800 mb-6 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                 <IconBadge icon={Settings} size="sm" color="blue" /> Box Cài Đặt
              </span>
              <button onClick={() => setSettingsUser(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 transition-all">
                <X size={18}/>
              </button>
            </div>

            <div className="flex items-center gap-3 mb-8 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
               <UserAvatar user={settingsUser} size="md" />
               <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">{settingsUser.fullname || settingsUser.username}</p>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">@{settingsUser.username}</p>
               </div>
            </div>

            <div className="space-y-1.5">
              <button 
                className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all group" 
                onClick={() => { setResetModal({ open: true, userId: settingsUser.id, username: settingsUser.username }); setSettingsUser(null); }}
              >
                <div className="flex items-center"><Lock size={16} className="mr-3 text-slate-400 group-hover:text-primary transition-colors" /> Đổi mật khẩu</div>
                <div className="text-[9px] uppercase tracking-tighter text-slate-400 group-hover:text-primary">Update</div>
              </button>

              <div className="h-px bg-slate-100 dark:bg-slate-800 mx-2 my-2" />

              {[
                { 
                   label: settingsUser.role === 'superadmin' ? 'Quyền Master (Tối cao)' : 'Quyền Admin', 
                   icon: settingsUser.role === 'superadmin' ? ShieldAlert : Shield, 
                   color: settingsUser.role === 'superadmin' ? 'text-primary' : 'text-blue-500', 
                   active: settingsUser.role === 'superadmin' || settingsUser.role === 'admin',
                   disabled: settingsUser.role === 'superadmin',
                   onClick: () => {
                     if (settingsUser.role === 'superadmin') return;
                     handleUpdatePermissions(settingsUser.id, { role: settingsUser.role === 'admin' ? 'user' : 'admin' });
                   }
                },
                { 
                   label: 'Khóa Đăng nhập', 
                   icon: ShieldAlert, 
                   color: 'text-red-500', 
                   active: !settingsUser.is_active,
                   onClick: () => handleUpdatePermissions(settingsUser.id, { is_active: !settingsUser.is_active })
                },
                { 
                   label: 'Cấm Bình luận', 
                   icon: MessageSquareOff, 
                   color: 'text-orange-500', 
                   active: !settingsUser.can_comment,
                   onClick: () => handleUpdatePermissions(settingsUser.id, { can_comment: !settingsUser.can_comment })
                },
                { 
                   label: 'Cấm Đăng bài', 
                   icon: Edit3, 
                   color: 'text-orange-500', 
                   active: !settingsUser.can_post,
                   onClick: () => handleUpdatePermissions(settingsUser.id, { can_post: !settingsUser.can_post })
                }
              ].map((item, idx) => (
                <button 
                  key={idx}
                  className={cn(
                    "w-full justify-between flex items-center px-4 py-3 text-xs font-bold transition-all rounded-2xl",
                    item.disabled 
                      ? "opacity-50 cursor-not-allowed bg-slate-50/50 dark:bg-slate-800/20 text-slate-400" 
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                  onClick={item.onClick}
                  disabled={item.disabled}
                >
                  <div className="flex items-center"><item.icon size={16} className={cn("mr-3", item.color)} /> {item.label}</div>
                  <div className={cn(
                    "w-8 h-4 rounded-full transition-all relative p-0.5", 
                    item.active ? "bg-primary shadow-inner shadow-primary/20" : "bg-slate-200 dark:bg-slate-700",
                    item.disabled && "grayscale"
                  )}>
                    <div className={cn("absolute top-1 w-2 h-2 rounded-full bg-white transition-all shadow-sm", item.active ? "right-1" : "left-1")} />
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
               <Button variant="outline" className="w-full rounded-2xl py-2" onClick={() => setSettingsUser(null)}>Đóng</Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        title="Xóa người dùng?"
        message={`Bạn có chắc chắn muốn xóa vĩnh viễn người dùng ${userToDelete?.fullname || userToDelete?.username}? Hành động này không thể hoàn tác.`}
        confirmLabel="Xác nhận xóa"
        isLoading={isDeleting}
      />
      <PromptDialog
        isOpen={promptData.isOpen}
        onClose={() => setPromptData({ ...promptData, isOpen: false })}
        onConfirm={(reason) => {
          if (promptData.userId && promptData.fields) {
            handleUpdatePermissions(promptData.userId, promptData.fields, reason);
          }
        }}
        title={promptData.title}
        message={promptData.message}
        placeholder="Ví dụ: Tài khoản spam, nội dung không phù hợp..."
      />
    </>
  );
}

