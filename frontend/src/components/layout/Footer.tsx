'use client';

import Link from 'next/link';
import { Github, Linkedin, Mail, Users, BarChart3 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import { useAuth } from '@/context/AuthContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<{ onlineCount: number; totalVisits: number } | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (pathname.startsWith('/portal-dashboard') || pathname === '/maintenance') return;

    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/v1/stats/counters`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
    // Poll every 30s for online status
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [pathname]);

  if (pathname.startsWith('/portal-dashboard') || pathname === '/maintenance') {
    return null;
  }

  return (
    <footer className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
      <div suppressHydrationWarning={true} className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div suppressHydrationWarning={true} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-display font-bold text-gradient">
              Portfolio
            </Link>
            <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-sm">
              Đam mê xây dựng những ứng dụng web hiện đại, hiệu quả và mang lại giá trị tốt nhất cho người dùng. Chuyên về System Engineering và Fullstack Development.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="https://github.com/luudinhmac" target="_blank" className="p-2 glass rounded-full hover:text-primary transition-colors">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" className="p-2 glass rounded-full hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="mailto:luumac2801@gmail.com" className="p-2 glass rounded-full hover:text-primary transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Khám phá
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Blog / Bài viết</Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Hồ sơ cá nhân</Link>
              </li>
              <li>
                <Link href="/about#projects" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Dự án</Link>
              </li>
            </ul>
          </div>

          {/* Admin Section */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Quản trị
            </h3>
            <ul className="mt-4 space-y-2">
              {isAuthenticated && user && ['admin', 'superadmin'].includes(user.role) && (
                <li>
                  <Link href="/portal-dashboard" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Dashboard</Link>
                </li>
              )}
              {!isAuthenticated && (
                <li>
                  <Link href="/login" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Đăng nhập</Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div suppressHydrationWarning={true} className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-slate-500">
          <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-2 md:space-y-0">
             <p>© {currentYear} Macld. Bản quyền đã được bảo hộ.</p>
             {!loadingStats && stats && (
               <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>{stats.onlineCount} Đang trực tuyến</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <div className="flex items-center gap-1.5">
                    <BarChart3 size={12} />
                    <span>{stats.totalVisits.toLocaleString()} Lượt truy cập</span>
                  </div>
               </div>
             )}
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">Quyền riêng tư</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Điều khoản</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

