'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, User, Eye, EyeOff, Loader2, ArrowLeft, Phone, Calendar, Briefcase } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center px-4 py-4 md:py-8 relative overflow-hidden bg-slate-50/50 dark:bg-slate-950">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-xl w-full relative z-10">
        {/* Back to Home - More Compact */}
        <div className="flex justify-between items-center mb-4 px-2">
          <Link
            href="/"
            className="inline-flex items-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all group"
          >
            <ArrowLeft size={12} className="mr-1.5 group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-700">
            Registration
          </span>
        </div>

        {/* Register Card - Optimized for 1366x768 */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 shadow-2xl relative overflow-hidden ring-1 ring-black/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold text-center animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}

            {/* Grid for efficiency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3.5">
              {/* Username */}
              <div className="space-y-1.5">
                <label htmlFor="username" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Tên tài khoản
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <User size={14} />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    autoFocus
                    autoComplete="username"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-transparent focus:border-primary/30 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all outline-none text-xs font-medium dark:text-white"
                    placeholder="Tên nguời dùng"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {/* Fullname */}
              <div className="space-y-1.5">
                <label htmlFor="fullname" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Họ và tên
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <User size={14} />
                  </div>
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    required
                    autoComplete="name"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-transparent focus:border-primary/30 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all outline-none text-xs font-medium dark:text-white"
                    placeholder="họ và tên"
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {/* Email - Full Width in Grid */}
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="email" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <Mail size={14} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-transparent focus:border-primary/30 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all outline-none text-xs font-medium dark:text-white"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Số điện thoại
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <Phone size={14} />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-transparent focus:border-primary/30 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all outline-none text-xs font-medium dark:text-white"
                    placeholder="0987..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {/* Birthday */}
              <div className="space-y-1.5">
                <label htmlFor="birthday" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Ngày sinh
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <Calendar size={14} />
                  </div>
                  <input
                    id="birthday"
                    name="birthday"
                    type="date"
                    autoComplete="bday"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-transparent focus:border-primary/30 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all outline-none text-xs font-medium dark:text-white"
                    value={formData.birthday}
                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {/* Profession - Full Width */}
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="profession" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Nghề nghiệp
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <Briefcase size={14} />
                  </div>
                  <input
                    id="profession"
                    name="profession"
                    type="text"
                    autoComplete="on"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-transparent focus:border-primary/30 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all outline-none text-xs font-medium dark:text-white"
                    placeholder="System Engineer, DevOps, Developer..."
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Mật khẩu
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <Lock size={14} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-transparent focus:border-primary/30 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all outline-none text-xs font-medium dark:text-white"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    id="password-toggle"
                    type="button"
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Xác nhận mật khẩu
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <Lock size={14} />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-transparent focus:border-primary/30 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all outline-none text-xs font-medium dark:text-white"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="pt-3">
              <Button
                type="submit"
                isLoading={loading}
                className="w-full py-3 text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Đăng ký
              </Button>
            </div>
          </form>

          {/* Footer Section */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] text-slate-500 font-medium">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-primary font-bold hover:text-blue-600 transition-colors ml-1">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
