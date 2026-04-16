'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, Lock, Bell, Shield, Palette, Globe, 
  Loader2, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Loader2 size={40} className="animate-spin text-primary" /></div>;
  if (!isAuthenticated) return null;

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">Cài đặt hệ thống</h1>
          <p className="text-slate-500 dark:text-slate-400">Quản lý cấu hình danh mục, bảo mật và giao diện</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center min-w-[140px]"
        >
          {saving ? <Loader2 size={20} className="animate-spin mr-2" /> : <Save size={20} className="mr-2" />}
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </header>

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl flex items-center text-green-600 dark:text-green-400 text-sm font-medium animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={18} className="mr-2" />
          Đã cập nhật cấu hình thành công!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Left Column: Sections Navigation */}
          <div className="space-y-2">
            {[
              { id: 'general', label: 'Cài đặt chung', icon: Globe },
              { id: 'security', label: 'Bảo mật', icon: Shield },
              { id: 'appearance', label: 'Giao diện', icon: Palette },
              { id: 'notifications', label: 'Thông báo', icon: Bell }
            ].map((item) => (
              <button key={item.id} className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                item.id === 'general' ? "bg-white dark:bg-slate-900 shadow-sm text-primary" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}>
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Column: Settings Content */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 md:p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                  < Globe size={20} className="mr-2 text-primary" />
                  Thông tin Website
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Tiêu đề Website</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20" defaultValue="Luu Dinh Mac | Portfolio" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Mô tả SEO</label>
                    <textarea className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 h-24 resize-none" defaultValue="Portfolio cá nhân của Lưu Đình Mác - Kỹ sư hệ thống (Linux Expert)." />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Chế độ bảo trì</p>
                        <p className="text-xs text-slate-500">Tạm thời ngừng truy cập công khai</p>
                      </div>
                      <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                  </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <Lock size={20} className="mr-2 text-primary" />
                  Đổi mật khẩu tài khoản
                </h3>
                <div className="space-y-4">
                  <input type="password" placeholder="Mật khẩu hiện tại" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl outline-none" />
                  <input type="password" placeholder="Mật khẩu mới" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl outline-none" />
                  <input type="password" placeholder="Xác nhận mật khẩu mới" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl outline-none" />
                </div>
            </div>
          </div>
      </div>
    </div>
  );
}
