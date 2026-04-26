'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, User, Eye, EyeOff, ArrowLeft, Phone, Calendar, Briefcase } from 'lucide-react';
import Button from '@/shared/components/ui/Button';

// Modular Services
import { authService } from '@/features/auth/services/authService';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullname: '',
    phone: '',
    birthday: '',
    profession: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.register(formData);
      // Success - redirect to login
      router.push('/login?registered=success');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
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
          if (nextElement.getAttribute('type') !== 'submit') {
            e.preventDefault();
            nextElement.focus();
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-[550px] w-full relative z-10 flex flex-col items-center">
        <Link
          href="/"
          className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all mb-6 group"
        >
          <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Quay lại TRANG CHỦ
        </Link>

        <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 shadow-2xl relative overflow-hidden ring-1 ring-black/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

          <div className="text-center mb-6">
            <h1 className="text-lg font-display font-black text-slate-900 dark:text-white tracking-[0.2em] uppercase">
              Tham gia cộng đồng
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold text-center animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <div className="space-y-1">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Tên đăng nhập
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <User size={14} />
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-transparent focus:border-primary/30 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all outline-none text-xs font-medium dark:text-white"
                    placeholder="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Họ và tên
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <User size={14} />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-transparent focus:border-primary/30 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all outline-none text-xs font-medium dark:text-white"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email công việc
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <Mail size={14} />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-transparent focus:border-primary/30 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all outline-none text-xs font-medium dark:text-white"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Số điện thoại
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <Phone size={14} />
                  </div>
                  <input
                    type="tel"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-transparent focus:border-primary/30 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all outline-none text-xs font-medium dark:text-white"
                    placeholder="0987..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Ngày sinh
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <Calendar size={14} />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-transparent focus:border-primary/30 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all outline-none text-xs font-medium dark:text-white"
                    value={formData.birthday}
                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Lĩnh vực hoạt động
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <Briefcase size={14} />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-transparent focus:border-primary/30 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all outline-none text-xs font-medium dark:text-white"
                    placeholder="Kỹ sư hệ thống, DevOps, Developer..."
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Mật khẩu
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <Lock size={14} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-transparent focus:border-primary/30 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all outline-none text-xs font-medium dark:text-white"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Xác nhận lại
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <Lock size={14} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-transparent focus:border-primary/30 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all outline-none text-xs font-medium dark:text-white"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={loading}
                className="w-full py-3 text-sm rounded-xl shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-blue-600 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                Đăng ký thành viên
              </Button>
            </div>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 font-medium">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-primary font-bold hover:text-blue-600 transition-colors">
                Đăng nhập tại đây
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
