'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight, LayoutDashboard, User, LogOut, PenSquare, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Dự án', href: '/projects' },
  { name: 'Khóa học', href: '/courses' },
  { name: 'Giới thiệu', href: '/about' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, loading, logout } = useAuth();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4", scrolled ? "py-3" : "py-6")}>
      <div className={cn(
        "max-w-7xl mx-auto glass rounded-2xl md:rounded-[2rem] px-6 transition-all duration-300",
        scrolled ? "py-3 shadow-lg" : "py-4 bg-transparent border-transparent"
      )}>
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-display font-bold text-gradient">
            Portfolio
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors">
                {item.name}
              </Link>
            ))}

            {!loading && (
              isAuthenticated && user ? (
                /* Avatar Dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2.5 pl-1 pr-3 py-1 glass rounded-full hover:shadow-md transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                      {(user.fullname || user.username)?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                      {user.fullname || user.username}
                    </span>
                    <ChevronDown size={14} className={cn("text-slate-400 transition-transform", dropdownOpen && "rotate-180")} />
                  </button>

                  {/* Dropdown Menu */}
                  <div className={cn(
                    "absolute right-0 top-full mt-2 w-52 glass rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-200 origin-top-right",
                    dropdownOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                  )}>
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.fullname || user.username}</p>
                      <p className={cn(
                        "text-[10px] font-extrabold uppercase tracking-wider mt-0.5",
                        user.role === 'admin' ? "text-amber-500" : "text-blue-500"
                      )}>{user.role}</p>
                    </div>

                    <div className="p-2 space-y-0.5">
                      <Link href="/profile" onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                        <User size={16} className="mr-2.5" /> Hồ sơ cá nhân
                      </Link>

                      <Link href="/admin/posts/new" onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                        <PenSquare size={16} className="mr-2.5" /> Viết bài mới
                      </Link>

                      {user.role === 'admin' && (
                        <Link href="/admin" onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                          <LayoutDashboard size={16} className="mr-2.5" /> Trang quản trị
                        </Link>
                      )}
                    </div>

                    <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                      <button onClick={() => { logout(); setDropdownOpen(false); }}
                        className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                        <LogOut size={16} className="mr-2.5" /> Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login"
                  className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-md shadow-primary/20 flex items-center group">
                  Đăng nhập
                  <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              )
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-slate-600 dark:text-slate-300" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden absolute top-24 left-4 right-4 glass rounded-3xl p-6 transition-all duration-300 origin-top shadow-2xl",
        isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
      )}>
        <div className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}
              className="text-lg font-medium text-slate-700 dark:text-slate-200"
              onClick={() => setIsOpen(false)}>
              {item.name}
            </Link>
          ))}

          {!loading && (
            isAuthenticated && user ? (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold">
                    {(user.fullname || user.username)?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{user.fullname || user.username}</p>
                    <p className="text-xs text-slate-400">{user.role}</p>
                  </div>
                </div>
                <Link href="/profile" onClick={() => setIsOpen(false)}
                  className="flex items-center w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium">
                  <User size={18} className="mr-3" /> Hồ sơ cá nhân
                </Link>
                <Link href="/admin/posts/new" onClick={() => setIsOpen(false)}
                  className="flex items-center w-full py-3 px-4 rounded-2xl bg-primary/10 text-primary font-medium">
                  <PenSquare size={18} className="mr-3" /> Viết bài mới
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" onClick={() => setIsOpen(false)}
                    className="flex items-center w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium">
                    <LayoutDashboard size={18} className="mr-3" /> Trang quản trị
                  </Link>
                )}
                <button onClick={() => { logout(); setIsOpen(false); }}
                  className="flex items-center w-full py-3 px-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 font-medium">
                  <LogOut size={18} className="mr-3" /> Đăng xuất
                </button>
              </div>
            ) : (
              <Link href="/login"
                className="w-full py-4 bg-primary text-white rounded-2xl text-center font-medium shadow-lg shadow-primary/20 flex items-center justify-center"
                onClick={() => setIsOpen(false)}>
                Đăng nhập
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
