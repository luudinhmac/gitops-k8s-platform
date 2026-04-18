'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon, FileText, Lock, Save, Loader2,
  ArrowLeft, Eye, EyeOff, AlertCircle, Check,
  Calendar, Phone, MapPin, Briefcase, Mail, Trash2, Edit, MessageSquare, Heart, SortAsc
} from 'lucide-react';
import { cn } from '@/lib/utils';
import UserAvatar from '@/components/common/UserAvatar';
import Navbar from '@/components/layout/Navbar';
import Badge from '@/components/common/Badge';
import FormattedDate from '@/components/common/FormattedDate';

// Professional Modules
import { postService } from '@/services/postService';
import { userService } from '@/services/userService';
import { usePostActions } from '@/hooks/post/usePostActions';
import Button from '@/components/ui/Button';
import IconBadge from '@/components/ui/IconBadge';
import AnimateList from '@/components/ui/AnimateList';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { Post, SortOption } from '@/types/post';
import { User as UserType } from '@/types/user';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading, checkAuth } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'info' | 'posts' | 'password'>('info');
  const [profileForm, setProfileForm] = useState({
    fullname: '', email: '', phone: '', address: '', profession: '', birthday: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modular Logic
  const { deletePost, isActionLoading, togglePublish } = usePostActions(() => fetchMyPosts());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/profile');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullname: user.fullname || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        profession: user.profession || '',
        birthday: user.birthday || '',
      });
    }
  }, [user]);

  const fetchMyPosts = useCallback(async () => {
    if (!user?.id) return;
    setPostsLoading(true);
    try {
      const data = await postService.getAdminPosts();
      const mine = Array.isArray(data)
        ? data
          .filter((p: Post) => p.author_id === user?.id)
          .map((p: any) => ({
            ...p,
            likes: p.likes || 0,
            comment_count: p._count?.Comment || 0
          }))
        : [];
      setMyPosts(mine);
    } catch (err) { console.error('Failed to fetch posts:', err); }
    finally { setPostsLoading(false); }
  }, [user?.id]);

  useEffect(() => {
    if (activeTab === 'posts' && user) {
      fetchMyPosts();
    }
  }, [activeTab, user, fetchMyPosts]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setSaveLoading(true);
    setSaveMsg(null);
    try {
      await userService.updateProfile(user.id, profileForm);
      setSaveMsg({ type: 'success', text: 'Đã cập nhật thông tin thành công!' });
      await checkAuth();
      setIsEditing(false);
    } catch (err: any) {
      setSaveMsg({ type: 'error', text: err.response?.data?.message || 'Không thể cập nhật thông tin' });
    } finally {
      setSaveLoading(false);
      setTimeout(() => setSaveMsg(null), 4000);
    }
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setAvatarLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadData = await userService.uploadAvatar(formData);
      const avatarUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${uploadData.url}`;

      await userService.updateProfile(user.id, { avatar: avatarUrl });
      await checkAuth();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Upload thất bại');
    } finally {
      setAvatarLoading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
      return;
    }
    setPassLoading(true);
    setPassMsg(null);
    try {
      await userService.changePassword(user.id, {
        oldPassword: passForm.oldPassword,
        newPassword: passForm.newPassword
      });
      setPassMsg({ type: 'success', text: 'Đã đổi mật khẩu thành công!' });
      setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setPassMsg({ type: 'error', text: err.response?.data?.message || 'Không thể đổi mật khẩu' });
    } finally {
      setPassLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const form = (e.currentTarget as HTMLElement).closest('form');
      if (form) {
        const elements = Array.from(form.querySelectorAll('input, select, textarea, button:not([tabindex="-1"])'))
          .filter(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden';
          }) as HTMLElement[];
        const index = elements.indexOf(e.currentTarget as HTMLElement);
        if (index > -1 && index < elements.length - 1) {
          const nextElement = elements[index + 1];
          // If the next element is the submit button, let the default Enter behavior (submit) happen
          // Unless we want to explicitly focus it first. User said "nhập ô tiếp theo", implying focus.
          if (nextElement.getAttribute('type') !== 'submit') {
            e.preventDefault();
            nextElement.focus();
          }
        }
      }
    }
  };


  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 size={40} className="animate-spin text-primary" /></div>;
  }

  const sortedPosts = [...myPosts].sort((a, b) => {
    if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
    if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
    if (sortBy === 'comments') return (b.comment_count || 0) - (a.comment_count || 0);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const tabs = [
    { id: 'info', label: 'Thông tin cá nhân', icon: UserIcon },
    { id: 'posts', label: 'Bài viết của tôi', icon: FileText },
    { id: 'password', label: 'Đổi mật khẩu', icon: Lock },
  ];

  return (
    <div className="pt-20 pb-1 px-4 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-1">
          <Link href="/" className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group/avatar cursor-pointer">
              <UserAvatar user={user} size="xl" className="rounded-2xl border-4 border-white dark:border-slate-800 shadow-xl" />
              <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 rounded-2xl transition-opacity cursor-pointer">
                {avatarLoading ? <Loader2 size={24} className="text-white animate-spin" /> : <Edit size={24} className="text-white drop-shadow-md" />}
                <span className="text-[10px] text-white font-bold uppercase mt-1">Đổi ảnh</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleUploadAvatar} disabled={avatarLoading} />
              </label>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.fullname || user?.username}</h1>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-1 bg-white dark:bg-slate-900 p-1.5 rounded-xl w-fit shadow-sm border border-slate-200 dark:border-slate-800">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as 'info' | 'posts' | 'password');
                if (tab.id !== 'info') setIsEditing(false);
              }}
              className={cn(
                "flex items-center px-5 py-2 rounded-xl text-sm font-bold transition-all",
                activeTab === tab.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              <tab.icon size={16} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content area */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-sm">
          {activeTab === 'info' && (
            <div>
              {!isEditing ? (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Thông tin cá nhân</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit size={16} className="mr-2 text-amber-500" />
                      Chỉnh sửa thông tin
                    </Button>
                  </div>

                  {saveMsg && (
                    <div className={cn("flex items-center space-x-2 p-4 rounded-xl mb-6 text-sm",
                      saveMsg.type === 'success' ? "bg-emerald-50 border border-emerald-200 text-emerald-600" : "bg-red-50 border border-red-200 text-red-600"
                    )}>
                      {saveMsg.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                      <span>{saveMsg.text}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Họ và tên', value: user?.fullname, icon: UserIcon },
                      { label: 'Email', value: user?.email, icon: Mail },
                      { label: 'Số điện thoại', value: user?.phone, icon: Phone },
                      { label: 'Ngành nghề', value: user?.profession, icon: Briefcase },
                      { label: 'Ngày sinh', value: <FormattedDate date={user?.birthday || ''} />, icon: Calendar },
                      { label: 'Địa chỉ', value: user?.address, icon: MapPin },
                    ].map(field => (
                      <div key={field.label} className="group">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                          <field.icon size={14} className="mr-2 text-slate-300" />
                          {field.label}
                        </label>
                        <p className="text-slate-700 dark:text-slate-300 font-medium py-1">
                          {field.value || <span className="text-slate-300 italic">Chưa cập nhật</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="animate-slide-up">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Cập nhật thông tin</h2>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
                    >
                      Hủy bỏ
                    </button>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { label: 'Họ và tên', key: 'fullname', placeholder: 'Nguyễn Văn A', icon: UserIcon },
                        { label: 'Email', key: 'email', placeholder: 'email@example.com', icon: Mail, type: 'email' },
                        { label: 'Số điện thoại', key: 'phone', placeholder: '0912 345 678', icon: Phone },
                        { label: 'Ngành nghề', key: 'profession', placeholder: 'System Engineer', icon: Briefcase },
                        { label: 'Ngày sinh', key: 'birthday', placeholder: '', icon: Calendar, type: 'date' },
                        { label: 'Địa chỉ', key: 'address', placeholder: 'Hồ Chí Minh, Việt Nam', icon: MapPin },
                      ].map(field => (
                        <div key={field.key}>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">{field.label}</label>
                          <div className="relative">
                            <field.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type={field.type || 'text'}
                              placeholder={field.placeholder}
                              value={(profileForm as Record<string, string>)[field.key]}
                              onChange={e => setProfileForm({ ...profileForm, [field.key]: e.target.value })}
                              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button type="submit" isLoading={saveLoading} size="lg" className="shadow-primary/30">
                      <Save size={18} className="mr-2" />
                      Cập nhật thông tin
                    </Button>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeTab === 'posts' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bài viết của tôi ({myPosts.length})</h2>

                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 text-[10px] font-bold text-slate-500">
                    <span className="px-2 text-slate-400">Sắp xếp:</span>
                    {[
                      { id: 'latest', label: 'Mới nhất' },
                      { id: 'views', label: 'Lượt xem' },
                      { id: 'likes', label: 'Thích' },
                      { id: 'comments', label: 'Bình luận' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setSortBy(opt.id as any)}
                        className={cn(
                          "px-2.5 py-1.5 rounded-lg transition-all",
                          sortBy === opt.id ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "hover:text-slate-700 dark:hover:text-slate-300"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <Link href="/admin/posts/new" className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center shrink-0">
                    <Edit size={16} className="mr-2" /> Viết bài mới
                  </Link>
                </div>
              </div>
              {postsLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
              ) : myPosts.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
                  <FileText size={40} className="mx-auto text-slate-200 dark:text-slate-800 mb-4" />
                  <p className="text-slate-500">Bạn chưa có bài viết nào.</p>
                </div>
              ) : (
                <AnimateList className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sortedPosts.map(post => (
                    <div key={post.id} className="flex items-center justify-between py-1 group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 px-2 -mx-2 rounded-xl transition-all">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center space-x-2 mb-1.5">
                          {!post.is_published && <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[9px] font-bold rounded uppercase">Ẩn</span>}
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate group-hover:text-primary transition-colors cursor-pointer">{post.title}</h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                          <span className="flex items-center">
                            <IconBadge icon={Calendar} color="slate" size="sm" animate={false} className="mr-1 bg-transparent p-0 w-auto h-auto" />
                            {new Date(post.created_at).toLocaleDateString('vi-VN')}
                          </span>
                          <span className="flex items-center">
                            <IconBadge icon={Eye} color="purple" size="sm" animate={false} className="mr-1 bg-transparent p-0 w-auto h-auto opacity-70" />
                            {post.views || 0} <span className="ml-1 hidden xs:inline">lượt xem</span>
                          </span>
                          <span className="flex items-center font-medium">
                            <IconBadge icon={Heart} color="rose" size="sm" animate={false} className="mr-1 bg-transparent p-0 w-auto h-auto" />
                            {post.likes || 0}
                          </span>
                          <span className="flex items-center font-medium">
                            <IconBadge icon={MessageSquare} color="blue" size="sm" animate={false} className="mr-1 bg-transparent p-0 w-auto h-auto" />
                            {post.comment_count || 0}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <Link href={`/admin/posts/edit/${post.id}`}>
                          <Button variant="outline" size="icon" className="hover:border-amber-200">
                            <Edit size={18} className="text-amber-500" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:border-red-200"
                          onClick={() => {
                            setPostToDelete(post.id);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </AnimateList>
              )}
            </div>
          )}

          {activeTab === 'password' && (
            <div className="max-w-md mx-auto py-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 text-center">Đổi mật khẩu bảo mật</h2>
              {passMsg && (
                <div className={cn("flex items-center space-x-2 p-4 rounded-xl mb-1 text-sm",
                  passMsg.type === 'success' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                  {passMsg.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                  <span>{passMsg.text}</span>
                </div>
              )}
              <form onSubmit={handleChangePassword} className="space-y-1">
                {[
                  { label: 'Mật khẩu hiện tại', key: 'oldPassword', show: showPass.old, toggle: () => setShowPass({ ...showPass, old: !showPass.old }) },
                  { label: 'Mật khẩu mới', key: 'newPassword', show: showPass.new, toggle: () => setShowPass({ ...showPass, new: !showPass.new }) },
                  { label: 'Xác nhận mật khẩu mới', key: 'confirmPassword', show: showPass.confirm, toggle: () => setShowPass({ ...showPass, confirm: !showPass.confirm }) },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">{field.label}</label>
                    <div className="relative">
                      <input
                        required
                        type={field.show ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={(passForm as Record<string, string>)[field.key]}
                        onChange={e => setPassForm({ ...passForm, [field.key]: e.target.value })}
                        onKeyDown={handleKeyDown}
                        className="w-full px-4 py-3.5 pr-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      />
                      <button type="button" onClick={field.toggle} tabIndex={-1} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {field.show ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                ))}
                <Button type="submit" isLoading={passLoading} className="w-full py-6 mt-4 shadow-primary/30">
                  <Lock size={14} className="mr-2" />
                  Đổi mật khẩu
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (postToDelete) {
            deletePost(postToDelete).then(() => setIsDeleteModalOpen(false));
          }
        }}
        isLoading={isActionLoading}
        title="Xóa bài viết"
        message="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác và bài viết sẽ bị gỡ bỏ vĩnh viễn."
      />
    </div>
  );
}
