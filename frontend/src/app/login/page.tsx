'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/shared/components/ui/Button';

// Modular Services
import { authService } from '@/features/auth/services/authService';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const { login, isAuthenticated, user: authUser, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated && authUser) {
      const isAdmin = ['admin', 'superadmin'].includes(authUser.role || '');
      let target = redirectPath;
      
      // If user is admin and target is home, suggest admin dashboard
      if (isAdmin && target === '/') {
        target = '/portal-dashboard';
      }
      
      // If user is not admin but trying to go to admin, redirect to home
      if (target.startsWith('/portal-dashboard') && !isAdmin) {
        target = '/';
      }
      
      router.push(target);
    }
  }, [authLoading, isAuthenticated, authUser, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authService.login(formData);

      if (data.success === false) {
        throw new Error(data.message || 'Sai tên đăng nhập hoặc mật khẩu');
      }

      // Update AuthContext and redirect
      login(data.user);

      // Determine redirect path based on role
      let finalRedirect = redirectPath;
      const isAdmin = ['admin', 'superadmin'].includes(data.user.role);

      if (isAdmin && finalRedirect === '/') {
        finalRedirect = '/portal-dashboard';
      }

      if (finalRedirect.startsWith('/portal-dashboard') && !isAdmin) {
        finalRedirect = '/';
      }

      router.push(finalRedirect);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
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
    <div className="min-h-screen flex items-center justify-center px-4 py-6 relative overflow-hidden bg-slate-50/50 dark:bg-slate-950">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-[380px] w-full relative z-10">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4 px-2">
          <Link
            href="/"
            className="inline-flex items-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all group"
          >
            <ArrowLeft size={12} className="mr-1.5 group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-700">
            Authentication
          </span>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 shadow-2xl relative overflow-hidden ring-1 ring-black/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold text-center animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Tên đăng nhập
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <Mail size={14} />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-transparent focus:border-primary/30 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all outline-none text-xs font-medium dark:text-white"
                  placeholder="Username hoặc email"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

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
                  autoComplete="current-password"
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

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={loading}
                className="w-full py-3 text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Đăng nhập
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] text-slate-500 font-medium">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-primary font-bold hover:text-blue-600 transition-colors ml-1">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950"><Loader2 size={40} className="animate-spin text-primary" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
