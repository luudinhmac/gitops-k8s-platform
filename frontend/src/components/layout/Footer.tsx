'use client';

import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
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
              <li>
                <Link href="/admin" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Đăng nhập</Link>
              </li>
            </ul>
          </div>
        </div>

        <div suppressHydrationWarning={true} className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-slate-500">
          <p>© {currentYear} Macld. Bản quyền đã được bảo hộ.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">Quyền riêng tư</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Điều khoản</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
